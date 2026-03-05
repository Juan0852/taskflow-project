/**
 * BiTask - UI Manager [Oso de Anteojos]
 * Adaptado al layout de IntelliJ Darcula.
 */
const UIManager = {
    // Sincronizado con tus IDs de HTML/CSS
    elements: {
        taskContainer: document.getElementById('task-list-container'), // El area del editor
        terminalOutput: document.querySelector('.log-output'),
        terminalInput: document.getElementById('cli-input')
    },

    /**
     * Inicializa el UI Manager con elementos del DOM
     */
    init(navigation) {
        if (navigation && navigation.links) {
            navigation.links.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        // Opcional: e.preventDefault(); si queremos evitar el salto
                        this.switchTab(href.substring(1));
                    }
                });
            });
        }

        // Renderizar las tareas iniciales
        if (typeof TaskService !== 'undefined') {
            this.renderTaskList(TaskService.getAll());
        }
    },

    /**
     * Renderiza las tareas en el "Editor Canvas" (área central)
     */
    renderTaskList(tasks) {
        const container = this.elements.taskContainer;
        if (!container) return;

        container.innerHTML = '';

        if (tasks.length === 0) {
            container.innerHTML = `<div style="padding: 20px; color: #555;">// No hay tareas en el buffer...</div>`;
            return;
        }

        tasks.forEach(task => {
            const taskRow = document.createElement('div');
            taskRow.className = `tree-item task-row prio-${task.priority}`;
            taskRow.innerHTML = `
                <span class="keyword">#${task.id}</span>
                <span class="method">[${task.priority.toUpperCase()}]</span>
                <span class="string">"${task.text}"</span>
                <span class="comment">// ${task.createdAt}</span>
            `;
            container.appendChild(taskRow);
        });

        // Auto-scroll al final del editor
        container.scrollTop = container.scrollHeight;
    },

    /**
     * Imprime en la terminal acoplada (#terminal-file)
     */
    printTerminalLine(input, response) {
        const output = this.elements.terminalOutput;
        if (!output) return;

        const entry = document.createElement('div');
        entry.className = 'log-line';
        entry.innerHTML = `
            <div><span class="info">➜</span> <span class="user-cmd">${this._escapeHTML(input)}</span></div>
            <div class="terminal-response" style="padding-left: 15px;">${response}</div>
        `;

        output.appendChild(entry);

        // Auto-scroll de la terminal
        output.scrollTop = output.scrollHeight;
    },

    /**
     * Comando clear
     */
    clearTerminal() {
        if (this.elements.terminalOutput) {
            this.elements.terminalOutput.innerHTML = '';
        }
    },

    _escapeHTML(str) {
        const p = document.createElement('p');
        p.textContent = str;
        return p.innerHTML;
    },

    /**
     * Muestra u oculta la terminal
     */
    toggleTerminal(panel) {
        if (!panel) return;

        //Se tuvo que añadir este metodo porque el display se hacia con doble click, forzamos a leer el css
        // "getComputedStyle" es el 'detective' y sí puede leer tu archivo .css
        const displayReal = window.getComputedStyle(panel).display;

        // Si el estilo que el navegador está dibujando es 'flex', lo cerramos.
        // Si es cualquier otra cosa (none o vacío), lo abrimos.
        if (displayReal === 'flex') {
            panel.style.display = 'none';
        } else {
            panel.style.display = 'flex';
            const input = document.getElementById('cli-input');
            if (input) input.focus();
        }
    },

    /**
     * Muestra u oculta un panel genérico leyendo su estilo real 
     */
    toggleGeneric(panel) {
        if (!panel) return;

        const displayReal = window.getComputedStyle(panel).display;

        if (displayReal !== 'none') {
            panel.style.display = 'none';
        } else {
            panel.style.display = 'flex';
        }
    },

    /**
     * Cambia de pestaña (Controller / Kanban)
     */
    switchTab(tabId) {
        const pages = document.querySelectorAll('.code-page');
        pages.forEach(page => {
            page.style.display = page.id === tabId ? 'block' : 'none';
        });
    }
};