/**
 * BiTask - UI Manager [Oso de Anteojos]
 * Adaptado al layout de IntelliJ Darcula.
 */
import { TaskService } from './task-service.js';

export const UIManager = {
    // Sincronizado con tus IDs de HTML/CSS
    elements: {
        taskContainer: document.getElementById('task-list-container'), // El area del editor
        terminalOutput: document.querySelector('.log-output'),
        terminalInput: document.getElementById('cli-input'),
        typeFilters: document.getElementById('task-type-filters')
    },
    filters: {
        searchTerm: '',
        activeType: 'all'
    },

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
        this.renderTaskList(TaskService.getAll());
    },

    /**
     * Actualiza el término de búsqueda utilizado para filtrar tareas.
     * @param {string} searchTerm - Texto libre que se usará para buscar en id, texto, tipo y estado.
     */
    setSearchTerm(searchTerm) {
        this.filters.searchTerm = searchTerm;
    },

    /**
     * Cambia el tipo de tarea activo para los filtros.
     * @param {string} type - Tipo de tarea (por ejemplo, 'all', 'bug', 'feature').
     */
    setActiveType(type) {
        this.filters.activeType = type;
    },

    /**
     * Devuelve la lista de tareas filtradas según tipo y término de búsqueda.
     * @param {Array<Object>} tasks - Lista completa de tareas.
     * @returns {Array<Object>} Tareas que pasan los filtros actuales.
     * @private
     */
    _getFilteredTasks(tasks) {
        return tasks.filter(task => {
            const matchesType = this.filters.activeType === 'all' || task.type === this.filters.activeType;
            const search = this.filters.searchTerm;
            const matchesSearch = !search
                || task.text.toLowerCase().includes(search)
                || task.id.toString().includes(search)
                || task.type.toLowerCase().includes(search)
                || task.status.toLowerCase().includes(search);

            return matchesType && matchesSearch;
        });
    },

    /**
     * Renderiza los botones de filtro por tipo de tarea.
     * @param {Array<Object>} tasks - Lista de tareas disponible (se usa para validar el tipo activo).
     */
    renderTypeFilters(tasks) {
        const container = this.elements.typeFilters;
        if (!container) return;

        const types = TaskService.getAvailableTypes();
        const filterItems = ['all', ...types];

        if (this.filters.activeType !== 'all' && !types.includes(this.filters.activeType)) {
            this.filters.activeType = 'all';
        }

        container.innerHTML = '';

        filterItems.forEach(type => {
            const button = document.createElement('button');
            const isActive = this.filters.activeType === type;
            button.type = 'button';
            button.className = [
                'whitespace-nowrap',
                'rounded-full',
                'border',
                'px-3',
                'py-1',
                'text-[12px]',
                'transition-colors',
                'duration-200',
                isActive
                    ? 'border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] text-[var(--color-text-strong)]'
                    : 'border-[var(--color-border-soft)] bg-[var(--color-bg-surface)] text-[var(--color-text-soft)] hover:bg-[var(--color-bg-hover)]'
            ].join(' ');
            button.textContent = type === 'all' ? 'Todos' : type;
            button.addEventListener('click', () => {
                this.setActiveType(type);
                this.renderTaskList(TaskService.getAll());
            });
            container.appendChild(button);
        });
    },

    /**
     * Renderiza las tareas en el "Editor Canvas" (área central).
     * @param {Array<Object>} tasks - Lista completa de tareas que proviene de TaskService.
     */
    renderTaskList(tasks) {
        const container = this.elements.taskContainer;
        if (!container) return;

        const filteredTasks = this._getFilteredTasks(tasks);

        this.renderTypeFilters(tasks);

        // 1. Limpiamos el buffer
        container.innerHTML = '';

        // 2. Creamos el encabezado de Java (Siempre presente)
        const header = document.createElement('div');
        header.className = "border-b border-solid border-[var(--color-border-strong)] px-[15px] py-[10px] font-mono text-[14px]";
        //Se podria crear un estilo en especifico para este header en el css pero me da pereza...
        header.innerHTML = `<span class="text-[var(--color-code-keyword)]">private</span> <span class="text-[var(--color-text)]">List&lt;Task&gt;</span> <span class="text-[var(--color-code-identifier)]">storage</span> = <span class="text-[var(--color-code-keyword)]">new</span> <span class="text-[var(--color-text)]">ArrayList</span>&lt;&gt;();`;
        container.appendChild(header);

        // 3. Si no hay tareas, añadimos el comentario de vacío debajo del header
        if (filteredTasks.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = "p-5 italic text-[var(--color-text-dim)]";
            emptyMsg.innerText = this.filters.searchTerm || this.filters.activeType !== 'all'
                ? "// No hay tareas que coincidan con los filtros activos..."
                : "// No hay tareas en el buffer...";
            container.appendChild(emptyMsg);
            return;
        }

        // 4. Logica original: Dibujamos las filas de tareas
        filteredTasks.forEach(task => {
            const taskRow = document.createElement('div');
            taskRow.className = `tree-item task-row prio-${task.priority} flex items-center justify-between hover:bg-[var(--color-bg-hover)]`;

            const taskContent = document.createElement('div');
            const safeStatus = (task.status || 'pendiente').toUpperCase();
            const safeType = task.type || TaskService.DEFAULT_TYPE;
            taskContent.innerHTML = `
            <span class="keyword text-[var(--color-code-keyword)]">#${task.id}</span>
            <span class="method text-[var(--color-code-method)]">[${task.priority.toUpperCase()}]</span>
            <span class="text-[var(--color-code-identifier)]">{${safeType}}</span>
            <span class="text-[var(--color-accent-info)]">&lt;${safeStatus}&gt;</span>
            <span class="string text-[var(--color-code-string)]">"${task.text}"</span>
            <span class="comment text-[var(--color-text-muted)]">// ${task.createdAt}</span>
            `;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete-single inline-flex cursor-pointer items-center justify-center border-0 bg-transparent';
            deleteBtn.title = 'Eliminar Tarea';

            const deleteIcon = document.createElement('img');
            deleteIcon.src = '/assets/TrashOne.png';
            deleteIcon.alt = 'Eliminar';
            deleteIcon.className = 'btn-delete-icon block h-6 w-6 [filter:var(--delete-icon-filter)]';
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
     * Añade una nueva línea a la terminal acoplada (#terminal-file).
     * @param {string} input - Comando introducido por el usuario.
     * @param {string} response - Respuesta renderizada del sistema/servicio.
     */
    printTerminalLine(input, response) {
        const output = this.elements.terminalOutput;
        if (!output) return;

        const entry = document.createElement('div');
        entry.className = 'log-line mb-1 leading-[1.4]';
        entry.innerHTML = `
            <div><span class="info text-[var(--color-accent-info)]">➜</span> <span class="user-cmd text-[var(--color-text-strong)]">${this._escapeHTML(input)}</span></div>
            <div class="terminal-response pl-[15px]">${response}</div>
        `;

        output.appendChild(entry);

        // Auto-scroll de la terminal
        output.scrollTop = output.scrollHeight;
    },

    clearTerminal() {
        if (this.elements.terminalOutput) {
            this.elements.terminalOutput.innerHTML = '';
        }
    },

    /**
     * Escapa HTML para evitar inyecciones al pintar strings en innerHTML.
     * @param {string} str - Cadena potencialmente con caracteres especiales HTML.
     * @returns {string} Cadena segura para insertar como HTML.
     * @private
     */
    _escapeHTML(str) {
        const p = document.createElement('p');
        p.textContent = str;
        return p.innerHTML;
    },

    setTerminalButtonState(isActive) {
        const terminalButton = document.getElementById('tool-terminal');
        if (!terminalButton) return;

        terminalButton.classList.toggle('border-l-2', isActive);
        terminalButton.classList.toggle('border-[var(--color-text-strong)]', isActive);
        terminalButton.classList.toggle('opacity-100', isActive);
        terminalButton.classList.toggle('opacity-60', !isActive);
    },

    toggleTerminal(panel) {
        if (!panel) return;

        const isHidden = panel.classList.contains('hidden');
        if (isHidden) {
            panel.classList.remove('hidden');
            panel.classList.add('flex');
            this.setTerminalButtonState(true);
            const input = document.getElementById('cli-input');
            if (input) input.focus();
        } else {
            panel.classList.add('hidden');
            panel.classList.remove('flex');
            this.setTerminalButtonState(false);
        }
    },

    toggleGeneric(panel) {
        if (!panel) return;

        const isHidden = panel.classList.contains('hidden');
        if (isHidden) {
            panel.classList.remove('hidden');
            panel.classList.add('flex');
        } else {
            panel.classList.add('hidden');
            panel.classList.remove('flex');
        }
    },

    switchTab(tabId) {
        const pages = document.querySelectorAll('.code-page');
        pages.forEach(page => {
            const isActive = page.id === tabId;
            page.classList.toggle('hidden', !isActive);
            page.classList.toggle('flex', isActive);
        });
        this.setActiveFileLink(tabId);
    },

    setActiveFileLink(tabId) {
        const links = document.querySelectorAll('.file-link');
        links.forEach(link => {
            const href = link.getAttribute('href');
            const isActive = href === `#${tabId}`;
            const treeItem = link.closest('.tree-item');
            if (treeItem) {
                treeItem.classList.toggle('bg-[var(--color-bg-hover)]', isActive);
                treeItem.classList.toggle('border-l-2', isActive);
                treeItem.classList.toggle('border-[var(--color-accent-info)]', isActive);
            }
        });
    }
};
