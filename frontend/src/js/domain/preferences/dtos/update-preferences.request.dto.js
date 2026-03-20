import { z } from 'zod';

const updatePreferencesRequestSchema = z.object({
    theme: z.enum(['dark', 'light']).optional(),
    toolbarConfig: z.record(z.string(), z.boolean()).optional(),
    filterPreferences: z.object({
        showFiltersRow: z.boolean().optional(),
        showNameSearch: z.boolean().optional(),
        showTypeFilters: z.boolean().optional(),
        allowMultipleSortRules: z.boolean().optional(),
        showCalendarZone: z.boolean().optional()
    }).partial().optional(),
    calendarPreferences: z.record(z.string(), z.unknown()).optional(),
    lastSplashShownAt: z.string().datetime().nullable().optional()
}).refine((payload) => Object.keys(payload).length > 0, {
    message: 'Debes enviar al menos una preferencia para actualizar.'
});

export const UpdatePreferencesRequestDTO = {
    schema: updatePreferencesRequestSchema,

    parse(payload) {
        return updatePreferencesRequestSchema.parse(payload);
    }
};
