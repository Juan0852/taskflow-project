import { TaskService } from '../../domain/tasks/task-service.js';

export const TaskListView = {
    escapeHTML(value = '') {
        const element = document.createElement('div');
        element.textContent = String(value);
        return element.innerHTML;
    },

    syncSelectedTaskActionState(uiManager) {
        const editButton = document.getElementById('btn-edit-selected-gui');
        if (!editButton) return;

        const hasSelection = uiManager.getSelectedTask() !== null;
        editButton.disabled = !hasSelection;
        editButton.classList.toggle('opacity-50', !hasSelection);
        editButton.classList.toggle('cursor-not-allowed', !hasSelection);
        editButton.classList.toggle('hover:border-[var(--color-accent-border)]', hasSelection);
        editButton.classList.toggle('hover:bg-[var(--color-control-hover)]', hasSelection);
        editButton.classList.toggle('hover:text-[var(--color-text-strong)]', hasSelection);
        editButton.title = hasSelection ? 'Editar tarea seleccionada' : 'Selecciona una tarea para editarla';
    },

    renderSortControls(uiManager, handlers) {
        const container = uiManager.elements.sortControls;
        if (!container) return;

        container.innerHTML = '';

        uiManager.filters.sortRules.forEach((rule, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'flex items-center gap-1';

            const select = document.createElement('select');
            select.className = 'h-8 cursor-pointer rounded border border-[var(--color-border-soft)] bg-[var(--color-bg-surface)] px-3 text-[12px] text-[var(--color-text)] outline-none transition-[border-color,box-shadow] duration-200 hover:border-[var(--color-accent-border)] focus:border-[var(--color-accent-border)] focus:shadow-[0_0_0_2px_rgba(75,110,175,0.22)]';

            uiManager.sortOptions.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.value;
                optionElement.textContent = option.label;
                optionElement.selected = option.value === rule;
                select.appendChild(optionElement);
            });

            select.addEventListener('change', (event) => handlers.onSortChange(index, event.target.value));
            wrapper.appendChild(select);

            if (uiManager.filters.sortRules.length > 1) {
                const removeButton = document.createElement('button');
                removeButton.type = 'button';
                removeButton.title = 'Quitar criterio de orden';
                removeButton.className = 'inline-flex h-8 w-8 items-center justify-center rounded border border-[var(--color-border-soft)] bg-[var(--color-bg-surface)] text-[14px] text-[var(--color-text-muted)] transition-[border-color,background-color,color] duration-200 hover:border-[var(--color-danger-border)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-danger-text)]';
                removeButton.textContent = '×';
                removeButton.addEventListener('click', () => handlers.onRemoveSort(index));
                wrapper.appendChild(removeButton);
            }

            container.appendChild(wrapper);
        });

        if (uiManager.elements.sortAddButton) {
            uiManager.elements.sortAddButton.classList.toggle('hidden', !uiManager.filterPreferences.allowMultipleSortRules);
            uiManager.elements.sortAddButton.disabled = uiManager.filters.sortRules.length >= 3;
            uiManager.elements.sortAddButton.classList.toggle('opacity-50', uiManager.elements.sortAddButton.disabled);
            uiManager.elements.sortAddButton.classList.toggle('cursor-not-allowed', uiManager.elements.sortAddButton.disabled);
        }
    },

    renderTypeFilters(uiManager, filterItems, handlers) {
        const container = uiManager.elements.typeFilters;
        if (!container) return;

        container.innerHTML = '';

        filterItems.forEach(type => {
            const button = document.createElement('button');
            const isActive = uiManager.filters.activeType === type;
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
            button.addEventListener('click', () => handlers.onTypeFilterClick(type));
            container.appendChild(button);
        });
    },

    renderTaskList(uiManager, tasks, handlers) {
        const container = uiManager.elements.taskContainer;
        if (!container) return;

        container.innerHTML = '';

        const header = document.createElement('div');
        header.className = "border-b border-solid border-[var(--color-border-strong)] px-[15px] py-[10px] font-mono text-[14px]";
        header.innerHTML = `<span class="text-[var(--color-code-keyword)]">private</span> <span class="text-[var(--color-text)]">List&lt;Task&gt;</span> <span class="text-[var(--color-code-identifier)]">storage</span> = <span class="text-[var(--color-code-keyword)]">new</span> <span class="text-[var(--color-text)]">ArrayList</span>&lt;&gt;();`;
        container.appendChild(header);

        if (tasks.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = "p-5 italic text-[var(--color-text-dim)]";
            emptyMsg.innerText = handlers.getEmptyStateText();
            container.appendChild(emptyMsg);
            return;
        }

        tasks.forEach(task => {
            const taskRow = document.createElement('div');
            const isSelected = uiManager.selection.activeTaskId === task.id;
            const previewText = handlers.getTaskPreviewText(task);
            const isExpandable = handlers.isExpandableTask(task);
            taskRow.className = [
                'tree-item',
                'task-row',
                `prio-${task.priority}`,
                'mx-2',
                'my-1',
                'flex',
                'items-center',
                'justify-between',
                'rounded-[6px]',
                'border',
                'px-3',
                'py-[6px]',
                'transition-[background-color,border-color,box-shadow]',
                'duration-150',
                isSelected
                    ? 'border-[var(--color-selection-border)] bg-[var(--color-selection-bg)]'
                    : 'border-transparent hover:bg-[var(--color-bg-hover)]'
            ].join(' ');
            taskRow.addEventListener('click', () => handlers.onTaskRowClick(task.id));

            const taskContent = document.createElement('div');
            taskContent.className = 'min-w-0 flex-1 overflow-hidden whitespace-nowrap text-ellipsis';
            const safeStatus = this.escapeHTML((task.status || 'pendiente').toUpperCase());
            const safeType = this.escapeHTML(task.type || TaskService.DEFAULT_TYPE);
            const safeText = this.escapeHTML(previewText);
            const safeCreatedAt = this.escapeHTML(task.createdAt || '');
            taskContent.innerHTML = `
            <span class="keyword text-[var(--color-code-keyword)]">#${task.id}</span>
            <span class="method text-[var(--color-code-method)]">[${task.priority.toUpperCase()}]</span>
            <span class="text-[var(--color-code-identifier)]">{${safeType}}</span>
            <span class="text-[var(--color-accent-info)]">&lt;${safeStatus}&gt;</span>
            <span class="string text-[var(--color-code-string)]">"${safeText}"</span>
            <span class="comment text-[var(--color-text-muted)]">// ${safeCreatedAt}</span>
            `;

            const actions = document.createElement('div');
            actions.className = 'ml-3 flex shrink-0 items-center gap-2';

            if (isExpandable) {
                const expandBtn = document.createElement('button');
                expandBtn.className = 'inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-[var(--color-border-soft)] bg-[var(--color-bg-surface)] text-[14px] text-[var(--color-text-soft)] transition-[border-color,background-color,color] duration-200 hover:border-[var(--color-accent-border)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-strong)]';
                expandBtn.title = 'Ver tarea completa';
                expandBtn.setAttribute('aria-label', 'Ver tarea completa');
                expandBtn.textContent = '▾';
                expandBtn.addEventListener('click', (event) => handlers.onExpandTaskClick(task, event));
                actions.appendChild(expandBtn);
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete-single inline-flex cursor-pointer items-center justify-center border-0 bg-transparent';
            deleteBtn.title = 'Eliminar Tarea';

            const deleteIcon = document.createElement('img');
            deleteIcon.src = '/assets/TrashOne.png';
            deleteIcon.alt = 'Eliminar';
            deleteIcon.className = 'btn-delete-icon block h-6 w-6 [filter:var(--delete-icon-filter)]';
            deleteBtn.appendChild(deleteIcon);

            deleteBtn.addEventListener('click', (event) => handlers.onDeleteTaskClick(task, event));
            actions.appendChild(deleteBtn);

            taskRow.appendChild(taskContent);
            taskRow.appendChild(actions);
            container.appendChild(taskRow);
        });

        container.scrollTop = container.scrollHeight;
    }
};
