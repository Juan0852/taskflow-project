import { AppConfig } from '../../shared/config.js';
import { PreferenceResponseDTO } from './dtos/preference.response.dto.js';
import { UpdatePreferencesRequestDTO } from './dtos/update-preferences.request.dto.js';

const PREFERENCES_BASE_URL = `${AppConfig.apiBaseUrl}/preferences`;

const defaultPreferences = {
    theme: 'dark',
    toolbarConfig: {},
    filterPreferences: {
        showFiltersRow: true,
        showNameSearch: true,
        showTypeFilters: true,
        allowMultipleSortRules: true,
        showCalendarZone: true
    },
    calendarPreferences: {},
    lastSplashShownAt: null,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString()
};

async function request(path = '', options = {}) {
    const response = await fetch(`${PREFERENCES_BASE_URL}${path}`, {
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
        const error = new Error(payload?.message || 'La solicitud de preferencias falló.');
        error.status = response.status;
        error.code = payload?.code || 'PREFERENCE_REQUEST_FAILED';
        error.payload = payload;
        throw error;
    }

    return payload;
}

export const PreferenceService = {
    cache: { ...defaultPreferences },

    getDefaults() {
        return { ...defaultPreferences };
    },

    getCachedPreferences() {
        return {
            ...this.cache,
            toolbarConfig: { ...(this.cache.toolbarConfig || {}) },
            filterPreferences: { ...(this.cache.filterPreferences || defaultPreferences.filterPreferences) },
            calendarPreferences: { ...(this.cache.calendarPreferences || {}) }
        };
    },

    async getPreferences() {
        try {
            const response = await request('', { method: 'GET' });
            this.cache = PreferenceResponseDTO.parse(response);
            return this.getCachedPreferences();
        } catch (error) {
            if (error.status === 401) {
                this.cache = this.getDefaults();
                return this.getCachedPreferences();
            }

            throw error;
        }
    },

    async updatePreferences(payload) {
        const parsedPayload = UpdatePreferencesRequestDTO.parse(payload);

        try {
            const response = await request('', {
                method: 'PATCH',
                body: JSON.stringify(parsedPayload)
            });

            this.cache = PreferenceResponseDTO.parse(response);
            return this.getCachedPreferences();
        } catch (error) {
            if (error.status === 401) {
                this.cache = {
                    ...this.getCachedPreferences(),
                    ...parsedPayload,
                    toolbarConfig: parsedPayload.toolbarConfig
                        ? { ...parsedPayload.toolbarConfig }
                        : this.cache.toolbarConfig,
                    filterPreferences: parsedPayload.filterPreferences
                        ? { ...this.cache.filterPreferences, ...parsedPayload.filterPreferences }
                        : this.cache.filterPreferences,
                    calendarPreferences: parsedPayload.calendarPreferences
                        ? { ...this.cache.calendarPreferences, ...parsedPayload.calendarPreferences }
                        : this.cache.calendarPreferences
                };

                return this.getCachedPreferences();
            }

            throw error;
        }
    }
};
