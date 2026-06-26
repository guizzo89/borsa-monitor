(function (global) {
    'use strict';

    var cfg = global.BorsaConfig || {};
    var SUPABASE_URL = cfg.supabaseUrl || '';
    var SUPABASE_ANON_KEY = cfg.supabaseAnonKey || '';
    var SESSION_FLAG = 'borsasync_ready';

    var SYNC_KEYS = [
        'dashboardBorsa',
        'dashboardBorsaPresets',
        'rankingCustomCats',
        'portfolioBorsa'
    ];

    var _client = null;
    var _user = null;
    var _authListeners = [];
    var _pushTimer = null;
    var _pendingKeys = new Set();
    var _initialized = false;
    var _origSetRaw = null;

    function isConfigured() {
        return !!(SUPABASE_URL && SUPABASE_ANON_KEY &&
            !SUPABASE_URL.includes('YOUR_PROJECT_ID'));
    }

    function notifyAuth(user) {
        _user = user;
        _authListeners.forEach(function (fn) { try { fn(user); } catch (e) {} });
    }

    function schedulePush(key) {
        if (!_user) return;
        _pendingKeys.add(key);
        clearTimeout(_pushTimer);
        _pushTimer = setTimeout(flushPendingPush, 1500);
    }

    async function flushPendingPush() {
        if (!_user || !_client) return;
        var keys = Array.from(_pendingKeys);
        _pendingKeys.clear();
        var rows = [];
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var v = await global.BorsaStorage.getRaw(k);
            if (v !== null) {
                rows.push({ user_id: _user.id, key: k, value: v });
            }
        }
        if (!rows.length) return;
        var res = await _client.from('user_settings').upsert(rows, { onConflict: 'user_id,key' });
        if (res.error) console.warn('[BorsaSync] push error:', res.error.message);
    }

    function patchStorage() {
        if (_origSetRaw) return;
        _origSetRaw = global.BorsaStorage.setRaw;
        var origSetJSON = global.BorsaStorage.setJSON;

        // setRaw patch (for direct callers)
        global.BorsaStorage.setRaw = function (key, value) {
            var result = _origSetRaw.call(global.BorsaStorage, key, value);
            if (SYNC_KEYS.indexOf(key) !== -1) schedulePush(key);
            return result;
        };

        // setJSON patch — setJSON calls the internal closure setRaw, NOT api.setRaw,
        // so we must intercept here too to catch all saves made via setJSON.
        global.BorsaStorage.setJSON = function (key, value) {
            var result = origSetJSON.call(global.BorsaStorage, key, value);
            if (SYNC_KEYS.indexOf(key) !== -1) schedulePush(key);
            return result;
        };
    }

    async function pullAll() {
        if (!_user || !_client) return false;
        try {
            var res = await _client
                .from('user_settings')
                .select('key, value')
                .eq('user_id', _user.id)
                .in('key', SYNC_KEYS);

            if (res.error) {
                console.warn('[BorsaSync] pull error:', res.error.message);
                return false;
            }

            var rows = res.data || [];
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                if (row.value !== null && _origSetRaw) {
                    await _origSetRaw.call(global.BorsaStorage, row.key, row.value);
                }
            }
            global.dispatchEvent(new CustomEvent('borsasync:pulled'));
            return true;
        } catch (e) {
            console.warn('[BorsaSync] pull exception:', e);
            return false;
        }
    }

    async function pushAll() {
        if (!_user || !_client) return;
        SYNC_KEYS.forEach(function (k) { _pendingKeys.add(k); });
        clearTimeout(_pushTimer);
        await flushPendingPush();
    }

    async function _handleSessionReady(user) {
        notifyAuth(user);
        if (!user) return;

        var alreadyPulled = sessionStorage.getItem(SESSION_FLAG) === '1';
        if (alreadyPulled) return;

        var ok = await pullAll();
        if (ok) {
            sessionStorage.setItem(SESSION_FLAG, '1');
            window.location.reload();
        }
    }

    async function init() {
        if (_initialized) return true;
        if (!isConfigured()) return false;
        if (!global.supabase || typeof global.supabase.createClient !== 'function') {
            console.warn('[BorsaSync] Supabase SDK non caricato.');
            return false;
        }

        _client = global.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        _initialized = true;
        patchStorage();

        _client.auth.onAuthStateChange(function (event, session) {
            var user = session ? session.user : null;
            if (event === 'SIGNED_OUT') {
                sessionStorage.removeItem(SESSION_FLAG);
                notifyAuth(null);
                return;
            }
            if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                _handleSessionReady(user);
            }
        });

        return true;
    }

    async function login(email, password) {
        var res = await _client.auth.signInWithPassword({ email: email, password: password });
        if (res.error) throw new Error(res.error.message);
        return res.data;
    }

    async function register(email, password) {
        var res = await _client.auth.signUp({ email: email, password: password });
        if (res.error) throw new Error(res.error.message);
        return res.data;
    }

    async function logout() {
        clearTimeout(_pushTimer);
        _pendingKeys.clear();
        if (_client) await _client.auth.signOut();
    }

    global.BorsaSync = {
        isConfigured: isConfigured,
        init: init,
        login: login,
        register: register,
        logout: logout,
        pushAll: pushAll,
        pullAll: pullAll,
        getUser: function () { return _user; },
        onAuthChange: function (fn) { _authListeners.push(fn); },
        SYNC_KEYS: SYNC_KEYS
    };
})(window);
