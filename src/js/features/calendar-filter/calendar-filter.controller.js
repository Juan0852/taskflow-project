import { TaskService } from '../../domain/tasks/task-service.js';
import { CalendarFilterView } from './calendar-filter.view.js';
import { CalendarFilterViewModel } from './calendar-filter.viewmodel.js';

export const CalendarFilterController = {
    calendarView: CalendarFilterViewModel.createCalendarView(),
    calendarSelectionAnchor: '',

    bindEvents() {
        if (this.elements.calendarClearButton) {
            this.elements.calendarClearButton.addEventListener('click', () => {
                this.handleCalendarClear();
            });
        }
    },

    handleCalendarClear() {
        this.clearActiveDates();
        this.renderCalendarGrid();
        this.renderTaskList(TaskService.getAll());
    },

    handleCalendarDayClick(isoDate, event) {
        event.preventDefault();
        this.applyCalendarDateSelection(isoDate, event);
        this.renderCalendarGrid();
        this.renderTaskList(TaskService.getAll());
    },

    setActiveDates(dateValues = []) {
        CalendarFilterViewModel.setActiveDates(this, dateValues);
    },

    clearActiveDates() {
        CalendarFilterViewModel.clearActiveDates(this);
    },

    applyCalendarDateSelection(isoDate, event) {
        CalendarFilterViewModel.applyCalendarDateSelection(this, isoDate, event);
    },

    renderCalendarGrid() {
        CalendarFilterView.renderCalendarGrid(this, {
            onDayClick: (isoDate, event) => this.handleCalendarDayClick(isoDate, event)
        });
    }
};
