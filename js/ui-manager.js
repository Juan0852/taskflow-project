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
                        e.preventDefault();
                        const tabId = href.substring(1);
                        this.switchTab(tabId);
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

        // 1. Limpiamos el buffer
        container.innerHTML = '';

        // 2. Creamos el encabezado de Java (Siempre presente)
        const header = document.createElement('div');
        header.style = "padding: 10px 15px; border-bottom: 1px solid #333; font-family: monospace; font-size: 13px;";
        //Se podria crear un estilo en especifico para este header en el css pero me da pereza...
        header.innerHTML = `<span style="color: #cc7832;">private</span> <span style="color: #a9b7c6;">List&lt;Task&gt;</span> <span style="color: #9876aa;">storage</span> = <span style="color: #cc7832;">new</span> <span style="color: #a9b7c6;">ArrayList</span>&lt;&gt;();`;
        container.appendChild(header);

        // 3. Si no hay tareas, añadimos el comentario de vacío debajo del header
        if (tasks.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.style = "padding: 20px; color: #555; font-style: italic;";
            emptyMsg.innerText = "// No hay tareas en el buffer...";
            container.appendChild(emptyMsg);
            return;
        }

        // 4. Logica original: Dibujamos las filas de tareas
        tasks.forEach(task => {
            const taskRow = document.createElement('div');
            taskRow.className = `tree-item task-row prio-${task.priority}`;
            taskRow.style.display = 'flex';
            taskRow.style.justifyContent = 'space-between';
            taskRow.style.alignItems = 'center';

            const taskContent = document.createElement('div');
            taskContent.innerHTML = `
            <span class="keyword">#${task.id}</span>
            <span class="method">[${task.priority.toUpperCase()}]</span>
            <span class="string">"${task.text}"</span>
            <span class="comment">// ${task.createdAt}</span>
            `;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete-single';
            deleteBtn.style.background = 'transparent';
            deleteBtn.style.border = 'none';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.style.display = 'inline-flex';
            deleteBtn.style.alignItems = 'center';
            deleteBtn.style.justifyContent = 'center';
            deleteBtn.title = 'Eliminar Tarea';

            const deleteIcon = document.createElement('img');
            deleteIcon.src = '/assets/TrashOne.png';
            deleteIcon.alt = 'Eliminar';
            deleteIcon.className = 'btn-delete-icon';
            deleteBtn.appendChild(deleteIcon);

            deleteBtn.addEventListener('click', () => {
                if (confirm(`¿Estás seguro de que quieres borrar la tarea #${task.id}?`)) {
                    TaskService.delete(task.id);
                    this.renderTaskList(TaskService.getAll());
                }
            });

            taskRow.appendChild(taskContent);
            taskRow.appendChild(deleteBtn);
            container.appendChild(taskRow);
        });

        // Auto-scroll al final
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
        this.setActiveFileLink(tabId);
    },

    /**
     * Sincroniza el archivo activo en el árbol lateral
     */
    setActiveFileLink(tabId) {
        const links = document.querySelectorAll('.file-link');
        links.forEach(link => {
            const href = link.getAttribute('href');
            const isActive = href === `#${tabId}`;
            const treeItem = link.closest('.tree-item');
            if (treeItem) {
                treeItem.classList.toggle('active-file', isActive);
            }
        });
    }
};
