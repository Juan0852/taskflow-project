export const StorageService = {
    getString(key, fallback = '') {
        try {
            const value = localStorage.getItem(key);
            return value ?? fallback;
        } catch (error) {
            return fallback;
        }
    },

    setString(key, value) {
        try {
            localStorage.setItem(key, String(value));
            return true;
        } catch (error) {
            return false;
        }
    },

    getJSON(key, fallback = null) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (error) {
            return fallback;
        }
    },

    setJSON(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            return false;
        }
    }
};
