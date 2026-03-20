function normalizeValue(value = '') {
    return String(value).trim().toLowerCase();
}

function closeDropdown(host) {
    const menu = host.querySelector('[data-combobox-menu]');
    if (!menu) return;
    menu.classList.add('hidden');
}

function openDropdown(host) {
    const menu = host.querySelector('[data-combobox-menu]');
    if (!menu) return;
    menu.classList.remove('hidden');
}

function ensureMenu(host) {
    let menu = host.querySelector('[data-combobox-menu]');

    if (menu) return menu;

    menu = document.createElement('div');
    menu.dataset.comboboxMenu = 'true';
    menu.className = 'absolute left-0 right-0 top-[calc(100%+8px)] z-[1600] hidden max-h-[calc(4*2.5rem+1rem)] overflow-y-auto rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-2 shadow-[0_18px_48px_rgba(0,0,0,0.35)] snap-y snap-mandatory';
    host.appendChild(menu);
    return menu;
}

function renderOptions(input, host, options = []) {
    const menu = ensureMenu(host);
    const query = normalizeValue(input.value);
    const filteredOptions = options.filter((option) => {
        if (!query) return true;
        return normalizeValue(option).includes(query);
    });

    menu.innerHTML = '';

    if (!filteredOptions.length) {
        closeDropdown(host);
        return;
    }

    filteredOptions.forEach((optionValue) => {
        const optionButton = document.createElement('button');
        optionButton.type = 'button';
        optionButton.className = 'flex h-10 w-full snap-start items-center rounded-[10px] px-3 text-left text-[13px] text-[var(--color-text-soft)] transition-colors duration-150 hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-strong)]';
        optionButton.textContent = optionValue;
        optionButton.addEventListener('click', () => {
            input.value = optionValue;
            closeDropdown(host);
            input.focus();
        });
        menu.appendChild(optionButton);
    });

    openDropdown(host);
}

function bindGlobalDismiss() {
    if (window.__bitaskComboboxFieldBound) return;

    document.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        if (target.closest('[data-combobox-host]')) {
            return;
        }

        document.querySelectorAll('[data-combobox-host]').forEach((host) => closeDropdown(host));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            document.querySelectorAll('[data-combobox-host]').forEach((host) => closeDropdown(host));
        }
    });

    window.__bitaskComboboxFieldBound = true;
}

export const ComboboxField = {
    enhance(input) {
        if (!input || input.dataset.comboboxEnhanced === 'true') return;

        bindGlobalDismiss();

        const host = document.createElement('div');
        host.dataset.comboboxHost = 'true';
        host.className = 'relative';

        input.insertAdjacentElement('afterend', host);
        host.appendChild(input);

        input.dataset.comboboxEnhanced = 'true';

        const runRender = () => {
            const options = this.getOptions(input);
            if (!options.length) {
                closeDropdown(host);
                return;
            }

            renderOptions(input, host, options);
        };

        input.addEventListener('focus', runRender);
        input.addEventListener('input', runRender);
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                closeDropdown(host);
            }
        });
    },

    setOptions(input, options = []) {
        if (!input) return;

        const uniqueOptions = [...new Set(options.map((option) => normalizeValue(option)).filter(Boolean))];
        input.dataset.comboboxOptions = JSON.stringify(uniqueOptions);
    },

    getOptions(input) {
        if (!input?.dataset.comboboxOptions) return [];

        try {
            return JSON.parse(input.dataset.comboboxOptions);
        } catch {
            return [];
        }
    }
};
