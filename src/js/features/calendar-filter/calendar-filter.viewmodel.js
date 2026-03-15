export const CalendarFilterViewModel = {
    createCalendarView() {
        const now = new Date();
        return {
            year: now.getFullYear(),
            month: now.getMonth()
        };
    },

    setActiveDates(uiManager, dateValues = []) {
        const uniqueDates = [...new Set(
            dateValues.filter(dateValue => typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue))
        )].sort();

        uiManager.filters.activeDates = uniqueDates;
        uiManager.calendarSelectionAnchor = uniqueDates.at(-1) || '';
    },

    clearActiveDates(uiManager) {
        uiManager.filters.activeDates = [];
        uiManager.calendarSelectionAnchor = '';
    },

    applyCalendarDateSelection(uiManager, isoDate, event) {
        const wantsRangeSelection = event.ctrlKey || event.metaKey;
        if (!wantsRangeSelection) {
            const isSameSingleDate = uiManager.filters.activeDates.length === 1 && uiManager.filters.activeDates[0] === isoDate;
            if (isSameSingleDate) {
                this.clearActiveDates(uiManager);
                return;
            }

            this.setActiveDates(uiManager, [isoDate]);
            return;
        }

        const rangeStart = uiManager.calendarSelectionAnchor || uiManager.filters.activeDates[0] || isoDate;
        this.setActiveDates(uiManager, this.buildDateRange(rangeStart, isoDate));
    },

    buildDateRange(startIsoDate, endIsoDate) {
        const start = new Date(`${startIsoDate}T00:00:00`);
        const end = new Date(`${endIsoDate}T00:00:00`);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [endIsoDate];

        const [from, to] = start <= end ? [start, end] : [end, start];
        const dates = [];
        const cursor = new Date(from);

        while (cursor <= to) {
            dates.push(this.toISODate(cursor));
            cursor.setDate(cursor.getDate() + 1);
        }

        return dates;
    },

    toISODate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
};
