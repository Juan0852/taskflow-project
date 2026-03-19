import { z } from 'zod';

const preferenceResponseSchema = z.object({
    theme: z.enum(['dark', 'light']),
    toolbarConfig: z.record(z.string(), z.boolean()),
    filterPreferences: z.object({
        showFiltersRow: z.boolean(),
        showNameSearch: z.boolean(),
        showTypeFilters: z.boolean(),
        allowMultipleSortRules: z.boolean(),
        showCalendarZone: z.boolean()
    }),
    calendarPreferences: z.record(z.string(), z.unknown()),
    lastSplashShownAt: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string()
});

export const PreferenceResponseDTO = {
    schema: preferenceResponseSchema,

    parse(payload) {
        return preferenceResponseSchema.parse(payload);
    }
};
