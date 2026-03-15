import { CalendarFilterViewModel } from './calendar-filter.viewmodel.js';

export const CalendarFilterView = {
    renderCalendarGrid(uiManager, handlers) {
        const { calendarGrid, calendarMonthLabel } = uiManager.elements;
        if (!calendarGrid || !calendarMonthLabel) return;

        const monthDate = new Date(uiManager.calendarView.year, uiManager.calendarView.month, 1);
        const daysInMonth = new Date(uiManager.calendarView.year, uiManager.calendarView.month + 1, 0).getDate();
        const monthLabel = monthDate.toLocaleDateString('es-ES', {
            month: 'long',
            year: 'numeric'
        });

        calendarMonthLabel.textContent = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
        calendarGrid.innerHTML = '';

        for (let day = 1; day <= daysInMonth; day++) {
            const dayDate = new Date(uiManager.calendarView.year, uiManager.calendarView.month, day);
            const isoDate = CalendarFilterViewModel.toISODate(dayDate);
            const isActive = uiManager.filters.activeDates.includes(isoDate);

            const dayButton = document.createElement('button');
            dayButton.type = 'button';
            dayButton.className = [
                'inline-flex',
                'h-8',
                'items-center',
                'justify-center',
                'rounded-[8px]',
                'border',
                'text-[12px]',
                'transition-colors',
                'duration-150',
                isActive
                    ? 'border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] text-[var(--color-text-strong)]'
                    : 'border-[var(--color-border-soft)] bg-[var(--color-bg-base)] text-[var(--color-text)] hover:bg-[var(--color-bg-hover)]'
            ].join(' ');
            dayButton.textContent = String(day);
            dayButton.addEventListener('click', (event) => handlers.onDayClick(isoDate, event));

            calendarGrid.appendChild(dayButton);
        }
    }
};
