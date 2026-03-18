import { TaskListService } from './task-list.service.js';

export const TaskListViewModel = {
    INLINE_TEXT_LIMIT: 300,
    STRESS_TEST_WARNING_LIMIT: 500,
    filters: {
        searchTerm: '',
        activeType: 'all',
        sortRules: ['date-desc'],
        activeDates: []
    },
    pagination: {
        page: 1,
        limit: 20
    },
    selection: {
        activeTaskId: null
    },
    sortOptions: [
        { value: 'date-desc', label: 'Fecha' },
        { value: 'type-asc', label: 'Tipo de tarea' },
        { value: 'status-asc', label: 'Estado' },
        { value: 'priority-desc', label: 'Prioridad' }
    ],

    setSearchTerm(uiManager, searchTerm) {
        uiManager.filters.searchTerm = searchTerm;
        this.resetPagination(uiManager);
    },

    setActiveType(uiManager, type) {
        uiManager.filters.activeType = type;
        this.resetPagination(uiManager);
    },

    setSelectedTask(uiManager, taskId) {
        uiManager.selection.activeTaskId = taskId;
    },

    getSelectedTask(uiManager) {
        if (uiManager.selection.activeTaskId === null) return null;
        return TaskListService.getTaskById(uiManager.selection.activeTaskId);
    },

    setSortRule(uiManager, index, sortBy) {
        uiManager.filters.sortRules[index] = sortBy;
        this.resetPagination(uiManager);
    },

    addSortRule(uiManager, sortBy) {
        uiManager.filters.sortRules.push(sortBy);
        this.resetPagination(uiManager);
    },

    removeSortRule(uiManager, index) {
        if (uiManager.filters.sortRules.length === 1) return;
        uiManager.filters.sortRules.splice(index, 1);
        this.resetPagination(uiManager);
    },

    setActiveDates(uiManager, dateValues = []) {
        const uniqueDates = [...new Set(
            dateValues.filter(dateValue => typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue))
        )].sort();

        uiManager.filters.activeDates = uniqueDates;
        this.resetPagination(uiManager);
    },

    clearActiveDates(uiManager) {
        uiManager.filters.activeDates = [];
        this.resetPagination(uiManager);
    },

    resetPagination(uiManager) {
        if (!uiManager.pagination) {
            uiManager.pagination = { ...this.pagination };
            return;
        }

        uiManager.pagination.page = 1;
    },

    getQueryState(uiManager) {
        return {
            searchTerm: uiManager.filters.searchTerm,
            activeType: uiManager.filters.activeType,
            sortRules: [...uiManager.filters.sortRules],
            activeDates: [...uiManager.filters.activeDates],
            page: uiManager.pagination?.page ?? this.pagination.page,
            limit: uiManager.pagination?.limit ?? this.pagination.limit
        };
    },

    getBackendQueryParams(uiManager) {
        const state = this.getQueryState(uiManager);
        const [from, to] = state.activeDates.length > 0
            ? [state.activeDates[0], state.activeDates[state.activeDates.length - 1]]
            : [null, null];

        return {
            search: state.searchTerm || undefined,
            type: state.activeType !== 'all' ? state.activeType : undefined,
            sortBy: state.sortRules[0] || undefined,
            from: from || undefined,
            to: to || undefined,
            page: state.page,
            limit: state.limit
        };
    },

    getNextAvailableSort(uiManager) {
        const available = uiManager.sortOptions.map(option => option.value);
        return available.find(value => !uiManager.filters.sortRules.includes(value)) || 'date-desc';
    },

    getFilteredTasks(uiManager, tasks) {
        return tasks.filter(task => {
            const matchesType = uiManager.filters.activeType === 'all' || task.type === uiManager.filters.activeType;
            const search = uiManager.filters.searchTerm;
            const hasDateFilter = uiManager.filters.activeDates.length > 0;
            const matchesDate = !hasDateFilter || uiManager.filters.activeDates.includes(task.createdDate);
            const matchesSearch = !search
                || task.text.toLowerCase().includes(search)
                || task.id.toString().includes(search)
                || task.type.toLowerCase().includes(search)
                || task.status.toLowerCase().includes(search);

            return matchesType && matchesSearch && matchesDate;
        });
    },

    sortTasks(uiManager, tasks) {
        const sortedTasks = [...tasks];
        const priorityRank = { alta: 3, media: 2, baja: 1 };
        const statusRank = { pendiente: 1, haciendo: 2, completado: 3 };

        const comparators = {
            'date-desc': (a, b) => b.id - a.id,
            'type-asc': (a, b) => a.type.localeCompare(b.type),
            'status-asc': (a, b) => (statusRank[a.status] || 99) - (statusRank[b.status] || 99),
            'priority-desc': (a, b) => (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0)
        };

        sortedTasks.sort((a, b) => {
            for (const rule of uiManager.filters.sortRules) {
                const comparator = comparators[rule];
                if (!comparator) continue;
                const result = comparator(a, b);
                if (result !== 0) return result;
            }

            return b.id - a.id;
        });

        return sortedTasks;
    },

    ensureValidActiveType(uiManager, types) {
        if (uiManager.filters.activeType !== 'all' && !types.includes(uiManager.filters.activeType)) {
            uiManager.filters.activeType = 'all';
        }
    },

    clearInvalidSelection(uiManager, tasks) {
        if (
            uiManager.selection.activeTaskId !== null
            && !tasks.some(task => task.id === uiManager.selection.activeTaskId)
        ) {
            uiManager.selection.activeTaskId = null;
        }
    },

    getTypeFilters() {
        const types = TaskListService.getAvailableTypes();
        return ['all', ...types];
    },

    shouldShowFilteredEmptyState(uiManager) {
        return uiManager.filters.searchTerm || uiManager.filters.activeType !== 'all' || uiManager.filters.activeDates.length > 0;
    },

    isExpandableTask(task) {
        return (task.text || '').length > this.INLINE_TEXT_LIMIT;
    },

    getTaskPreviewText(task) {
        const text = task.text || '';
        if (text.length <= this.INLINE_TEXT_LIMIT) return text;
        return `${text.slice(0, this.INLINE_TEXT_LIMIT)}...`;
    },

    shouldShowStressWarning(task) {
        return (task.text || '').length > this.STRESS_TEST_WARNING_LIMIT;
    }
};
