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
        const primarySortRule = state.sortRules[0] || 'date-desc';
        const { sortBy, sortOrder } = this.toBackendSort(primarySortRule);

        return {
            search: state.searchTerm || undefined,
            type: state.activeType !== 'all' ? state.activeType : undefined,
            sortBy,
            sortOrder,
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
            'date-desc': (a, b) => this.toSortableDate(b.createdAt) - this.toSortableDate(a.createdAt),
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

            return this.toSortableDate(b.createdAt) - this.toSortableDate(a.createdAt);
        });

        return sortedTasks;
    },

    toSortableDate(value) {
        const parsedDate = new Date(value);
        const timestamp = parsedDate.getTime();
        return Number.isNaN(timestamp) ? 0 : timestamp;
    },

    toBackendSort(sortRule = 'date-desc') {
        const mappings = {
            'date-desc': { sortBy: 'createdAt', sortOrder: 'desc' },
            'type-asc': { sortBy: 'type', sortOrder: 'asc' },
            'status-asc': { sortBy: 'status', sortOrder: 'asc' },
            'priority-desc': { sortBy: 'priority', sortOrder: 'desc' }
        };

        return mappings[sortRule] || mappings['date-desc'];
    },

    formatDisplayDateTime(value) {
        const parsedDate = new Date(value);

        if (Number.isNaN(parsedDate.getTime())) {
            return value || '';
        }

        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getDate()).padStart(2, '0');
        const hours = String(parsedDate.getHours()).padStart(2, '0');
        const minutes = String(parsedDate.getMinutes()).padStart(2, '0');
        const seconds = String(parsedDate.getSeconds()).padStart(2, '0');

        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    },

    buildDisplayIdMap(tasks) {
        const sortedTasks = [...tasks].sort((a, b) => {
            const dateDiff = this.toSortableDate(a.createdAt) - this.toSortableDate(b.createdAt);

            if (dateDiff !== 0) return dateDiff;

            return String(a.id).localeCompare(String(b.id));
        });

        return new Map(
            sortedTasks.map((task, index) => [String(task.id), index + 1])
        );
    },

    getDisplayId(displayIdMap, taskId) {
        return displayIdMap.get(String(taskId)) || '—';
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
