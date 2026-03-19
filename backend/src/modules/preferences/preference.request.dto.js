import { z } from 'zod';

const themeSchema = z.enum(['dark', 'light']);

const toolbarConfigSchema = z.record(z.string(), z.boolean());

const filterPreferencesSchema = z.object({
    showFiltersRow: z.boolean().optional(),
    showNameSearch: z.boolean().optional(),
    showTypeFilters: z.boolean().optional(),
    allowMultipleSortRules: z.boolean().optional(),
    showCalendarZone: z.boolean().optional()
}).partial();

const calendarPreferencesSchema = z.record(z.string(), z.unknown());

const isoDateTimeSchema = z.string().datetime({
    message: 'Debes enviar una fecha ISO válida.'
});

const updatePreferencesSchema = z.object({
    theme: themeSchema.optional(),
    toolbarConfig: toolbarConfigSchema.optional(),
    filterPreferences: filterPreferencesSchema.optional(),
    calendarPreferences: calendarPreferencesSchema.optional(),
    lastSplashShownAt: isoDateTimeSchema.nullable().optional()
}).refine((payload) => Object.keys(payload).length > 0, {
    message: 'Debes enviar al menos una preferencia para actualizar.',
    path: ['body']
});

export const PreferenceRequestDTO = {
    themeSchema,
    toolbarConfigSchema,
    filterPreferencesSchema,
    calendarPreferencesSchema,
    updatePreferencesSchema,

    parseUpdate(payload) {
        return updatePreferencesSchema.parse(payload);
    }
};
