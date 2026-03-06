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
        this.renderTaskList(TaskService.getAll());
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
        header.className = "border-b border-solid border-[#333] px-[15px] py-[10px] font-mono text-[14px]";
        //Se podria crear un estilo en especifico para este header en el css pero me da pereza...
        header.innerHTML = `<span class="text-[var(--keyword-color)]">private</span> <span class="text-[var(--darcula-text)]">List&lt;Task&gt;</span> <span class="text-[#9876aa]">storage</span> = <span class="text-[var(--keyword-color)]">new</span> <span class="text-[var(--darcula-text)]">ArrayList</span>&lt;&gt;();`;
        container.appendChild(header);

        // 3. Si no hay tareas, añadimos el comentario de vacío debajo del header
        if (tasks.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = "p-5 italic text-[#555]";
            emptyMsg.innerText = "// No hay tareas en el buffer...";
            container.appendChild(emptyMsg);
            return;
        }

        // 4. Logica original: Dibujamos las filas de tareas
        tasks.forEach(task => {
            const taskRow = document.createElement('div');
            taskRow.className = `tree-item task-row prio-${task.priority} flex items-center justify-between hover:bg-[var(--darcula-hover)]`;

            const taskContent = document.createElement('div');
            taskContent.innerHTML = `
            <span class="keyword text-[var(--keyword-color)]">#${task.id}</span>
            <span class="method text-[var(--method-color)]">[${task.priority.toUpperCase()}]</span>
            <span class="string text-[var(--string-color)]">"${task.text}"</span>
            <span class="comment text-[var(--darcula-text-muted)]">// ${task.createdAt}</span>
            `;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete-single inline-flex cursor-pointer items-center justify-center border-0 bg-transparent';
            deleteBtn.title = 'Eliminar Tarea';

            const deleteIcon = document.createElement('img');
            deleteIcon.src = '/assets/TrashOne.png';
            deleteIcon.alt = 'Eliminar';
            deleteIcon.className = 'btn-delete-icon block h-5 w-5 [filter:var(--delete-icon-filter)]';
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
        entry.className = 'log-line mb-1 leading-[1.4]';
        entry.innerHTML = `
            <div><span class="info text-[var(--accent-blue)]">➜</span> <span class="user-cmd text-[var(--darcula-text-white)]">${this._escapeHTML(input)}</span></div>
            <div class="terminal-response pl-[15px]">${response}</div>
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

        const isHidden = panel.classList.contains('hidden');
        if (isHidden) {
            panel.classList.remove('hidden');
            panel.classList.add('flex');
            const input = document.getElementById('cli-input');
            if (input) input.focus();
        } else {
            panel.classList.add('hidden');
            panel.classList.remove('flex');
        }
    },

    /**
     * Muestra u oculta un panel genérico leyendo su estilo real 
     */
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

    /**
     * Cambia de pestaña (Controller / Kanban)
     */
    switchTab(tabId) {
        const pages = document.querySelectorAll('.code-page');
        pages.forEach(page => {
            const isActive = page.id === tabId;
            page.classList.toggle('hidden', !isActive);
            page.classList.toggle('flex', isActive);
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
                treeItem.classList.toggle('bg-[var(--darcula-hover)]', isActive);
                treeItem.classList.toggle('border-l-2', isActive);
                treeItem.classList.toggle('border-[var(--accent-blue)]', isActive);
            }
        });
    }
};
