/**
 * BiTask - Task Service [Oso de Anteojos]
 * Gestión de datos con IDs secuenciales (1, 2, 3...).
 */
export const TaskService = {
    DEFAULT_TYPE: 'general',
    DEFAULT_STATUS: 'pendiente',
    VALID_STATUSES: ['pendiente', 'haciendo', 'completado'],

    // 1. CARGA INICIAL (defensiva para evitar romper toda la app por storage corrupto/bloqueado)
    _tasks: [],

    // Recuperamos el último ID usado o empezamos en 0
    _lastId: 0,

    /**
     * Obtiene todas las tareas
     */
    getAll() {
        return this._tasks;
    },

    /**
     * Añade una nueva tarea con ID secuencial
     */
    add(text, priority, type, status) {
        // Incrementamos el contador global
        this._lastId++;

        const newTask = {
            id: this._lastId, // ID simple: 1, 2, 3...
            ...this.createTaskData(text, priority, type, status)
        };

        this._tasks.push(newTask);
        this._save();
        return newTask;
    },

    createTaskData(text, priority, type, status) {
        return {
            text: text.trim(),
            priority,
            type: this._normalizeType(type),
            status: this._normalizeStatus(status),
            createdAt: new Date().toLocaleString()
        };
    },

    getAvailableTypes() {
        return [...new Set(this._tasks.map(task => task.type))].sort((a, b) => a.localeCompare(b));
    },

    /**
     * Elimina una tarea por su ID
     */
    delete(id) {
        const initialLength = this._tasks.length;
        this._tasks = this._tasks.filter(t => t.id !== id);

        const success = this._tasks.length < initialLength;
        if (success) this._save();

        return success;
    },

    /**
     * Actualiza una tarea
     */
    update(id, updates) {
        const task = this._tasks.find(t => t.id === id);
        if (!task) return null;

        const normalizedUpdates = { ...updates };

        if (typeof normalizedUpdates.text === 'string') {
            normalizedUpdates.text = normalizedUpdates.text.trim();
        }

        if ('type' in normalizedUpdates) {
            normalizedUpdates.type = this._normalizeType(normalizedUpdates.type);
        }

        if ('status' in normalizedUpdates) {
            normalizedUpdates.status = this._normalizeStatus(normalizedUpdates.status);
        }

        Object.assign(task, normalizedUpdates);
        this._save();
        return task;
    },

    /**
     * Reset total (Opcional, limpia también el contador)
     */
    hardReset() {
        this._tasks = [];
        this._lastId = 0;
        this._save();
    },

    // --- MÉTODOS PRIVADOS ---

    /**
     * Persiste los datos y el estado del contador de IDs
     */
    _save() {
        try {
            localStorage.setItem('bitask_db', JSON.stringify(this._tasks));
            localStorage.setItem('bitask_last_id', this._lastId.toString());
        } catch (error) {
            // Ignorado: storage no disponible o bloqueado
        }
    },

    clearAll() {
        this._tasks = [];
        this._save();
    },

    init() {
        try {
            const rawTasks = localStorage.getItem('bitask_db');
            const parsedTasks = rawTasks ? JSON.parse(rawTasks) : [];
            this._tasks = Array.isArray(parsedTasks)
                ? parsedTasks.map(task => this._normalizeTask(task))
                : [];
        } catch (error) {
            this._tasks = [];
        }

        try {
            const rawLastId = localStorage.getItem('bitask_last_id');
            const parsedLastId = rawLastId ? parseInt(rawLastId, 10) : 0;
            this._lastId = Number.isFinite(parsedLastId) ? parsedLastId : 0;
        } catch (error) {
            this._lastId = 0;
        }
    },

    _normalizeType(type = '') {
        const cleanType = String(type || '').trim().toLowerCase();
        return cleanType || this.DEFAULT_TYPE;
    },

    _normalizeStatus(status = '') {
        const cleanStatus = String(status || '').trim().toLowerCase();
        return this.VALID_STATUSES.includes(cleanStatus) ? cleanStatus : this.DEFAULT_STATUS;
    },

    _normalizeTask(task = {}) {
        return {
            id: task.id,
            text: typeof task.text === 'string' ? task.text : '',
            priority: task.priority || 'media',
            type: this._normalizeType(task.type),
            status: this._normalizeStatus(task.status),
            createdAt: task.createdAt || new Date().toLocaleString()
        };
    }
};

TaskService.init();
