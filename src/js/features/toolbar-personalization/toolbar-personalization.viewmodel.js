import { STORAGE_KEYS } from '../../shared/storage-keys.js';
import { StorageService } from '../../shared/storage-service.js';

export const ToolbarPersonalizationViewModel = {
    storageKey: STORAGE_KEYS.TOOLBAR_CONTROLS,
    filterStorageKey: STORAGE_KEYS.FILTER_PREFERENCES,
    defaultFilterPreferences: {
        showFiltersRow: true,
        showNameSearch: true,
        showTypeFilters: true,
        allowMultipleSortRules: true,
        showCalendarZone: true
    },

    collectControls(gui) {
        return [gui.btnAdd, gui.btnEditSelected, gui.btnClear, gui.btnCompleteAll, gui.btnClearCompleted]
            .filter(Boolean)
            .map(element => ({
                id: element.dataset.configurableControl,
                label: element.dataset.configurableLabel || element.textContent.trim(),
                element
            }))
            .filter(control => Boolean(control.id));
    },

    getStoredVisibility(storageKey = this.storageKey) {
        return StorageService.getJSON(storageKey, {});
    },

    saveVisibility(visibilityMap, storageKey = this.storageKey) {
        StorageService.setJSON(storageKey, visibilityMap);
    },

    getStoredFilterPreferences(filterStorageKey = this.filterStorageKey, fallback = this.defaultFilterPreferences) {
        const parsed = StorageService.getJSON(filterStorageKey, {});
        return {
            showFiltersRow: parsed.showFiltersRow !== false,
            showNameSearch: parsed.showNameSearch !== false,
            showTypeFilters: parsed.showTypeFilters !== false,
            allowMultipleSortRules: parsed.allowMultipleSortRules !== false,
            showCalendarZone: parsed.showCalendarZone !== false
        };
    },

    saveFilterPreferences(preferences, filterStorageKey = this.filterStorageKey) {
        StorageService.setJSON(filterStorageKey, preferences);
    },

    updateStoredVisibility(controller, controlId, isVisible) {
        const visibilityMap = this.getStoredVisibility(controller.storageKey);
        visibilityMap[controlId] = isVisible;
        this.saveVisibility(visibilityMap, controller.storageKey);
        return visibilityMap;
    },

    setFilterPreference(controller, key, value) {
        if (!(key in controller.filterPreferences)) return false;
        controller.filterPreferences[key] = value;
        this.saveFilterPreferences(controller.filterPreferences, controller.filterStorageKey);
        return true;
    },

    getFilterSettingsDefinition() {
        return [
            {
                key: 'showFiltersRow',
                title: 'Visualizar zona de filtros',
                description: 'Muestra u oculta toda la fila de filtros y ordenación.'
            },
            {
                key: 'allowMultipleSortRules',
                title: 'Permitir más de un criterio de orden',
                description: 'Activa o apaga el botón "+" para encadenar dos o tres órdenes.'
            },
            {
                key: 'showNameSearch',
                title: 'Permitir filtro por nombre',
                description: 'Muestra u oculta el buscador de tareas en la barra principal.'
            },
            {
                key: 'showTypeFilters',
                title: 'Permitir filtros por tipo',
                description: 'Muestra u oculta la fila de chips de filtro por tipo.'
            }
        ];
    },

    getCalendarSettingDefinition() {
        return {
            key: 'showCalendarZone',
            title: 'Mostrar calendario lateral',
            description: 'Permite mostrar u ocultar la zona de calendario dentro del file tree para filtrar por día.'
        };
    }
};
