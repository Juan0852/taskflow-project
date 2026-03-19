import { TrashBinService } from './trash-bin.service.js';
import { TrashBinView } from './trash-bin.view.js';
import { TrashBinViewModel } from './trash-bin.viewmodel.js';

export const TrashBinListeners = {
    elements: {},
    dialogService: null,
    uiManager: null,
    state: { ...TrashBinViewModel.state },

    init(elements, services = {}) {
        this.elements = elements || {};
        this.dialogService = services.dialogService || null;
        this.uiManager = services.uiManager || null;

        this.bindEvents();
        this.render();
    },

    bindEvents() {
        if (this.elements.trigger) {
            this.elements.trigger.addEventListener('click', () => {
                void this.open();
            });
        }

        if (this.elements.close) {
            this.elements.close.addEventListener('click', () => this.close());
        }

        if (this.elements.backdrop) {
            this.elements.backdrop.addEventListener('click', () => this.close());
        }

        if (this.elements.restoreButton) {
            this.elements.restoreButton.addEventListener('click', () => {
                void this.handleRestoreSelected();
            });
        }

        if (this.elements.emptyButton) {
            this.elements.emptyButton.addEventListener('click', () => {
                void this.handleEmptyTrash();
            });
        }

        if (this.elements.list) {
            this.elements.list.addEventListener('click', (event) => {
                const button = event.target.closest('[data-trash-task-id]');
                if (!button) return;

                this.handleSelectTask(button.getAttribute('data-trash-task-id'));
            });
        }
    },

    async open() {
        if (!this.elements.modal) return;

        const didLoad = await this.refresh({ showErrors: true });
        if (!didLoad) {
            this.close();
            return;
        }

        this.elements.modal.classList.remove('hidden');
        this.elements.modal.classList.add('flex');
    },

    close() {
        if (!this.elements.modal) return;

        this.elements.modal.classList.add('hidden');
        this.elements.modal.classList.remove('flex');
    },

    render() {
        TrashBinView.render(this);
    },

    async refresh(options = {}) {
        const { showErrors = false } = options;

        try {
            TrashBinViewModel.setLoading(this, true);
            this.render();

            const response = await TrashBinService.loadTrash({ page: 1, limit: 100 });
            TrashBinViewModel.setItems(this, response.items);
            return true;
        } catch (error) {
            TrashBinViewModel.setItems(this, []);

            if (showErrors && this.dialogService) {
                await this.dialogService.alert({
                    title: 'No se pudo abrir la papelera',
                    message: error?.payload?.message || error?.message || 'No fue posible cargar las tareas eliminadas.',
                    confirmText: 'Entendido',
                    tone: 'danger'
                });
            }
            return false;
        } finally {
            TrashBinViewModel.setLoading(this, false);
            this.render();
        }
    },

    handleSelectTask(taskId) {
        TrashBinViewModel.setSelectedTaskId(this, taskId);
        this.render();
    },

    async handleRestoreSelected() {
        const selectedTask = TrashBinViewModel.getSelectedTask(this);
        if (!selectedTask) return;

        try {
            TrashBinViewModel.setLoading(this, true);
            this.render();

            await TrashBinService.restoreTask(selectedTask.id);
            await this.refresh({ showErrors: false });
            if (this.uiManager) {
                await this.uiManager.refreshVisibleTasks();
            }
        } catch (error) {
            TrashBinViewModel.setLoading(this, false);
            this.render();

            if (this.dialogService) {
                await this.dialogService.alert({
                    title: 'No se pudo restaurar la tarea',
                    message: error?.payload?.message || error?.message || 'La restauración falló.',
                    confirmText: 'Entendido',
                    tone: 'danger'
                });
            }
        }
    },

    async handleEmptyTrash() {
        if (!this.state.items.length) return;

        const shouldEmpty = this.dialogService
            ? await this.dialogService.confirm({
                title: 'Vaciar papelera',
                message: 'Se borrarán definitivamente todas las tareas eliminadas. Esta acción no se puede deshacer.',
                confirmText: 'Vaciar papelera',
                cancelText: 'Cancelar',
                tone: 'danger',
                eyebrow: 'Papelera'
            })
            : true;

        if (!shouldEmpty) return;

        try {
            TrashBinViewModel.setLoading(this, true);
            this.render();

            await TrashBinService.emptyTrash();
            await this.refresh({ showErrors: false });
        } catch (error) {
            TrashBinViewModel.setLoading(this, false);
            this.render();

            if (this.dialogService) {
                await this.dialogService.alert({
                    title: 'No se pudo vaciar la papelera',
                    message: error?.payload?.message || error?.message || 'La limpieza de la papelera falló.',
                    confirmText: 'Entendido',
                    tone: 'danger'
                });
            }
        }
    }
};
