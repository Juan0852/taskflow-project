/**
 * BiTask - Task Service [Oso de Anteojos]
 * Gestión de datos con IDs secuenciales (1, 2, 3...).
 */
import { STORAGE_KEYS } from '../../shared/storage-keys.js';
import { StorageService } from '../../shared/storage-service.js';

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
        const now = new Date();
        return {
            text: text.trim(),
            priority,
            type: this._normalizeType(type),
            status: this._normalizeStatus(status),
            createdAt: now.toLocaleString(),
            createdDate: this._toISODate(now)
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

    markAllAsCompleted() {
        if (!this._tasks.length) return 0;

        let updatedCount = 0;
        this._tasks.forEach(task => {
            if (task.status !== 'completado') {
                task.status = 'completado';
                updatedCount++;
            }
        });

        if (updatedCount > 0) {
            this._save();
        }

        return updatedCount;
    },

    clearCompleted() {
        if (!this._tasks.length) return 0;

        const initialLength = this._tasks.length;
        this._tasks = this._tasks.filter(task => task.status !== 'completado');
        const removedCount = initialLength - this._tasks.length;

        if (removedCount > 0) {
            this._save();
        }

        return removedCount;
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
        StorageService.setJSON(STORAGE_KEYS.TASKS_DB, this._tasks);
        StorageService.setString(STORAGE_KEYS.TASKS_LAST_ID, this._lastId);
    },

    clearAll() {
        this._tasks = [];
        this._save();
    },

    init() {
        const parsedTasks = StorageService.getJSON(STORAGE_KEYS.TASKS_DB, []);
        this._tasks = Array.isArray(parsedTasks)
            ? parsedTasks.map(task => this._normalizeTask(task))
            : [];

        const rawLastId = StorageService.getString(STORAGE_KEYS.TASKS_LAST_ID, '0');
        const parsedLastId = parseInt(rawLastId, 10);
        this._lastId = Number.isFinite(parsedLastId) ? parsedLastId : 0;
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
        const fallbackDate = this._extractDateFromTask(task);
        return {
            id: task.id,
            text: typeof task.text === 'string' ? task.text : '',
            priority: task.priority || 'media',
            type: this._normalizeType(task.type),
            status: this._normalizeStatus(task.status),
            createdAt: task.createdAt || new Date().toLocaleString(),
            createdDate: fallbackDate
        };
    },

    _extractDateFromTask(task = {}) {
        if (typeof task.createdDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(task.createdDate)) {
            return task.createdDate;
        }

        const parsedFromCreatedAt = task.createdAt ? new Date(task.createdAt) : null;
        if (parsedFromCreatedAt instanceof Date && !Number.isNaN(parsedFromCreatedAt.getTime())) {
            return this._toISODate(parsedFromCreatedAt);
        }

        return this._toISODate(new Date());
    },

    _toISODate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
};

TaskService.init();
