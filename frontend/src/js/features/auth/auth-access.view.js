export const AuthAccessView = {
    open(elements) {
        elements.modal?.classList.remove('hidden');
        elements.modal?.classList.add('flex');
        elements.identifierInput?.focus();
    },

    close(elements) {
        elements.modal?.classList.add('hidden');
        elements.modal?.classList.remove('flex');
    },

    renderButtonLabel(elements, label) {
        if (elements.trigger) {
            elements.trigger.textContent = label;
        }
    },

    setUserMenuVisibility(elements, isVisible) {
        if (!elements.userMenu) return;

        elements.userMenu.classList.toggle('hidden', !isVisible);
        elements.trigger?.setAttribute('aria-expanded', String(isVisible));
    },

    renderMode(elements, { isRegisterMode, title, description, promptLead, promptAction }) {
        elements.title && (elements.title.textContent = title);
        elements.description && (elements.description.textContent = description);

        elements.identifierField?.classList.toggle('hidden', isRegisterMode);
        elements.emailField?.classList.toggle('hidden', !isRegisterMode);
        elements.usernameField?.classList.toggle('hidden', !isRegisterMode);
        elements.confirmPasswordField?.classList.toggle('hidden', !isRegisterMode);

        if (elements.passwordInput) {
            elements.passwordInput.autocomplete = isRegisterMode ? 'new-password' : 'current-password';
        }

        if (elements.modeToggle) {
            elements.modeToggle.textContent = promptAction;
        }

        if (elements.modeToggle?.previousElementSibling) {
            elements.modeToggle.previousElementSibling.textContent = promptLead;
        }
    },

    renderError(elements, message) {
        if (!elements.errorBox) return;

        if (!message) {
            elements.errorBox.classList.add('hidden');
            elements.errorBox.textContent = '';
            return;
        }

        elements.errorBox.textContent = message;
        elements.errorBox.classList.remove('hidden');
    },

    renderFieldErrors(elements, fieldErrors = {}) {
        const mappings = [
            ['identifier', elements.identifierError],
            ['email', elements.emailError],
            ['username', elements.usernameError],
            ['password', elements.passwordError],
            ['confirmPassword', elements.confirmPasswordError]
        ];

        mappings.forEach(([key, node]) => {
            if (!node) return;

            const message = fieldErrors[key] || '';
            if (!message) {
                node.classList.add('hidden');
                node.textContent = '';
                return;
            }

            node.textContent = message;
            node.classList.remove('hidden');
        });
    },

    renderSessionState(elements, message) {
        if (!elements.sessionState) return;

        if (!message) {
            elements.sessionState.classList.add('hidden');
            elements.sessionState.textContent = '';
            return;
        }

        elements.sessionState.textContent = message;
        elements.sessionState.classList.remove('hidden');
    },

    setSubmitting(elements, isSubmitting) {
        if (elements.submitButton) {
            elements.submitButton.disabled = isSubmitting;
        }

        if (elements.identifierInput) {
            elements.identifierInput.disabled = isSubmitting;
        }

        if (elements.emailInput) {
            elements.emailInput.disabled = isSubmitting;
        }

        if (elements.usernameInput) {
            elements.usernameInput.disabled = isSubmitting;
        }

        if (elements.passwordInput) {
            elements.passwordInput.disabled = isSubmitting;
        }

        if (elements.confirmPasswordInput) {
            elements.confirmPasswordInput.disabled = isSubmitting;
        }
    },

    renderSubmitLabel(elements, label) {
        if (elements.submitButton) {
            elements.submitButton.textContent = label;
        }
    },

    setLogoutVisibility(elements, isVisible) {
        if (!elements.logoutButton) return;

        elements.logoutButton.classList.toggle('hidden', !isVisible);
    },

    resetForm(elements) {
        elements.form?.reset();
    },

    focusFirstField(elements, isRegisterMode) {
        if (isRegisterMode) {
            elements.emailInput?.focus();
            return;
        }

        elements.identifierInput?.focus();
    }
};
