import { TaskService } from '../../domain/tasks/task-service.js';
import { KanbanBoardView } from './kanban-board.view.js';
import { KanbanBoardViewModel } from './kanban-board.viewmodel.js';

export const KanbanBoardController = {
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

    handleKanbanCardClick(taskId) {
        this.setSelectedTask(taskId);
        this.renderTaskList(TaskService.getAll());
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

    handleKanbanColumnDrop(event, nextStatus, dropZone) {
        event.preventDefault();
        this.handleKanbanColumnDragLeave(dropZone);
        if (this.draggedTaskId === null) return;

        const task = TaskService.getAll().find(item => item.id === this.draggedTaskId);
        if (!task || task.status === nextStatus) return;

        TaskService.update(task.id, { status: nextStatus });
        this.renderTaskList(TaskService.getAll());
    },

    syncWorkspaceControlsVisibility(tabId) {
        if (!this.elements.sharedWorkspaceControls) return;
        const shouldShowControls = tabId === 'controller-file' || tabId === 'kanban-file';
        this.elements.sharedWorkspaceControls.classList.toggle('hidden', !shouldShowControls);
    }
};
