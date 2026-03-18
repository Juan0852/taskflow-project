import { AuthService } from '../../domain/auth/auth-service.js';
import { AuthAccessView } from './auth-access.view.js';
import { AuthAccessViewModel } from './auth-access.viewmodel.js';

export const AuthAccessController = {
    elements: null,

    async init(elements, services = {}) {
        if (!elements?.trigger || !elements?.modal) return;

        this.elements = elements;
        this.dialogService = services.dialogService || null;

        this.bindEvents();
        await this.refreshCurrentUser();
    },

    bindEvents() {
        this.elements.trigger.addEventListener('click', () => this.open());
        this.elements.close?.addEventListener('click', () => this.close());
        this.elements.backdrop?.addEventListener('click', () => this.close());
        this.elements.form?.addEventListener('submit', (event) => this.handleSubmit(event));
        this.elements.logoutButton?.addEventListener('click', () => this.handleLogout());
    },

    open() {
        AuthAccessView.renderError(this.elements, '');
        this.render();
        AuthAccessView.open(this.elements);
    },

    close() {
        AuthAccessView.close(this.elements);
    },

    async refreshCurrentUser() {
        try {
            const user = await AuthService.getCurrentUser();
            AuthAccessViewModel.setCurrentUser(user);
            this.render();
        } catch (error) {
            AuthAccessViewModel.setCurrentUser(null);
            AuthAccessViewModel.setErrorMessage(error.message || 'No se pudo comprobar la sesión actual.');
            this.render();
        }
    },

    async handleSubmit(event) {
        event.preventDefault();

        const identifier = this.elements.identifierInput?.value?.trim() || '';
        const password = this.elements.passwordInput?.value || '';

        AuthAccessViewModel.clearError();

        if (!identifier || !password) {
            AuthAccessViewModel.setErrorMessage('Debes introducir tu identificador y tu contraseña.');
            this.render();
            return;
        }

        try {
            AuthAccessViewModel.setSubmitting(true);
            this.render();

            const user = await AuthService.login({ identifier, password });
            AuthAccessViewModel.setCurrentUser(user);
            AuthAccessViewModel.clearError();
            AuthAccessView.resetForm(this.elements);
            this.render();
            this.close();

            if (this.dialogService) {
                await this.dialogService.alert({
                    title: 'Sesión iniciada',
                    message: `Bienvenido de vuelta, ${user.displayName || user.username}.`,
                    confirmText: 'Perfecto',
                    eyebrow: 'Autenticación'
                });
            }
        } catch (error) {
            AuthAccessViewModel.setErrorMessage(error.payload?.message || error.message || 'No se pudo iniciar sesión.');
            this.render();
        } finally {
            AuthAccessViewModel.setSubmitting(false);
            this.render();
        }
    },

    async handleLogout() {
        try {
            AuthAccessViewModel.setSubmitting(true);
            this.render();

            await AuthService.logout();
            AuthAccessViewModel.setCurrentUser(null);
            AuthAccessViewModel.clearError();
            AuthAccessView.resetForm(this.elements);
            this.render();

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

    render() {
        AuthAccessView.renderButtonLabel(this.elements, AuthAccessViewModel.getButtonLabel());
        AuthAccessView.renderError(this.elements, AuthAccessViewModel.state.errorMessage);
        AuthAccessView.renderSessionState(this.elements, AuthAccessViewModel.getSessionMessage());
        AuthAccessView.setSubmitting(this.elements, AuthAccessViewModel.state.isSubmitting);
        AuthAccessView.setLogoutVisibility(this.elements, AuthAccessViewModel.isLoggedIn());
    }
};
