import { AuthService } from '../../domain/auth/auth-service.js';
import { AuthAccessView } from './auth-access.view.js';
import { AuthAccessViewModel } from './auth-access.viewmodel.js';

export const AuthAccessListeners = {
    elements: null,
    isUserMenuOpen: false,

    mapAuthErrorToUI(error, isRegisterMode = false) {
        const code = error?.code || error?.payload?.code || '';
        const message = error?.payload?.message
            || error?.message
            || (isRegisterMode ? 'No se pudo registrar este usuario.' : 'No se pudo iniciar sesión.');
        const field = error?.payload?.field || '';

        if (code === 'AUTH_VALIDATION_ERROR' && field) {
            return { fieldErrors: { [field]: message }, formError: '' };
        }

        if (code === 'EMAIL_ALREADY_IN_USE' || /correo/i.test(message)) {
            return { fieldErrors: { email: message }, formError: '' };
        }

        if (code === 'USERNAME_ALREADY_IN_USE' || code === 'USERNAME_RESERVED' || /nombre de usuario|username/i.test(message)) {
            return { fieldErrors: { username: message }, formError: '' };
        }

        if (code === 'PASSWORD_TOO_WEAK' || /contraseñ/i.test(message)) {
            return isRegisterMode
                ? { fieldErrors: { password: message }, formError: '' }
                : { fieldErrors: { password: message }, formError: '' };
        }

        if (code === 'INVALID_CREDENTIALS') {
            return { fieldErrors: { password: message }, formError: '' };
        }

        return {
            fieldErrors: {},
            formError: message || (isRegisterMode ? 'No se pudo registrar este usuario.' : 'No se pudo iniciar sesión.')
        };
    },

    async init(elements, services = {}) {
        if (!elements?.trigger || !elements?.modal) return;

        this.elements = elements;
        this.dialogService = services.dialogService || null;

        this.bindEvents();
        await this.refreshCurrentUser();
    },

    bindEvents() {
        this.elements.trigger.addEventListener('click', (event) => this.handleTriggerClick(event));
        this.elements.close?.addEventListener('click', () => this.close());
        this.elements.backdrop?.addEventListener('click', () => this.close());
        this.elements.form?.addEventListener('submit', (event) => this.handleSubmit(event));
        this.elements.logoutButton?.addEventListener('click', () => this.handleLogout());
        this.elements.userMenuLogout?.addEventListener('click', () => this.handleLogout());
        this.elements.modeToggle?.addEventListener('click', () => this.handleModeToggle());
        document.addEventListener('click', (event) => this.handleDocumentClick(event));
        document.addEventListener('keydown', (event) => this.handleDocumentKeydown(event));
    },

    handleTriggerClick(event) {
        if (AuthAccessViewModel.isLoggedIn()) {
            event.preventDefault();
            event.stopPropagation();
            this.toggleUserMenu();
            return;
        }

        this.open();
    },

    openUserMenu() {
        this.isUserMenuOpen = true;
        AuthAccessView.setUserMenuVisibility(this.elements, true);
    },

    closeUserMenu() {
        this.isUserMenuOpen = false;
        AuthAccessView.setUserMenuVisibility(this.elements, false);
    },

    toggleUserMenu() {
        if (this.isUserMenuOpen) {
            this.closeUserMenu();
            return;
        }

        this.openUserMenu();
    },

    open() {
        this.closeUserMenu();
        AuthAccessViewModel.clearError();
        AuthAccessViewModel.clearFieldErrors();
        AuthAccessView.resetForm(this.elements);
        this.render();
        AuthAccessView.open(this.elements);
        AuthAccessView.focusFirstField(this.elements, AuthAccessViewModel.isRegisterMode());
    },

    close() {
        this.closeUserMenu();
        AuthAccessViewModel.clearError();
        AuthAccessViewModel.clearFieldErrors();
        AuthAccessView.close(this.elements);
    },

    handleDocumentClick(event) {
        if (!this.isUserMenuOpen) return;

        if (this.elements.anchor?.contains(event.target)) return;

        this.closeUserMenu();
    },

    handleDocumentKeydown(event) {
        if (event.key === 'Escape' && this.isUserMenuOpen) {
            this.closeUserMenu();
        }
    },

    async refreshCurrentUser() {
        try {
            const user = await AuthService.getCurrentUser();
            AuthAccessViewModel.setCurrentUser(user);
            this.render();
            this.emitSessionChanged(user);
        } catch (error) {
            AuthAccessViewModel.setCurrentUser(null);
            AuthAccessViewModel.setErrorMessage(error.message || 'No se pudo comprobar la sesión actual.');
            this.render();
            this.emitSessionChanged(null);
        }
    },

    async handleSubmit(event) {
        event.preventDefault();

        AuthAccessViewModel.clearError();
        AuthAccessViewModel.clearFieldErrors();

        try {
            AuthAccessViewModel.setSubmitting(true);
            this.render();
            const wasRegisterMode = AuthAccessViewModel.isRegisterMode();

            const user = wasRegisterMode
                ? await this.handleRegisterSubmit()
                : await this.handleLoginSubmit();

            AuthAccessViewModel.setCurrentUser(user);
            AuthAccessViewModel.clearError();
            AuthAccessView.resetForm(this.elements);
            AuthAccessViewModel.setMode('login');
            this.render();
            this.close();
            this.emitSessionChanged(user);

            if (this.dialogService) {
                await this.dialogService.alert({
                    title: wasRegisterMode ? 'Cuenta creada' : 'Sesión iniciada',
                    message: wasRegisterMode
                        ? `Tu cuenta ya está lista, ${user.displayName || user.username}.`
                        : `Bienvenido de vuelta, ${user.displayName || user.username}.`,
                    confirmText: 'Perfecto',
                    eyebrow: 'Autenticación'
                });
            }
        } catch (error) {
            const mappedError = this.mapAuthErrorToUI(error, AuthAccessViewModel.isRegisterMode());
            AuthAccessViewModel.setFieldErrors(mappedError.fieldErrors);
            AuthAccessViewModel.setErrorMessage(
                mappedError.formError || (AuthAccessViewModel.isRegisterMode()
                    ? 'No se pudo registrar este usuario.'
                    : 'No se pudo iniciar sesión.')
            );
            this.render();
        } finally {
            AuthAccessViewModel.setSubmitting(false);
            this.render();
        }
    },

    async handleLoginSubmit() {
        const identifier = this.elements.identifierInput?.value?.trim() || '';
        const password = this.elements.passwordInput?.value || '';

        const fieldErrors = {};

        if (!identifier) {
            fieldErrors.identifier = 'Debes introducir tu correo electrónico o username.';
        }

        if (!password) {
            fieldErrors.password = 'Debes introducir tu contraseña.';
        }

        if (fieldErrors.identifier || fieldErrors.password) {
            AuthAccessViewModel.setFieldErrors(fieldErrors);
            throw new Error('');
        }

        return AuthService.login({ identifier, password });
    },

    async handleRegisterSubmit() {
        const email = this.elements.emailInput?.value?.trim() || '';
        const username = this.elements.usernameInput?.value?.trim() || '';
        const password = this.elements.passwordInput?.value || '';
        const confirmPassword = this.elements.confirmPasswordInput?.value || '';

        const fieldErrors = {};

        if (!email) {
            fieldErrors.email = 'Debes introducir tu correo electrónico.';
        }

        if (!username) {
            fieldErrors.username = 'Debes introducir tu nombre de usuario.';
        }

        if (!password) {
            fieldErrors.password = 'Debes introducir tu contraseña.';
        }

        if (password !== confirmPassword) {
            fieldErrors.confirmPassword = 'Las contraseñas no coinciden.';
        }

        if (Object.values(fieldErrors).some(Boolean)) {
            AuthAccessViewModel.setFieldErrors(fieldErrors);
            throw new Error('');
        }

        return AuthService.register({
            email,
            username,
            password
        });
    },

    handleModeToggle() {
        AuthAccessViewModel.clearError();
        AuthAccessViewModel.clearFieldErrors();
        AuthAccessView.resetForm(this.elements);
        AuthAccessViewModel.toggleMode();
        this.render();
        AuthAccessView.focusFirstField(this.elements, AuthAccessViewModel.isRegisterMode());
    },

    async handleLogout() {
        try {
            AuthAccessViewModel.setSubmitting(true);
            this.render();

            await AuthService.logout();
            this.closeUserMenu();
            AuthAccessViewModel.setCurrentUser(null);
            AuthAccessViewModel.clearError();
            AuthAccessView.resetForm(this.elements);
            this.render();
            this.emitSessionChanged(null);

            if (this.dialogService) {
                await this.dialogService.alert({
                    title: 'Sesión cerrada',
                    message: 'La sesión se cerró correctamente.',
                    confirmText: 'Vale',
                    eyebrow: 'Autenticación'
                });
            }
        } catch (error) {
            AuthAccessViewModel.setErrorMessage(error.payload?.message || error.message || 'No se pudo cerrar la sesión.');
            this.render();
        } finally {
            AuthAccessViewModel.setSubmitting(false);
            this.render();
        }
    },

    emitSessionChanged(user) {
        document.dispatchEvent(new CustomEvent('auth:session-changed', {
            detail: { user }
        }));
    },

    render() {
        AuthAccessView.renderButtonLabel(this.elements, AuthAccessViewModel.getButtonLabel());
        const modePrompt = AuthAccessViewModel.getModePrompt();
        AuthAccessView.renderMode(this.elements, {
            isRegisterMode: AuthAccessViewModel.isRegisterMode(),
            title: AuthAccessViewModel.getTitle(),
            description: AuthAccessViewModel.getDescription(),
            promptLead: modePrompt.lead,
            promptAction: modePrompt.action
        });
        AuthAccessView.renderError(this.elements, AuthAccessViewModel.state.errorMessage);
        AuthAccessView.renderFieldErrors(this.elements, AuthAccessViewModel.state.fieldErrors);
        AuthAccessView.renderSessionState(this.elements, AuthAccessViewModel.getSessionMessage());
        AuthAccessView.setSubmitting(this.elements, AuthAccessViewModel.state.isSubmitting);
        AuthAccessView.renderSubmitLabel(this.elements, AuthAccessViewModel.getSubmitLabel());
        AuthAccessView.setLogoutVisibility(this.elements, AuthAccessViewModel.isLoggedIn());
        if (!AuthAccessViewModel.isLoggedIn()) {
            this.closeUserMenu();
        } else {
            AuthAccessView.setUserMenuVisibility(this.elements, this.isUserMenuOpen);
        }
    }
};
