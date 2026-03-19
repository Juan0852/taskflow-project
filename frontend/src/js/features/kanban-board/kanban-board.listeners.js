import { KanbanBoardService } from './kanban-board.service.js';
import { KanbanBoardView } from './kanban-board.view.js';
import { KanbanBoardViewModel } from './kanban-board.viewmodel.js';

export const KanbanBoardListeners = {
    draggedTaskId: null,

    renderKanbanBoard(tasks, options = {}) {
        const boardTasks = KanbanBoardViewModel.getBoardTasks(this, tasks, options);
        const groupedTasks = KanbanBoardViewModel.groupTasksByStatus(boardTasks);

        KanbanBoardView.renderBoard(this, KanbanBoardViewModel.columns, groupedTasks, {
            onCardClick: (taskId) => this.handleKanbanCardClick(taskId),
            onCardDragStart: (task, event, card) => this.handleKanbanCardDragStart(task, event, card),
            onCardDragEnd: (card) => this.handleKanbanCardDragEnd(card),
            onColumnDragOver: (event, dropZone) => this.handleKanbanColumnDragOver(event, dropZone),
            onColumnDragLeave: (dropZone) => this.handleKanbanColumnDragLeave(dropZone),
            onColumnDrop: (event, status, dropZone) => this.handleKanbanColumnDrop(event, status, dropZone),
            onOpenTaskDetail: (task, event) => this.handleKanbanOpenTaskDetail(task, event)
        });
    },

    refreshKanbanBoard() {
        this.renderKanbanBoard(KanbanBoardService.getAllTasks());
    },

    handleKanbanCardClick(taskId) {
        this.setSelectedTask(taskId);
        this.refreshVisibleTasks();
    },

    handleKanbanOpenTaskDetail(task, event) {
        event.stopPropagation();
        this.handleExpandTaskClick(task, event);
    },

    handleKanbanCardDragStart(task, event, card) {
        this.draggedTaskId = task.id;
        event.dataTransfer.effectAllowed = 'move';
        card.classList.add('opacity-60');
    },

    handleKanbanCardDragEnd(card) {
        this.draggedTaskId = null;
        card.classList.remove('opacity-60');
        this.elements.kanbanContainer?.querySelectorAll('[data-status]').forEach(column => {
            column.querySelector('div:last-child')?.classList.remove('bg-[var(--color-bg-hover)]');
        });
    },

    handleKanbanColumnDragOver(event, dropZone) {
        event.preventDefault();
        dropZone.classList.add('bg-[var(--color-bg-hover)]');
    },

    handleKanbanColumnDragLeave(dropZone) {
        dropZone.classList.remove('bg-[var(--color-bg-hover)]');
    },

    async handleKanbanColumnDrop(event, nextStatus, dropZone) {
        event.preventDefault();
        this.handleKanbanColumnDragLeave(dropZone);
        if (this.draggedTaskId === null) return;

        const task = KanbanBoardService.getTaskById(this.draggedTaskId);
        if (!task || task.status === nextStatus) return;

        try {
            await KanbanBoardService.moveTaskToStatus(task.id, nextStatus);
            await this.refreshVisibleTasks();
        } catch (error) {
            if (this.dialogService) {
                await this.dialogService.alert({
                    title: 'No se pudo mover la tarea',
                    message: error?.payload?.message || error?.message || 'La actualización del estado falló.',
                    confirmText: 'Entendido',
                    tone: 'danger'
                });
            }

            this.refreshVisibleTasks();
        }
    },

    syncWorkspaceControlsVisibility(tabId) {
        if (!this.elements.sharedWorkspaceControls) return;
        const shouldShowControls = tabId === 'controller-file' || tabId === 'kanban-file';
        this.elements.sharedWorkspaceControls.classList.toggle('hidden', !shouldShowControls);
    }
};
