export const AuthAccessViewModel = {
    state: {
        currentUser: null,
        isSubmitting: false,
        errorMessage: ''
    },

    setCurrentUser(user) {
        this.state.currentUser = user;
    },

    setSubmitting(isSubmitting) {
        this.state.isSubmitting = isSubmitting;
    },

    setErrorMessage(message = '') {
        this.state.errorMessage = message;
    },

    clearError() {
        this.state.errorMessage = '';
    },

    isLoggedIn() {
        return Boolean(this.state.currentUser);
    },

    getButtonLabel() {
        if (!this.state.currentUser) {
            return 'Iniciar sesión';
        }

        return `@${this.state.currentUser.username}`;
    },

    getSessionMessage() {
        if (!this.state.currentUser) return '';

        const displayName = this.state.currentUser.displayName || this.state.currentUser.username;
        return `Sesión activa como ${displayName}. Ya puedes empezar a probar el backend de autenticación.`;
    }
};
