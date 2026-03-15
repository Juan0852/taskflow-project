import { TaskService } from '../../domain/tasks/task-service.js';
import { TaskListView } from './task-list.view.js';
import { TaskListViewModel } from './task-list.viewmodel.js';

export const TaskListController = {
    filters: { ...TaskListViewModel.filters },
    selection: { ...TaskListViewModel.selection },
    sortOptions: [...TaskListViewModel.sortOptions],

    bindTaskListEvents() {
        if (this.elements.sortAddButton) {
            this.elements.sortAddButton.addEventListener('click', () => this.handleAddSortClick());
        }
    },

    setSearchTerm(searchTerm) {
        TaskListViewModel.setSearchTerm(this, searchTerm);
    },

    setActiveType(type) {
        TaskListViewModel.setActiveType(this, type);
    },

    setSelectedTask(taskId) {
        TaskListViewModel.setSelectedTask(this, taskId);
    },

    getSelectedTask() {
        return TaskListViewModel.getSelectedTask(this);
    },

    setSortRule(index, sortBy) {
        TaskListViewModel.setSortRule(this, index, sortBy);
    },

    removeSortRule(index) {
        TaskListViewModel.removeSortRule(this, index);
    },

    _getNextAvailableSort() {
        return TaskListViewModel.getNextAvailableSort(this);
    },

    _syncSelectedTaskActionState() {
        TaskListView.syncSelectedTaskActionState(this);
    },

    renderSortControls() {
        TaskListView.renderSortControls(this, {
            onSortChange: (index, sortBy) => this.handleSortChange(index, sortBy),
            onRemoveSort: (index) => this.handleRemoveSort(index)
        });
    },

    renderTypeFilters() {
        const filterItems = TaskListViewModel.getTypeFilters();
        TaskListViewModel.ensureValidActiveType(this, filterItems.slice(1));
        TaskListView.renderTypeFilters(this, filterItems, {
            onTypeFilterClick: (type) => this.handleTypeFilterClick(type)
        });
    },

    renderTaskList(tasks) {
        const filteredTasks = TaskListViewModel.sortTasks(this, TaskListViewModel.getFilteredTasks(this, tasks));
        TaskListViewModel.clearInvalidSelection(this, tasks);
        this._syncSelectedTaskActionState();
        this.renderTypeFilters();
        this.renderKanbanBoard(filteredTasks, { filtered: true });

        TaskListView.renderTaskList(this, filteredTasks, {
            getEmptyStateText: () => this.getEmptyStateText(),
            getTaskPreviewText: (task) => TaskListViewModel.getTaskPreviewText(task),
            isExpandableTask: (task) => TaskListViewModel.isExpandableTask(task),
            onTaskRowClick: (taskId) => this.handleTaskRowClick(taskId),
            onExpandTaskClick: (task, event) => this.handleExpandTaskClick(task, event),
            onDeleteTaskClick: (task, event) => this.handleDeleteTaskClick(task, event)
        });
    },

    getEmptyStateText() {
        return TaskListViewModel.shouldShowFilteredEmptyState(this)
            ? "// No hay tareas que coincidan con los filtros activos..."
            : "// No hay tareas en el buffer...";
    },

    handleAddSortClick() {
        if (this.filters.sortRules.length >= 3) return;
        this.filters.sortRules.push(this._getNextAvailableSort());
        this.renderSortControls();
        this.renderTaskList(TaskService.getAll());
    },

    handleSortChange(index, sortBy) {
        this.setSortRule(index, sortBy);
        this.renderTaskList(TaskService.getAll());
    },

    handleRemoveSort(index) {
        this.removeSortRule(index);
        this.renderSortControls();
        this.renderTaskList(TaskService.getAll());
    },

    handleTypeFilterClick(type) {
        this.setActiveType(type);
        this.renderTaskList(TaskService.getAll());
    },

    handleTaskRowClick(taskId) {
        this.setSelectedTask(taskId);
        this.renderTaskList(TaskService.getAll());
    },

    async handleExpandTaskClick(task, event) {
        event.stopPropagation();

        const stressWarning = TaskListViewModel.shouldShowStressWarning(task)
            ? '<p class="mb-4 rounded-[10px] border border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] px-4 py-3 text-[13px] leading-6 text-[var(--color-text-strong)]">¿De verdad estas intentando hacer una prueba de estres? porque lo parece bastante.<br><br>Si no estas intentando hacer una prueba de estres, que cojones estas pegando o de que cojones es tu tarea?</p>'
            : '';

        const safeType = TaskListView.escapeHTML(task.type || TaskService.DEFAULT_TYPE);
        const safeStatus = TaskListView.escapeHTML(task.status || TaskService.DEFAULT_STATUS);
        const safePriority = TaskListView.escapeHTML(task.priority || 'media');
        const safeText = TaskListView.escapeHTML(task.text || '');

        await this.dialogService.alert({
            title: `Tarea #${task.id}`,
            eyebrow: 'Detalle completo',
            confirmText: 'Cerrar',
            messageHTML: `
                ${stressWarning}
                <div class="space-y-4 text-left">
                    <div class="grid gap-3 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-base)] p-4 text-[13px] leading-6 text-[var(--color-text-soft)]">
                        <div><span class="font-semibold text-[var(--color-text-strong)]">ID:</span> ${task.id}</div>
                        <div><span class="font-semibold text-[var(--color-text-strong)]">Prioridad:</span> ${safePriority}</div>
                        <div><span class="font-semibold text-[var(--color-text-strong)]">Tipo:</span> ${safeType}</div>
                        <div><span class="font-semibold text-[var(--color-text-strong)]">Estado:</span> ${safeStatus}</div>
                    </div>
                    <div class="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-base)] p-4">
                        <p class="mb-3 text-[12px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Contenido completo</p>
                        <pre class="overflow-x-auto whitespace-pre-wrap break-words text-[13px] leading-6 text-[var(--color-text-soft)]">${safeText}</pre>
                    </div>
                </div>
            `,
            messageClassName: 'max-h-[60vh] overflow-y-auto text-[14px] leading-7 text-[var(--color-text-soft)]',
            cardClassName: 'relative z-[1] flex w-full max-w-[720px] flex-col overflow-hidden rounded-[16px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] shadow-[0_28px_90px_rgba(0,0,0,0.5)]'
        });
    },

    async handleDeleteTaskClick(task, event) {
        event.stopPropagation();
        const shouldDelete = await this.dialogService.confirm({
            title: 'Eliminar tarea',
            message: `¿Estás seguro de que quieres borrar la tarea #${task.id}?`,
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            tone: 'danger'
        });

        if (!shouldDelete) return;

        TaskService.delete(task.id);
        if (this.selection.activeTaskId === task.id) {
            this.selection.activeTaskId = null;
        }
        this.renderTaskList(TaskService.getAll());
    }
};
