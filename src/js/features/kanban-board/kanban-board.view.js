import { TaskService } from '../../domain/tasks/task-service.js';
import { TaskListViewModel } from '../task-list/task-list.viewmodel.js';

export const KanbanBoardView = {
    escapeHTML(value = '') {
        const element = document.createElement('div');
        element.textContent = String(value);
        return element.innerHTML;
    },

    isInteractiveTarget(target) {
        return target instanceof Element && Boolean(target.closest('button, a, input, select, textarea'));
    },

    renderBoard(uiManager, columns, groupedTasks, handlers) {
        const container = uiManager.elements.kanbanContainer;
        if (!container) return;

        container.innerHTML = '';
        container.className = 'kanban-board grid min-h-[calc(100vh-280px)] grid-cols-1 gap-4 overflow-x-hidden p-4 lg:grid-cols-3';

        columns.forEach(column => {
            const columnElement = document.createElement('section');
            columnElement.className = 'flex min-w-0 flex-col rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-surface)]';
            columnElement.dataset.status = column.status;

            const header = document.createElement('div');
            header.className = 'flex items-center justify-between border-b border-[var(--color-border)] px-4 py-4';
            header.innerHTML = `
                <div>
                    <h3 class="text-[14px] font-semibold text-[var(--color-text-strong)]">${this.escapeHTML(column.title)}</h3>
                    <p class="mt-1 text-[12px] text-[var(--color-text-muted)]">${groupedTasks[column.status].length} tarea(s)</p>
                </div>
            `;

            const dropZone = document.createElement('div');
            dropZone.className = 'flex min-h-[420px] flex-1 flex-col gap-3 p-4 transition-colors duration-150';
            dropZone.addEventListener('dragover', (event) => handlers.onColumnDragOver(event, dropZone));
            dropZone.addEventListener('dragleave', () => handlers.onColumnDragLeave(dropZone));
            dropZone.addEventListener('drop', (event) => handlers.onColumnDrop(event, column.status, dropZone));

            if (groupedTasks[column.status].length === 0) {
                const empty = document.createElement('div');
                empty.className = 'rounded-[12px] border border-dashed border-[var(--color-border-soft)] bg-[var(--color-bg-base)] px-4 py-6 text-center text-[12px] italic text-[var(--color-text-muted)]';
                empty.textContent = 'Arrastra una tarea aquí';
                dropZone.appendChild(empty);
            } else {
                groupedTasks[column.status].forEach(task => {
                    dropZone.appendChild(this.createCard(task, handlers));
                });
            }

            columnElement.appendChild(header);
            columnElement.appendChild(dropZone);
            container.appendChild(columnElement);
        });
    },

    createCard(task, handlers) {
        const card = document.createElement('article');
        card.className = 'flex min-h-[170px] cursor-grab flex-col justify-between rounded-[14px] border border-[var(--color-border-soft)] bg-[var(--color-bg-base)] p-4 shadow-[0_10px_24px_rgba(0,0,0,0.12)] transition-[border-color,transform,box-shadow] duration-150 hover:-translate-y-[1px] hover:border-[var(--color-accent-border)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.18)]';
        card.draggable = true;
        card.dataset.taskId = String(task.id);
        card.addEventListener('dragstart', (event) => handlers.onCardDragStart(task, event, card));
        card.addEventListener('dragend', () => handlers.onCardDragEnd(card));
        card.addEventListener('click', (event) => {
            if (this.isInteractiveTarget(event.target)) return;
            handlers.onCardClick(task.id);
        });

        const safeType = this.escapeHTML(task.type || TaskService.DEFAULT_TYPE);
        const safeStatus = this.escapeHTML((task.status || TaskService.DEFAULT_STATUS).toUpperCase());
        const safeText = this.escapeHTML(TaskListViewModel.getTaskPreviewText(task));
        const safeDate = this.escapeHTML(task.createdAt || '');
        const shouldShowExpand = TaskListViewModel.isExpandableTask(task);
        card.innerHTML = `
            <div>
                <div class="mb-3 flex items-start justify-between gap-3">
                    <span class="text-[12px] font-semibold text-[var(--color-code-keyword)]">#${task.id}</span>
                    <span class="rounded-full border border-[var(--color-accent-border)] px-2 py-1 text-[11px] text-[var(--color-accent-info)]">${safeStatus}</span>
                </div>
                <div class="mb-3 text-[12px] text-[var(--color-code-identifier)]">{${safeType}}</div>
                <p class="line-clamp-3 whitespace-pre-wrap break-words text-[13px] leading-6 text-[var(--color-text-soft)]">${safeText}</p>
            </div>
            <div class="mt-4 flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-3">
                <div class="flex items-center gap-2">
                    <button type="button" data-open-task-detail="${task.id}" class="${shouldShowExpand ? 'inline-flex' : 'hidden'} h-7 items-center justify-center rounded border border-[var(--color-border-soft)] bg-[var(--color-bg-surface)] px-2 text-[11px] text-[var(--color-text-soft)] transition-[border-color,background-color,color] duration-200 hover:border-[var(--color-accent-border)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-strong)]">Abrir</button>
                    <span class="text-[11px] text-[var(--color-code-method)]">[${task.priority.toUpperCase()}]</span>
                </div>
                <span class="text-right text-[11px] text-[var(--color-text-muted)]">${safeDate}</span>
            </div>
        `;

        const openTaskButton = card.querySelector(`[data-open-task-detail="${task.id}"]`);
        if (openTaskButton) {
            openTaskButton.draggable = false;
            openTaskButton.addEventListener('pointerdown', (event) => event.stopPropagation());
            openTaskButton.addEventListener('mousedown', (event) => event.stopPropagation());
            openTaskButton.addEventListener('click', (event) => handlers.onOpenTaskDetail(task, event));
        }

        return card;
    }
};
