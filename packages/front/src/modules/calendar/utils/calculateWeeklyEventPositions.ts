import {
  ICalendarDay,
  ICalendarEntry,
  IEventPosition,
} from "../components/CCalendarMonthView";

export function calculateWeeklyEventPositions(
  calendarGrid: ICalendarDay[],
  entries: ICalendarEntry[],
): IEventPosition[][] {
  const weeks: IEventPosition[][] = [];
  const weeksCount = Math.ceil(calendarGrid.length / 7);

  for (let weekIndex = 0; weekIndex < weeksCount; weekIndex++) {
    const weekStart = weekIndex * 7;
    const weekEnd = Math.min(weekStart + 7, calendarGrid.length);
    const weekDays = calendarGrid.slice(weekStart, weekEnd);
    const weekPositions: IEventPosition[] = [];
    const rowOccupancy: boolean[][] = [];

    entries.forEach((entry) => {
      const startDate = new Date(entry.datetime);
      const endDate = entry.datetimeEnd
        ? new Date(entry.datetimeEnd)
        : startDate;

      let eventStartCol = -1;
      let eventEndCol = -1;

      weekDays.forEach((day, colIndex) => {
        const dayStart = new Date(day.date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(day.date);
        dayEnd.setHours(23, 59, 59, 999);

        if (startDate <= dayEnd && endDate >= dayStart) {
          if (eventStartCol === -1) {
            eventStartCol = colIndex;
          }
          eventEndCol = colIndex;
        }
      });

      if (eventStartCol !== -1) {
        let row = 0;
        while (true) {
          if (!rowOccupancy[row]) {
            rowOccupancy[row] = new Array(7).fill(false);
          }

          let canPlace = true;
          for (let col = eventStartCol; col <= eventEndCol; col++) {
            if (rowOccupancy[row][col]) {
              canPlace = false;
              break;
            }
          }

          if (canPlace) {
            for (let col = eventStartCol; col <= eventEndCol; col++) {
              rowOccupancy[row][col] = true;
            }

            weekPositions.push({
              event: entry,
              row,
              startCol: eventStartCol,
              span: eventEndCol - eventStartCol + 1,
            });
            break;
          }

          row++;
        }
      }
    });

    weeks.push(weekPositions);
  }

  return weeks;
}
