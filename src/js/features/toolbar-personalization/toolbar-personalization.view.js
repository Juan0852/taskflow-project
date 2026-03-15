export const ToolbarPersonalizationView = {
    applyStoredVisibility(controller, visibilityMap) {
        controller.controls.forEach(control => {
            const isVisible = visibilityMap[control.id] !== false;
            control.element.classList.toggle('hidden', !isVisible);
        });
    },

    renderControlLists(controller, visibilityMap, handlers) {
        if (!controller.hiddenList || !controller.visibleList) return;

        controller.hiddenList.innerHTML = '';
        controller.visibleList.innerHTML = '';

        controller.controls.forEach(control => {
            const isVisible = visibilityMap[control.id] !== false;
            const card = this.createDraggableControlCard(control, handlers);
            (isVisible ? controller.visibleList : controller.hiddenList).appendChild(card);
        });
    },

    createDraggableControlCard(control, handlers) {
        const card = document.createElement('div');
        card.className = 'mb-2 flex cursor-grab items-center justify-between gap-3 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 py-3 text-[13px] text-[var(--color-text)] shadow-[0_4px_14px_rgba(0,0,0,0.08)]';
        card.draggable = true;
        card.dataset.controlId = control.id;

        const title = document.createElement('span');
        title.className = 'truncate';
        title.textContent = control.label;

        const hint = document.createElement('span');
        hint.className = 'text-[11px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]';
        hint.textContent = 'Drag';

        card.appendChild(title);
        card.appendChild(hint);

        card.addEventListener('dragstart', () => handlers.onDragStart(control.id, card));
        card.addEventListener('dragend', () => handlers.onDragEnd(card));

        return card;
    },

    bindDropZone(element, handlers) {
        if (!element) return;

        element.addEventListener('dragover', (event) => handlers.onDragOver(event, element));
        element.addEventListener('dragleave', () => handlers.onDragLeave(element));
        element.addEventListener('drop', (event) => handlers.onDrop(event, element));
    },

    renderFilterSettings(controller, settings, handlers) {
        if (!controller.filterSettingsContainer) return;

        controller.filterSettingsContainer.innerHTML = '';

        settings.forEach(setting => {
            const row = document.createElement('label');
            row.className = 'flex items-start justify-between gap-4 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-base)] px-4 py-4';

            const textWrap = document.createElement('div');
            textWrap.className = 'min-w-0';

            const title = document.createElement('div');
            title.className = 'text-[14px] text-[var(--color-text-strong)]';
            title.textContent = setting.title;

            const description = document.createElement('div');
            description.className = 'mt-1 text-[12px] leading-6 text-[var(--color-text-muted)]';
            description.textContent = setting.description;

            const toggle = this.createToggleSwitch(controller.filterPreferences[setting.key], (checked) => {
                handlers.onFilterToggle(setting.key, checked);
            });

            textWrap.appendChild(title);
            textWrap.appendChild(description);
            row.appendChild(textWrap);
            row.appendChild(toggle);
            controller.filterSettingsContainer.appendChild(row);
        });
    },

    renderCalendarSetting(controller, setting, handlers) {
        if (!controller.calendarSettingsContainer) return;

        controller.calendarSettingsContainer.innerHTML = '';

        const row = document.createElement('label');
        row.className = 'flex items-start justify-between gap-4 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-base)] px-4 py-4';

        const textWrap = document.createElement('div');
        textWrap.className = 'min-w-0';

        const title = document.createElement('div');
        title.className = 'text-[14px] text-[var(--color-text-strong)]';
        title.textContent = setting.title;

        const description = document.createElement('div');
        description.className = 'mt-1 text-[12px] leading-6 text-[var(--color-text-muted)]';
        description.textContent = setting.description;

        const toggle = this.createToggleSwitch(controller.filterPreferences[setting.key], (checked) => {
            handlers.onCalendarToggle(setting.key, checked);
        });

        textWrap.appendChild(title);
        textWrap.appendChild(description);
        row.appendChild(textWrap);
        row.appendChild(toggle);
        controller.calendarSettingsContainer.appendChild(row);
    },

    createToggleSwitch(isChecked, onChange) {
        const wrapper = document.createElement('span');
        wrapper.className = 'relative mt-1 inline-flex h-7 w-12 shrink-0 items-center';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = isChecked;
        input.className = 'peer sr-only';
        input.addEventListener('change', () => {
            onChange(input.checked);
        });

        const track = document.createElement('span');
        track.className = 'absolute inset-0 rounded-full border border-[var(--color-control-border)] bg-[var(--color-bg-surface)] transition-[background-color,border-color] duration-200 peer-checked:border-[var(--color-accent-border)] peer-checked:bg-[var(--color-accent-bg)]';

        const thumb = document.createElement('span');
        thumb.className = 'absolute left-[3px] top-[3px] h-5 w-5 rounded-full bg-[var(--color-text-soft)] transition-[transform,background-color] duration-200 peer-checked:translate-x-5 peer-checked:bg-[var(--color-text-strong)]';

        wrapper.appendChild(input);
        wrapper.appendChild(track);
        wrapper.appendChild(thumb);
        return wrapper;
    },

    openModal(controller) {
        if (!controller.modal) return;
        controller.modal.classList.remove('hidden');
        controller.modal.classList.add('flex');
    },

    closeModal(controller) {
        if (!controller.modal) return;
        controller.modal.classList.add('hidden');
        controller.modal.classList.remove('flex');
    }
};
