import { Theme } from '@prisma/client';
import { PreferenceResponseDTO } from './preference.response.dto.js';

const themeToDbMap = {
    dark: Theme.DARK,
    light: Theme.LIGHT
};

const themeFromDbMap = {
    [Theme.DARK]: 'dark',
    [Theme.LIGHT]: 'light'
};

const defaultFilterPreferences = {
    showFiltersRow: true,
    showNameSearch: true,
    showTypeFilters: true,
    allowMultipleSortRules: true,
    showCalendarZone: true
};

function ensurePlainObject(value, fallback = {}) {
    return value && typeof value === 'object' && !Array.isArray(value)
        ? { ...value }
        : fallback;
}

export const PreferenceMapper = {
    defaultFilterPreferences,

    toResponseDTO(preference) {
        const toolbarConfig = ensurePlainObject(preference?.toolbarConfig, {});
        const filterPreferences = {
            ...defaultFilterPreferences,
            ...ensurePlainObject(preference?.filterPreferences, {})
        };
        const calendarPreferences = ensurePlainObject(preference?.calendarPreferences, {});

        return PreferenceResponseDTO.parse({
            theme: themeFromDbMap[preference?.theme ?? Theme.DARK],
            toolbarConfig,
            filterPreferences,
            calendarPreferences,
            lastSplashShownAt: typeof calendarPreferences.lastSplashShownAt === 'string'
                ? calendarPreferences.lastSplashShownAt
                : null,
            createdAt: preference.createdAt.toISOString(),
            updatedAt: preference.updatedAt.toISOString()
        });
    },

    toUpdateEntity(payload, currentPreference = null) {
        const data = {};

        if (payload.theme) {
            data.theme = themeToDbMap[payload.theme];
        }

        if (payload.toolbarConfig) {
            data.toolbarConfig = payload.toolbarConfig;
        }

        if (payload.filterPreferences) {
            data.filterPreferences = {
                ...defaultFilterPreferences,
                ...ensurePlainObject(currentPreference?.filterPreferences, {}),
                ...payload.filterPreferences
            };
        }

        const currentCalendarPreferences = ensurePlainObject(currentPreference?.calendarPreferences, {});
        let nextCalendarPreferences = null;

        if (payload.calendarPreferences) {
            nextCalendarPreferences = {
                ...currentCalendarPreferences,
                ...payload.calendarPreferences
            };
        }

        if (Object.prototype.hasOwnProperty.call(payload, 'lastSplashShownAt')) {
            nextCalendarPreferences = {
                ...(nextCalendarPreferences || currentCalendarPreferences),
                lastSplashShownAt: payload.lastSplashShownAt
            };
        }

        if (nextCalendarPreferences) {
            data.calendarPreferences = nextCalendarPreferences;
        }

        return data;
    }
};
