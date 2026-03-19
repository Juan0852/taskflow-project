const FALLBACK_API_BASE_URL = 'http://localhost:3000/api';

export const AppConfig = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || FALLBACK_API_BASE_URL
};
