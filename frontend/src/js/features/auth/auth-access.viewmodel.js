export const AuthAccessViewModel = {
    state: {
        currentUser: null,
        isSubmitting: false,
        errorMessage: '',
        fieldErrors: {
            identifier: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: ''
        },
        mode: 'login'
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

    setFieldErrors(fieldErrors = {}) {
        this.state.fieldErrors = {
            identifier: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            ...fieldErrors
        };
    },

    clearFieldErrors() {
        this.setFieldErrors();
    },

    setMode(mode = 'login') {
        this.state.mode = mode === 'register' ? 'register' : 'login';
    },

    toggleMode() {
        this.setMode(this.state.mode === 'login' ? 'register' : 'login');
    },

    isRegisterMode() {
        return this.state.mode === 'register';
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
    },

    getTitle() {
        return this.isRegisterMode() ? 'Crear cuenta' : 'Iniciar sesión';
    },

    getDescription() {
        if (this.isRegisterMode()) {
            return 'Crea tu cuenta para guardar tareas, organizarlas a tu manera y desbloquear todas las funciones de BiTask.';
        }

        return 'Conéctate para tener todas las funciones de BiTask. Crea, añade y manipula tus tareas dentro de tu sesión, y organiza tu vida como el desarrollador que quieres ser.';
    },

    getSubmitLabel() {
        if (this.state.isSubmitting) {
            return this.isRegisterMode() ? 'Creando...' : 'Entrando...';
        }

        return this.isRegisterMode() ? 'Crear cuenta' : 'Entrar';
    },

    getModePrompt() {
        if (this.isRegisterMode()) {
            return {
                lead: '¿Ya tienes cuenta?',
                action: 'Inicia sesión'
            };
        }

        return {
            lead: '¿No tienes cuenta?',
            action: 'Crea una'
        };
    }
};
