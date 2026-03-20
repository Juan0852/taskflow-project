/**
 * BiTask IDE - Keyboard Shortcuts Manager
 * Gestiona combinaciones de teclas globales de la aplicación.
 */
import { TerminalCore } from './terminal-core.js';
import { UIManager } from '../../ui-manager.js';

export const TerminalShortcuts = {
    initialized: false,

    isTypingContext() {
        const activeElement = document.activeElement;
        const blockingModalIds = ['auth-modal', 'trash-bin-modal'];
        const isBlockingModalOpen = blockingModalIds.some((modalId) => {
            const modal = document.getElementById(modalId);
            return modal && !modal.classList.contains('hidden');
        });

        if (isBlockingModalOpen) {
            return true;
        }

        if (!activeElement) {
            return false;
        }

        const tagName = activeElement.tagName?.toLowerCase() || '';
        const isEditableField = ['input', 'textarea', 'select'].includes(tagName);
        const isContentEditable = activeElement.isContentEditable;

        return isEditableField || isContentEditable;
    },

    init() {
        if (this.initialized) return;
        this.initialized = true;

        // Escucha todas las teclas presionadas en la ventana
        window.addEventListener('keydown', (e) => {

            // Ctrl en Windows/Linux o Command (⌘) en Mac
            const isCtrl = e.ctrlKey || e.metaKey;

            // Alt en Windows/Linux o Option (⌥) en Mac
            const isAlt = e.altKey;
            const isTyping = this.isTypingContext();

            // --- LISTA DE ATAJOS ---

            // 1. Limpiar Terminal (Ctrl/Cmd + L)
            // Nota: algunos navegadores usan este atajo para enfocar la barra de direcciones.
            if (isCtrl && e.code === 'KeyL') {
                e.preventDefault();
                UIManager.clearTerminal();
                console.log("Shortcut: Terminal Cleared");
            }

            if (isTyping) {
                return;
            }

            // Alt + Tecla al lado del 1 (Backquote / º / `)
            if (isAlt && e.code === 'Backquote') {
                e.preventDefault(); // Evita que el navegador abra menús por defecto

                // Pasamos el elemento del panel que definiste en tus domElements
                const terminalPanel = document.getElementById('terminal-file');
                UIManager.toggleTerminal(terminalPanel);
                console.log("Shortcut: Toggle Terminal (Alt + `)");
            }

            // 3. Recuperar ultimo comando (Alt + Flecha Arriba)
            if (isAlt && e.code === 'ArrowUp') {
                e.preventDefault();
                TerminalCore.restoreLastCommand();
                console.log("Shortcut: Restore Last Command (Alt + ArrowUp)");
            }

            // 4. Cambiar a Kanban (Alt/Option + 2)
            if (isAlt && e.code === 'Digit2') {
                e.preventDefault();
                UIManager.switchTab('kanban-file');
                console.log("Shortcut: Kanban Tab");
            }

            // 5. Cambiar a Controller (Alt/Option + 1)
            if (isAlt && e.code === 'Digit1') {
                e.preventDefault();
                UIManager.switchTab('controller-file');
                console.log("Shortcut: Controller Tab");
            }

            // 6. Cambiar a ReadMe (Alt/Option + 3)
            if (isAlt && e.code === 'Digit3') {
                e.preventDefault();
                UIManager.switchTab('readme-file');
                console.log("Shortcut: ReadMe Tab");
            }

        }, { capture: true });
        /*
        capture: true hace que el listener se ejecute en la fase de CAPTURA
        del evento, es decir, antes de que otros elementos de la página
        (inputs, editores, etc.) puedan interceptar la tecla.

        Esto es útil en apps tipo IDE porque garantiza que los atajos globales
        funcionen incluso si el foco está dentro de un editor o input.
        */
    }
};
