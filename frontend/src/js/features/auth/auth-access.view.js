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
            elements.submitButton.textContent = isSubmitting ? 'Entrando...' : 'Entrar';
        }

        if (elements.identifierInput) {
            elements.identifierInput.disabled = isSubmitting;
        }

        if (elements.passwordInput) {
            elements.passwordInput.disabled = isSubmitting;
        }
    },

    setLogoutVisibility(elements, isVisible) {
        if (!elements.logoutButton) return;

        elements.logoutButton.classList.toggle('hidden', !isVisible);
    },

    resetForm(elements) {
        elements.form?.reset();
    }
};
