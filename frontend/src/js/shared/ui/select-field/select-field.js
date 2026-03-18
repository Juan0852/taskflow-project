function getSelectedLabel(select) {
    const selectedOption = select.options[select.selectedIndex];
    return selectedOption ? selectedOption.textContent : 'Seleccionar';
}

function closeDropdown(wrapper) {
    const menu = wrapper.querySelector('[data-select-menu]');
    const button = wrapper.querySelector('[data-select-trigger]');
    if (!menu || !button) return;

    menu.classList.add('hidden');
    button.setAttribute('aria-expanded', 'false');
}

function openDropdown(wrapper) {
    const menu = wrapper.querySelector('[data-select-menu]');
    const button = wrapper.querySelector('[data-select-trigger]');
    if (!menu || !button) return;

    menu.classList.remove('hidden');
    button.setAttribute('aria-expanded', 'true');
}

function syncTriggerLabel(select, wrapper) {
    const label = wrapper.querySelector('[data-select-label]');
    if (!label) return;
    label.textContent = getSelectedLabel(select);
}

function createOptionButton(select, option, wrapper) {
    const optionButton = document.createElement('button');
    optionButton.type = 'button';
    optionButton.dataset.selectOption = option.value;
    optionButton.className = 'flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-left text-[13px] text-[var(--color-text-soft)] transition-colors duration-150 hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-strong)]';

    const label = document.createElement('span');
    label.textContent = option.textContent;
    optionButton.appendChild(label);

    if (option.value === select.value) {
        optionButton.classList.add('bg-[var(--color-accent-bg)]', 'text-[var(--color-text-strong)]');
    }

    optionButton.addEventListener('click', () => {
        select.value = option.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        closeDropdown(wrapper);
    });

    return optionButton;
}

function syncMenuState(select, wrapper) {
    const optionButtons = wrapper.querySelectorAll('[data-select-option]');

    optionButtons.forEach((button) => {
        const isSelected = button.dataset.selectOption === select.value;
        button.classList.toggle('bg-[var(--color-accent-bg)]', isSelected);
        button.classList.toggle('text-[var(--color-text-strong)]', isSelected);
    });
}

function buildEnhancedSelect(select) {
    const wrapper = document.createElement('div');
    wrapper.className = 'relative min-w-[150px]';
    wrapper.dataset.customSelect = 'true';

    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.selectTrigger = 'true';
    button.setAttribute('aria-expanded', 'false');
    button.className = 'flex h-11 w-full items-center justify-between rounded-[12px] border border-[var(--color-border-soft)] bg-[var(--color-bg-base)] px-4 text-[14px] text-[var(--color-text)] outline-none transition-[border-color,background-color,color,box-shadow] duration-200 hover:border-[var(--color-accent-border)] hover:bg-[var(--color-bg-hover)] focus:border-[var(--color-accent-border)] focus:shadow-[0_0_0_2px_rgba(75,110,175,0.22)]';

    const label = document.createElement('span');
    label.dataset.selectLabel = 'true';
    label.className = 'truncate';
    label.textContent = getSelectedLabel(select);

    const icon = document.createElement('span');
    icon.className = 'ml-3 text-[11px] text-[var(--color-text-muted)]';
    icon.textContent = '▾';

    button.appendChild(label);
    button.appendChild(icon);

    const menu = document.createElement('div');
    menu.dataset.selectMenu = 'true';
    menu.className = 'absolute left-0 right-0 top-[calc(100%+8px)] z-[1600] hidden max-h-[240px] overflow-y-auto rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-2 shadow-[0_18px_48px_rgba(0,0,0,0.35)]';

    Array.from(select.options).forEach((option) => {
        menu.appendChild(createOptionButton(select, option, wrapper));
    });

    button.addEventListener('click', () => {
        const isOpen = button.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
            closeDropdown(wrapper);
            return;
        }

        SelectField.closeAll();
        openDropdown(wrapper);
    });

    select.addEventListener('change', () => {
        syncTriggerLabel(select, wrapper);
        syncMenuState(select, wrapper);
    });

    wrapper.appendChild(button);
    wrapper.appendChild(menu);

    return wrapper;
}

function bindGlobalDismiss() {
    if (window.__bitaskSelectFieldBound) return;

    document.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        if (target.closest('[data-custom-select-host]') || target.closest('[data-custom-select="true"]')) {
            return;
        }

        SelectField.closeAll();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            SelectField.closeAll();
        }
    });

    window.__bitaskSelectFieldBound = true;
}

export const SelectField = {
    enhance(select) {
        if (!select || select.dataset.selectEnhanced === 'true') return;

        bindGlobalDismiss();

        const host = document.createElement('div');
        host.dataset.customSelectHost = 'true';
        host.className = 'w-full';

        const wrapper = buildEnhancedSelect(select);

        select.dataset.selectEnhanced = 'true';
        select.classList.add('hidden');

        select.insertAdjacentElement('afterend', host);
        host.appendChild(wrapper);
    },

    closeAll() {
        document.querySelectorAll('[data-custom-select="true"]').forEach((wrapper) => {
            closeDropdown(wrapper);
        });
    },

    sync(select) {
        const host = select?.nextElementSibling;
        const wrapper = host?.querySelector?.('[data-custom-select="true"]');
        if (!wrapper) return;

        syncTriggerLabel(select, wrapper);
        syncMenuState(select, wrapper);
    }
};
