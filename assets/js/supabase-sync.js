(function (global) {
    'use strict';

    var cfg = global.BorsaConfig || {};
    var SUPABASE_URL = cfg.supabaseUrl || '';
    var SUPABASE_ANON_KEY = cfg.supabaseAnonKey || '';
    var PULL_TS_KEY = 'borsasync_ts';
    var PULL_INTERVAL = 60 * 1000; // 1 minuto

    var SYNC_KEYS = [
        'dashboardBorsa',
        'dashboardBorsaPresets',
        'rankingCustomCats',
        'portfolioBorsa',
        'borsaAlerts'
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
            if (v !== null) rows.push({ user_id: _user.id, key: k, value: v });
        }
        if (!rows.length) return;
        var res = await _client.from('user_settings').upsert(rows, { onConflict: 'user_id,key' });
        if (res.error) console.warn('[BorsaSync] push error:', res.error.message);
    }

    function patchStorage() {
        if (_origSetRaw) return;
        _origSetRaw = global.BorsaStorage.setRaw;
        var origSetJSON = global.BorsaStorage.setJSON;

        global.BorsaStorage.setRaw = function (key, value) {
            var result = _origSetRaw.call(global.BorsaStorage, key, value);
            if (SYNC_KEYS.indexOf(key) !== -1) schedulePush(key);
            return result;
        };

        // setJSON chiama la closure interna di setRaw, non api.setRaw,
        // quindi va patchato separatamente.
        global.BorsaStorage.setJSON = function (key, value) {
            var result = origSetJSON.call(global.BorsaStorage, key, value);
            if (SYNC_KEYS.indexOf(key) !== -1) schedulePush(key);
            return result;
        };
    }

    // Ritorna 'changed' | 'unchanged' | false
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
            var changed = false;

            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                if (row.value === null) continue;
                var localVal = await global.BorsaStorage.getRaw(row.key);
                if (localVal !== row.value) {
                    await _origSetRaw.call(global.BorsaStorage, row.key, row.value);
                    changed = true;
                }
            }

            global.dispatchEvent(new CustomEvent('borsasync:pulled'));
            return changed ? 'changed' : 'unchanged';
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

    // Esegue pull se è passato abbastanza tempo dall'ultimo.
    // Ricarica la pagina solo se i dati sono cambiati.
    async function _trySync() {
        if (!_user) return;
        var lastPull = parseInt(localStorage.getItem(PULL_TS_KEY) || '0');
        if (Date.now() - lastPull < PULL_INTERVAL) return;

        var result = await pullAll();
        if (result !== false) {
            localStorage.setItem(PULL_TS_KEY, String(Date.now()));
            if (result === 'changed') {
                window.location.reload();
            }
        }
    }

    async function _handleSessionReady(user) {
        notifyAuth(user);
        if (!user) return;
        await _trySync();
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
                localStorage.removeItem(PULL_TS_KEY);
                notifyAuth(null);
                return;
            }
            if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                _handleSessionReady(user);
            }
        });

        // Auto-sync quando la tab torna visibile
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'visible') {
                _trySync();
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
        localStorage.removeItem(PULL_TS_KEY);
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
