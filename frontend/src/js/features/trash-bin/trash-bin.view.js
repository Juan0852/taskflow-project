import { TrashBinViewModel } from './trash-bin.viewmodel.js';

function escapeHTML(value = '') {
    const paragraph = document.createElement('p');
    paragraph.textContent = value;
    return paragraph.innerHTML;
}

export const TrashBinView = {
    render(listeners) {
        const {
            list,
            restoreButton,
            emptyButton,
            status
        } = listeners.elements;

        if (!list || !restoreButton || !emptyButton || !status) return;

        const items = listeners.state.items || [];
        const selectedTask = TrashBinViewModel.getSelectedTask(listeners);
        const displayIdMap = TrashBinViewModel.getDisplayIdMap(items);

        restoreButton.disabled = !selectedTask || listeners.state.loading;
        restoreButton.classList.toggle('opacity-50', restoreButton.disabled);
        restoreButton.classList.toggle('cursor-not-allowed', restoreButton.disabled);

        emptyButton.disabled = !items.length || listeners.state.loading;
        emptyButton.classList.toggle('opacity-50', emptyButton.disabled);
        emptyButton.classList.toggle('cursor-not-allowed', emptyButton.disabled);

        if (listeners.state.loading) {
            status.textContent = 'Cargando tareas eliminadas...';
        } else if (!items.length) {
            status.textContent = TrashBinViewModel.getEmptyStateText();
        } else {
            status.textContent = `${items.length} tarea(s) en la papelera.`;
        }

        if (!items.length) {
            list.innerHTML = `
                <div class="rounded-[12px] border border-dashed border-[var(--color-border)] bg-[var(--color-bg-base)] px-4 py-6 text-[13px] leading-6 text-[var(--color-text-soft)]">
                    ${escapeHTML(TrashBinViewModel.getEmptyStateText())}
                </div>
            `;
            return;
        }

        list.innerHTML = items.map(task => {
            const isSelected = task.id === listeners.state.selectedTaskId;
            const displayId = TrashBinViewModel.getDisplayId(displayIdMap, task.id);

            return `
                <button
                    type="button"
                    data-trash-task-id="${escapeHTML(String(task.id))}"
                    class="flex w-full flex-col gap-2 rounded-[12px] border px-4 py-3 text-left transition-[border-color,background-color,color] duration-200 ${isSelected
                        ? 'border-[var(--color-accent-border)] bg-[var(--color-accent-bg)]'
                        : 'border-[var(--color-border)] bg-[var(--color-bg-base)] hover:border-[var(--color-accent-border)] hover:bg-[var(--color-bg-hover)]'}">
                    <div class="flex items-center justify-between gap-3">
                        <span class="text-[12px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">Tarea #${displayId}</span>
                        <span class="text-[12px] text-[var(--color-text-soft)]">${escapeHTML(TrashBinViewModel.formatDateTime(task.trashedAt || task.updatedAt || task.createdAt))}</span>
                    </div>
                    <div class="text-[14px] font-semibold text-[var(--color-text-strong)]">${escapeHTML(task.text || 'Sin contenido')}</div>
                    <div class="flex flex-wrap items-center gap-2 text-[12px] text-[var(--color-text-soft)]">
                        <span class="rounded-full border border-[var(--color-border-soft)] px-2 py-1">${escapeHTML(task.type)}</span>
                        <span class="rounded-full border border-[var(--color-border-soft)] px-2 py-1">${escapeHTML(task.status)}</span>
                        <span class="rounded-full border border-[var(--color-border-soft)] px-2 py-1">${escapeHTML(task.priority)}</span>
                    </div>
                </button>
            `;
        }).join('');
    }
};
