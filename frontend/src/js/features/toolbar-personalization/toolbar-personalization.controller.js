import { UIManager } from '../../ui-manager.js';
import { ToolbarPersonalizationView } from './toolbar-personalization.view.js';
import { ToolbarPersonalizationViewModel } from './toolbar-personalization.viewmodel.js';

export const ToolbarPersonalization = {
    storageKey: ToolbarPersonalizationViewModel.storageKey,
    filterStorageKey: ToolbarPersonalizationViewModel.filterStorageKey,
    controls: [],
    trigger: null,
    modal: null,
    backdrop: null,
    close: null,
    hiddenList: null,
    visibleList: null,
    filterSettingsContainer: null,
    calendarSettingsContainer: null,
    escapeHandler: null,
    draggedControlId: null,
    filterPreferences: { ...ToolbarPersonalizationViewModel.defaultFilterPreferences },

    init(toolbarSettings, gui) {
        this.trigger = toolbarSettings.trigger || null;
        this.modal = toolbarSettings.modal || null;
        this.backdrop = toolbarSettings.backdrop || null;
        this.close = toolbarSettings.close || null;
        this.hiddenList = toolbarSettings.hiddenList || null;
        this.visibleList = toolbarSettings.visibleList || null;
        this.filterSettingsContainer = toolbarSettings.filterSettings || null;
        this.calendarSettingsContainer = toolbarSettings.calendarSettings || null;
        this.controls = ToolbarPersonalizationViewModel.collectControls(gui);
        this.filterPreferences = ToolbarPersonalizationViewModel.getStoredFilterPreferences(
            this.filterStorageKey,
            this.filterPreferences
        );

        if (!this.controls.length) return;

        this.applyStoredVisibility();
        UIManager.applyFilterPreferences(this.filterPreferences);
        this.renderControlLists();
        this.renderFilterSettings();
        this.renderCalendarSetting();
        this.bindEvents();
    },

    bindEvents() {
        ToolbarPersonalizationView.bindDropZone(this.hiddenList, {
            onDragOver: (event, element) => this.handleDropZoneDragOver(event, element),
            onDragLeave: (element) => this.handleDropZoneDragLeave(element),
            onDrop: (event, element) => this.handleDropZoneDrop(event, element, false)
        });

        ToolbarPersonalizationView.bindDropZone(this.visibleList, {
            onDragOver: (event, element) => this.handleDropZoneDragOver(event, element),
            onDragLeave: (element) => this.handleDropZoneDragLeave(element),
            onDrop: (event, element) => this.handleDropZoneDrop(event, element, true)
        });

        if (this.trigger) {
            this.trigger.addEventListener('click', () => this.open());
        }

        if (this.close) {
            this.close.addEventListener('click', () => this.closeModal());
        }

        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => this.closeModal());
        }
    },

    getControlVisibilityMap() {
        return ToolbarPersonalizationViewModel.getStoredVisibility(this.storageKey);
    },

    setControlVisibility(controlId, isVisible) {
        this.updateControlVisibility(controlId, isVisible);
        this.renderControlLists();
    },

    getFilterPreferences() {
        return { ...this.filterPreferences };
    },

    setFilterPreference(key, value) {
        const didUpdate = ToolbarPersonalizationViewModel.setFilterPreference(this, key, value);
        if (!didUpdate) return false;

        UIManager.applyFilterPreferences(this.filterPreferences);
        this.renderFilterSettings();
        this.renderCalendarSetting();
        return true;
    },

    applyStoredVisibility() {
        const visibilityMap = this.getControlVisibilityMap();
        ToolbarPersonalizationView.applyStoredVisibility(this, visibilityMap);
    },

    renderControlLists() {
        const visibilityMap = this.getControlVisibilityMap();
        ToolbarPersonalizationView.renderControlLists(this, visibilityMap, {
            onDragStart: (controlId, card) => this.handleCardDragStart(controlId, card),
            onDragEnd: (card) => this.handleCardDragEnd(card)
        });
    },

    renderFilterSettings() {
        ToolbarPersonalizationView.renderFilterSettings(
            this,
            ToolbarPersonalizationViewModel.getFilterSettingsDefinition(),
            {
                onFilterToggle: (key, checked) => this.handleFilterToggle(key, checked)
            }
        );
    },

    renderCalendarSetting() {
        ToolbarPersonalizationView.renderCalendarSetting(
            this,
            ToolbarPersonalizationViewModel.getCalendarSettingDefinition(),
            {
                onCalendarToggle: (key, checked) => this.handleCalendarToggle(key, checked)
            }
        );
    },

    handleCardDragStart(controlId, card) {
        this.draggedControlId = controlId;
        card.classList.add('opacity-60');
    },

    handleCardDragEnd(card) {
        this.draggedControlId = null;
        card.classList.remove('opacity-60');
    },

    handleDropZoneDragOver(event, element) {
        event.preventDefault();
        element.classList.add('border-[var(--color-accent-border)]', 'bg-[var(--color-bg-hover)]');
    },

    handleDropZoneDragLeave(element) {
        element.classList.remove('border-[var(--color-accent-border)]', 'bg-[var(--color-bg-hover)]');
    },

    handleDropZoneDrop(event, element, shouldBeVisible) {
        event.preventDefault();
        this.handleDropZoneDragLeave(element);
        if (!this.draggedControlId) return;

        this.updateControlVisibility(this.draggedControlId, shouldBeVisible);
        this.renderControlLists();
    },

    handleFilterToggle(key, checked) {
        this.setFilterPreference(key, checked);
    },

    handleCalendarToggle(key, checked) {
        this.setFilterPreference(key, checked);
    },

    updateControlVisibility(controlId, isVisible) {
        ToolbarPersonalizationViewModel.updateStoredVisibility(this, controlId, isVisible);

        const control = this.controls.find(item => item.id === controlId);
        if (!control) return;

        control.element.classList.toggle('hidden', !isVisible);
    },

    open() {
        this.renderControlLists();
        this.renderFilterSettings();
        this.renderCalendarSetting();
        ToolbarPersonalizationView.openModal(this);
        this.escapeHandler = (event) => {
            if (event.key === 'Escape') {
                this.closeModal();
            }
        };
        document.addEventListener('keydown', this.escapeHandler);
    },

    closeModal() {
        ToolbarPersonalizationView.closeModal(this);
        if (this.escapeHandler) {
            document.removeEventListener('keydown', this.escapeHandler);
            this.escapeHandler = null;
        }
    }
};
