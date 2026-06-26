(function (global) {
    'use strict';

    var CSS = [
        '#bsyncBtn{display:inline-flex;align-items:center;gap:5px;font-size:0.82rem;font-weight:500;',
        'background:var(--btn-bg,#2a2a4a);color:var(--text-primary,#e0e0e0);border:1px solid var(--border,#2a2a4a);',
        'padding:5px 12px;border-radius:6px;cursor:pointer;white-space:nowrap;transition:all .15s}',
        '#bsyncBtn:hover{background:var(--btn-hover,#3a3a5a);border-color:var(--accent,#e94560)}',
        '#bsyncBtn.synced{border-color:#2ecc71}',
        '#bsyncBtn.error{border-color:#e74c3c}',
        '#bsyncOverlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9000;align-items:center;justify-content:center}',
        '#bsyncOverlay.open{display:flex}',
        '#bsyncModal{background:var(--bg-secondary,#16213e);border:1px solid var(--border,#2a2a4a);',
        'border-radius:12px;padding:28px 28px 22px;width:340px;max-width:94vw}',
        '#bsyncModal h2{font-size:1.05rem;font-weight:700;margin-bottom:18px}',
        '#bsyncModal input{width:100%;padding:8px 12px;border-radius:6px;border:1px solid var(--border,#2a2a4a);',
        'background:var(--btn-bg,#2a2a4a);color:var(--text-primary,#e0e0e0);font-size:.88rem;',
        'margin-bottom:10px;box-sizing:border-box;outline:none}',
        '#bsyncModal input:focus{border-color:var(--accent,#e94560)}',
        '#bsyncErr{color:#e74c3c;font-size:.8rem;min-height:18px;margin-bottom:8px}',
        '#bsyncInfo{color:#2ecc71;font-size:.8rem;min-height:18px;margin-bottom:8px}',
        '.bsync-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:4px}',
        '.bsync-btn-cancel,.bsync-btn-submit{padding:7px 16px;border-radius:6px;border:1px solid var(--border,#2a2a4a);',
        'cursor:pointer;font-size:.82rem;font-weight:500;background:var(--btn-bg,#2a2a4a);color:var(--text-primary,#e0e0e0)}',
        '.bsync-btn-submit{background:#e94560;color:#fff;border-color:#e94560}',
        '.bsync-btn-submit:disabled{opacity:.6;cursor:not-allowed}',
        '.bsync-toggle{font-size:.78rem;color:var(--text-secondary,#a0a0a0);margin-top:10px;text-align:center;cursor:pointer}',
        '.bsync-toggle span{color:#e94560;text-decoration:underline}',
        '#bsyncUserMenu{display:none;position:absolute;top:100%;right:0;z-index:9001;margin-top:4px;',
        'background:var(--bg-secondary,#16213e);border:1px solid var(--border,#2a2a4a);',
        'border-radius:8px;padding:6px;min-width:200px;box-shadow:0 4px 16px rgba(0,0,0,.35)}',
        '#bsyncUserMenu button{display:block;width:100%;text-align:left;padding:7px 12px;border:none;',
        'background:none;color:var(--text-primary,#e0e0e0);cursor:pointer;border-radius:4px;font-size:.8rem}',
        '#bsyncUserMenu button:hover{background:var(--btn-hover,#3a3a5a)}',
        '#bsyncUserMenu .bsync-email{font-size:.72rem;color:var(--text-secondary,#a0a0a0);',
        'padding:4px 12px 8px;word-break:break-all;border-bottom:1px solid var(--border,#2a2a4a);margin-bottom:4px}',
        '#bsyncWrap{position:relative}'
    ].join('');

    function injectStyles() {
        if (document.getElementById('bsyncStyles')) return;
        var s = document.createElement('style');
        s.id = 'bsyncStyles';
        s.textContent = CSS;
        document.head.appendChild(s);
    }

    function buildModal() {
        var ov = document.createElement('div');
        ov.id = 'bsyncOverlay';
        ov.innerHTML = [
            '<div id="bsyncModal">',
            '<h2 id="bsyncTitle">Accedi al cloud</h2>',
            '<input type="email" id="bsyncEmail" placeholder="Email" autocomplete="email"/>',
            '<input type="password" id="bsyncPass" placeholder="Password" autocomplete="current-password"/>',
            '<div id="bsyncErr"></div>',
            '<div id="bsyncInfo"></div>',
            '<div class="bsync-actions">',
            '<button class="bsync-btn-cancel" id="bsyncCancel">Annulla</button>',
            '<button class="bsync-btn-submit" id="bsyncSubmit">Accedi</button>',
            '</div>',
            '<div class="bsync-toggle" id="bsyncToggle">Non hai un account? <span>Registrati</span></div>',
            '</div>'
        ].join('');
        document.body.appendChild(ov);
    }

    function buildButton(placeholder) {
        var wrap = document.createElement('div');
        wrap.id = 'bsyncWrap';

        var btn = document.createElement('button');
        btn.id = 'bsyncBtn';
        btn.title = 'Sincronizzazione cloud';
        btn.innerHTML = '☁ Accedi';

        var menu = document.createElement('div');
        menu.id = 'bsyncUserMenu';
        menu.innerHTML = [
            '<div class="bsync-email" id="bsyncEmailLabel">—</div>',
            '<button id="bsyncSyncNow">↻ Sincronizza ora</button>',
            '<button id="bsyncLogout">Esci dall\'account</button>'
        ].join('');

        wrap.appendChild(btn);
        wrap.appendChild(menu);
        placeholder.replaceWith(wrap);
        return { btn, menu };
    }

    var isRegisterMode = false;
    var menuOpen = false;

    function openModal() {
        var ov = document.getElementById('bsyncOverlay');
        if (!ov) return;
        document.getElementById('bsyncErr').textContent = '';
        document.getElementById('bsyncInfo').textContent = '';
        document.getElementById('bsyncEmail').value = '';
        document.getElementById('bsyncPass').value = '';
        ov.classList.add('open');
        document.getElementById('bsyncEmail').focus();
    }

    function closeModal() {
        var ov = document.getElementById('bsyncOverlay');
        if (ov) ov.classList.remove('open');
    }

    function setRegisterMode(on) {
        isRegisterMode = on;
        document.getElementById('bsyncTitle').textContent = on ? 'Crea account' : 'Accedi al cloud';
        document.getElementById('bsyncSubmit').textContent = on ? 'Registrati' : 'Accedi';
        var hint = document.getElementById('bsyncToggle');
        hint.innerHTML = on
            ? 'Hai già un account? <span>Accedi</span>'
            : 'Non hai un account? <span>Registrati</span>';
    }

    function setMenuOpen(open) {
        menuOpen = open;
        var menu = document.getElementById('bsyncUserMenu');
        if (menu) menu.style.display = open ? 'block' : 'none';
    }

    function updateButtonState(user) {
        var btn = document.getElementById('bsyncBtn');
        if (!btn) return;

        if (!user) {
            btn.innerHTML = '☁ Accedi';
            btn.className = '';
            btn.id = 'bsyncBtn';
            setMenuOpen(false);
            return;
        }

        var initials = (user.email || '?')[0].toUpperCase();
        btn.innerHTML = '☁ ' + initials;
        btn.classList.add('synced');

        var label = document.getElementById('bsyncEmailLabel');
        if (label) label.textContent = user.email;
    }

    async function handleSubmit() {
        var email = (document.getElementById('bsyncEmail').value || '').trim();
        var pass = (document.getElementById('bsyncPass').value || '').trim();
        var errEl = document.getElementById('bsyncErr');
        var infoEl = document.getElementById('bsyncInfo');
        var submitBtn = document.getElementById('bsyncSubmit');

        errEl.textContent = '';
        infoEl.textContent = '';

        if (!email || !pass) { errEl.textContent = 'Compila tutti i campi.'; return; }

        submitBtn.disabled = true;
        submitBtn.textContent = '...';

        try {
            if (isRegisterMode) {
                await global.BorsaSync.register(email, pass);
                infoEl.textContent = 'Account creato! Controlla la tua email per confermare, poi accedi.';
                setRegisterMode(false);
            } else {
                await global.BorsaSync.login(email, pass);
                infoEl.textContent = 'Accesso eseguito, sincronizzazione in corso…';
                // La pagina si ricaricherà automaticamente dopo il pull
            }
        } catch (e) {
            errEl.textContent = e.message || 'Errore sconosciuto.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = isRegisterMode ? 'Registrati' : 'Accedi';
        }
    }

    function bindEvents() {
        document.getElementById('bsyncCancel').addEventListener('click', closeModal);
        document.getElementById('bsyncOverlay').addEventListener('click', function (e) {
            if (e.target === document.getElementById('bsyncOverlay')) closeModal();
        });
        document.getElementById('bsyncSubmit').addEventListener('click', handleSubmit);
        document.getElementById('bsyncEmail').addEventListener('keydown', function (e) {
            if (e.key === 'Enter') document.getElementById('bsyncPass').focus();
        });
        document.getElementById('bsyncPass').addEventListener('keydown', function (e) {
            if (e.key === 'Enter') handleSubmit();
        });
        document.getElementById('bsyncToggle').addEventListener('click', function () {
            setRegisterMode(!isRegisterMode);
        });

        var btn = document.getElementById('bsyncBtn');
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (global.BorsaSync.getUser()) {
                setMenuOpen(!menuOpen);
            } else {
                openModal();
            }
        });

        document.getElementById('bsyncSyncNow').addEventListener('click', async function () {
            setMenuOpen(false);
            var btn = document.getElementById('bsyncBtn');
            btn.innerHTML = '☁ ↻';
            await global.BorsaSync.pushAll();
            var u = global.BorsaSync.getUser();
            var initials = u ? u.email[0].toUpperCase() : '';
            btn.innerHTML = '☁ ' + initials;
        });

        document.getElementById('bsyncLogout').addEventListener('click', async function () {
            setMenuOpen(false);
            await global.BorsaSync.logout();
        });

        document.addEventListener('click', function () {
            if (menuOpen) setMenuOpen(false);
        });
    }

    function init() {
        if (!global.BorsaSync) return;

        injectStyles();
        buildModal();

        var placeholder = document.querySelector('[data-borsa-auth]');
        if (placeholder) {
            buildButton(placeholder);
            bindEvents();
        }

        if (!global.BorsaSync.isConfigured()) {
            var btn = document.getElementById('bsyncBtn');
            if (btn) {
                btn.title = 'Supabase non configurato. Modifica assets/js/borsa-config.js';
                btn.style.opacity = '0.45';
                btn.style.cursor = 'not-allowed';
            }
            return;
        }

        global.BorsaSync.onAuthChange(updateButtonState);
        global.BorsaSync.init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(window);
