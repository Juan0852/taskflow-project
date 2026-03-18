const AUTH_BASE_URL = 'http://localhost:3000/api/auth';

async function request(path, options = {}) {
    const response = await fetch(`${AUTH_BASE_URL}${path}`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
        ? await response.json()
        : null;

    if (!response.ok) {
        const error = new Error(payload?.message || 'La solicitud de autenticación falló.');
        error.status = response.status;
        error.code = payload?.code || 'AUTH_REQUEST_FAILED';
        error.payload = payload;
        throw error;
    }

    return payload;
}

export const AuthService = {
    currentUser: null,

    async login(credentials) {
        const user = await request('/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });

        this.currentUser = user;
        return user;
    },

    async logout() {
        await request('/logout', {
            method: 'POST'
        });

        this.currentUser = null;
    },

    async getCurrentUser() {
        try {
            const user = await request('/me', {
                method: 'GET'
            });

            this.currentUser = user;
            return user;
        } catch (error) {
            if (error.status === 401) {
                this.currentUser = null;
                return null;
            }

            throw error;
        }
    }
};
