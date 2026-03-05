/**
 * BiTask IDE - Keyboard Shortcuts Manager
 * Gestiona combinaciones de teclas globales.
 */

const Shortcuts = {
    init() {
        window.addEventListener('keydown', (e) => {
            const isCtrl = e.ctrlKey || e.metaKey; // Soporte para Windows/Linux y Mac
            const key = e.key.toLowerCase();

            // --- LISTA DE ATAJOS ---

            // 1. Limpiar Terminal (Ctrl + L)
            if (isCtrl && key === 'l') {
                e.preventDefault();
                UIManager.clearTerminal();
                console.log("Shortcut: Terminal Cleared");
            }

            // 2. Abrir/Cerrar Terminal (Ctrl + `) o (Ctrl + \)
            if (isCtrl && (key === '\\' || key === '`')) {
                e.preventDefault();
                UIManager.toggleTerminal();
            }

            // 3. Cambiar a Kanban rápidamente (Alt + 2)
            if (e.altKey && key === '2') {
                e.preventDefault();
                UIManager.switchTab('kanban-file');
            }

            // 4. Cambiar a Controller (Alt + 1)
            if (e.altKey && key === '1') {
                e.preventDefault();
                UIManager.switchTab('controller-file');
            }
        });
    }
};

// Auto-inicialización opcional o llamada desde app.js
Shortcuts.init();