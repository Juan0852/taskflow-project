import { TerminalCore } from './terminal-core.js';
import { TerminalShortcuts } from './terminal-shortcuts.js';

export const TerminalController = {
    core: TerminalCore,
    shortcuts: TerminalShortcuts,

    init(terminalDom, services = {}) {
        this.core.init(terminalDom, services);
        this.shortcuts.init();
    }
};
