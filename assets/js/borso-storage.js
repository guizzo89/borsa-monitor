(function(global) {
    const DB_NAME = 'borsaLocalDb';
    const STORE_NAME = 'kv';
    const DB_VERSION = 1;
    const memoryStore = new Map();
    let dbPromise = null;

    function canUseLocalStorage() {
        try {
            const key = '__borsa_storage_test__';
            global.localStorage.setItem(key, '1');
            global.localStorage.removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    }

    const localStorageOk = canUseLocalStorage();

    function getLocalRaw(key) {
        if (!localStorageOk) return null;
        try {
            const value = global.localStorage.getItem(key);
            return value === null ? null : value;
        } catch (e) {
            return null;
        }
    }

    function setLocalRaw(key, value) {
        if (!localStorageOk) return false;
        try {
            global.localStorage.setItem(key, value);
            return true;
        } catch (e) {
            return false;
        }
    }

    function removeLocalRaw(key) {
        if (!localStorageOk) return false;
        try {
            global.localStorage.removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    }

    function openDb() {
        if (dbPromise !== null) return dbPromise;
        if (!('indexedDB' in global)) {
            dbPromise = Promise.resolve(null);
            return dbPromise;
        }

        dbPromise = new Promise(function(resolve) {
            try {
                const request = global.indexedDB.open(DB_NAME, DB_VERSION);
                request.onupgradeneeded = function() {
                    const db = request.result;
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        db.createObjectStore(STORE_NAME);
                    }
                };
                request.onsuccess = function() { resolve(request.result); };
                request.onerror = function() { resolve(null); };
            } catch (e) {
                resolve(null);
            }
        });

        return dbPromise;
    }

    async function getDbRaw(key) {
        const db = await openDb();
        if (!db) return null;

        return new Promise(function(resolve) {
            try {
                const tx = db.transaction(STORE_NAME, 'readonly');
                const request = tx.objectStore(STORE_NAME).get(key);
                request.onsuccess = function() {
                    resolve(request.result === undefined ? null : request.result);
                };
                request.onerror = function() { resolve(null); };
            } catch (e) {
                resolve(null);
            }
        });
    }

    async function setDbRaw(key, value) {
        const db = await openDb();
        if (!db) return false;

        return new Promise(function(resolve) {
            try {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).put(value, key);
                tx.oncomplete = function() { resolve(true); };
                tx.onerror = function() { resolve(false); };
            } catch (e) {
                resolve(false);
            }
        });
    }

    async function removeDbRaw(key) {
        const db = await openDb();
        if (!db) return false;

        return new Promise(function(resolve) {
            try {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).delete(key);
                tx.oncomplete = function() { resolve(true); };
                tx.onerror = function() { resolve(false); };
            } catch (e) {
                resolve(false);
            }
        });
    }

    async function migrateKeys(keys) {
        const uniqueKeys = Array.from(new Set((keys || []).filter(Boolean)));
        for (const key of uniqueKeys) {
            const dbValue = await getDbRaw(key);
            if (dbValue !== null) {
                if (getLocalRaw(key) !== dbValue) setLocalRaw(key, dbValue);
                memoryStore.set(key, dbValue);
                continue;
            }

            const localValue = getLocalRaw(key);
            if (localValue !== null) {
                await setDbRaw(key, localValue);
                memoryStore.set(key, localValue);
            }
        }
    }

    async function ready(keys) {
        await openDb();
        await migrateKeys(keys);
        return api;
    }

    async function getRaw(key) {
        const dbValue = await getDbRaw(key);
        if (dbValue !== null) return dbValue;

        const localValue = getLocalRaw(key);
        if (localValue !== null) return localValue;

        return memoryStore.has(key) ? memoryStore.get(key) : null;
    }

    async function setRaw(key, value) {
        if (value === null || value === undefined) return remove(key);

        const normalized = String(value);
        memoryStore.set(key, normalized);

        const dbSaved = await setDbRaw(key, normalized);
        const localSaved = setLocalRaw(key, normalized);
        return dbSaved || localSaved;
    }

    async function remove(key) {
        memoryStore.delete(key);
        const dbRemoved = await removeDbRaw(key);
        const localRemoved = removeLocalRaw(key);
        return dbRemoved || localRemoved;
    }

    async function getJSON(key, fallbackValue) {
        const raw = await getRaw(key);
        if (raw === null) return fallbackValue;
        try {
            return JSON.parse(raw);
        } catch (e) {
            return fallbackValue;
        }
    }

    async function setJSON(key, value) {
        return setRaw(key, JSON.stringify(value));
    }

    async function mergeJSON(key, patch) {
        const current = await getJSON(key, {});
        const base = current && typeof current === 'object' ? current : {};
        const next = Object.assign({}, base, patch || {});
        await setJSON(key, next);
        return next;
    }

    async function hasPersistentStorage() {
        const db = await openDb();
        return !!db || localStorageOk;
    }

    async function getBackendName() {
        const db = await openDb();
        if (db) return 'indexedDB';
        if (localStorageOk) return 'localStorage';
        return 'memory';
    }

    const api = {
        ready: ready,
        migrateKeys: migrateKeys,
        getRaw: getRaw,
        setRaw: setRaw,
        remove: remove,
        getJSON: getJSON,
        setJSON: setJSON,
        mergeJSON: mergeJSON,
        hasPersistentStorage: hasPersistentStorage,
        getBackendName: getBackendName
    };

    global.BorsaStorage = api;
})(window);
