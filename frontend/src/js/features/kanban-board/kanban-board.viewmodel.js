import { TaskListViewModel } from '../task-list/task-list.viewmodel.js';

export const KanbanBoardViewModel = {
    columns: [
        { status: 'pendiente', title: 'Pendiente' },
        { status: 'haciendo', title: 'Haciendo' },
        { status: 'completado', title: 'Completado' }
    ],

    getBoardTasks(uiManager, tasks, options = {}) {
        if (options.filtered) return tasks;
        return TaskListViewModel.sortTasks(uiManager, TaskListViewModel.getFilteredTasks(uiManager, tasks));
    },

    groupTasksByStatus(tasks) {
        return this.columns.reduce((groups, column) => {
            groups[column.status] = tasks.filter(task => task.status === column.status);
            return groups;
        }, {});
    }
};
