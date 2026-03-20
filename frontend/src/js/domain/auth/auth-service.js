import { LoginRequestDTO } from './dtos/login.request.dto.js';
import { AuthUserResponseDTO } from './dtos/auth-user.response.dto.js';
import { RegisterRequestDTO } from './dtos/register.request.dto.js';
import { RegisterResponseDTO } from './dtos/register.response.dto.js';
import { AppConfig } from '../../shared/config.js';

const AUTH_BASE_URL = `${AppConfig.apiBaseUrl}/auth`;

function createValidationError(result, fallbackMessage = 'Los datos introducidos no son válidos.') {
    const firstIssue = result?.error?.issues?.[0];
    const message = firstIssue?.message || fallbackMessage;
    const field = firstIssue?.path?.[0];
    const error = new Error(message);
    error.code = 'AUTH_VALIDATION_ERROR';
    error.payload = {
        code: 'AUTH_VALIDATION_ERROR',
        message,
        field,
        issues: result?.error?.issues || []
    };
    return error;
}

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

    isLoggedIn() {
        return Boolean(this.currentUser);
    },

    async register(payload) {
        const parsedPayloadResult = RegisterRequestDTO.safeParse(payload);

        if (!parsedPayloadResult.success) {
            throw createValidationError(parsedPayloadResult, 'No se pudo validar el formulario de registro.');
        }

        const parsedPayload = parsedPayloadResult.data;
        const user = await request('/register', {
            method: 'POST',
            body: JSON.stringify(parsedPayload)
        });

        const parsedUser = RegisterResponseDTO.parse(user);

        this.currentUser = parsedUser;
        return parsedUser;
    },

    async login(credentials) {
        const payloadResult = LoginRequestDTO.safeParse(credentials);

        if (!payloadResult.success) {
            throw createValidationError(payloadResult, 'No se pudo validar el formulario de acceso.');
        }

        const payload = payloadResult.data;
        const user = await request('/login', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        const parsedUser = AuthUserResponseDTO.parse(user);

        this.currentUser = parsedUser;
        return parsedUser;
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

            const parsedUser = AuthUserResponseDTO.parse(user);

            this.currentUser = parsedUser;
            return parsedUser;
        } catch (error) {
            if (error.status === 401) {
                this.currentUser = null;
                return null;
            }

            throw error;
        }
    }
};
