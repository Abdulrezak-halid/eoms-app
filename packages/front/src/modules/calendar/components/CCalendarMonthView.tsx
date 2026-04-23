import { useCallback, useMemo, useState } from "react";

import { useDayNames, useMonthNames } from "../hooks/useCalendarTranslations";
import { calculateWeeklyEventPositions } from "../utils/calculateWeeklyEventPositions";
import { CCalendarEventCreateModal } from "./CCalendarEventCreateModal";
import { CCalendarEventEditModal } from "./CCalendarEventEditModal";
import { CCalendarHeader } from "./CCalendarHeader";
import { CCalendarWeek } from "./CCalendarWeek";
import { CCard } from "../../core/components/CCard";

interface ICalendarMonthViewProps {
  entries: ICalendarEntry[];
  onUpdateEntry?: (entry: ICalendarEntry) => void;
  onDeleteEntry?: (id: string) => void;
  onCreateEntry?: (entry: Omit<ICalendarEntry, "id">) => void;
}

export interface ICalendarEntry {
  id: string;
  name: string;
  datetime: string;
  datetimeEnd?: string;
}

export interface ICalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: ICalendarEntry[];
}

export interface IEventPosition {
  event: ICalendarEntry;
  row: number;
  startCol: number;
  span: number;
}

export function CCalendarMonthView({
  entries,
  onUpdateEntry,
  onDeleteEntry,
  onCreateEntry,
}: ICalendarMonthViewProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [editingEntry, setEditingEntry] = useState<ICalendarEntry | null>(null);
  const [creatingEntry, setCreatingEntry] = useState<{ date: Date } | null>(
    null,
  );
  const monthNames = useMonthNames();
  const dayHeaders = useDayNames();

  const calendarGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const today = new Date();

    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: ICalendarDay[] = [];
    const currentIterDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const date = new Date(currentIterDate);
      const isCurrentMonth = date.getMonth() === month;
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      days.push({
        date,
        isCurrentMonth,
        isToday,
        events: [],
      });

      currentIterDate.setDate(currentIterDate.getDate() + 1);
    }

    if (days[35].date.getMonth() !== month) {
      days.splice(35, 7);
    }

    return days;
  }, [currentDate]);

  const weeklyEventPositions = useMemo(
    () => calculateWeeklyEventPositions(calendarGrid, entries),
    [calendarGrid, entries],
  );

  const handlePrevMonth = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  }, []);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const handleEventClick = useCallback((event: ICalendarEntry) => {
    setEditingEntry(event);
  }, []);

  const handleDayClick = useCallback((date: Date) => {
    setCreatingEntry({ date });
  }, []);

  const handleCloseModal = useCallback(() => {
    setEditingEntry(null);
    setCreatingEntry(null);
  }, []);

  const handleDateChange = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  return (
    <>
      <CCard className="h-full flex flex-col overflow-hidden">
        <CCalendarHeader
          currentDate={currentDate}
          monthNames={monthNames}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
          onDateChange={handleDateChange}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            {dayHeaders.map((day: string, index: number) => (
              <div
                key={index}
                className="flex-1 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="flex-1 flex flex-col">
            {Array.from({ length: Math.ceil(calendarGrid.length / 7) }).map(
              (_, weekIndex) => {
                const weekStart = weekIndex * 7;
                const weekEnd = Math.min(weekStart + 7, calendarGrid.length);
                const weekDays = calendarGrid.slice(weekStart, weekEnd);
                const weekEvents = weeklyEventPositions[weekIndex] || [];
                const weeksCount = Math.ceil(calendarGrid.length / 7);

                return (
                  <CCalendarWeek
                    key={weekIndex}
                    weekDays={weekDays}
                    weekEvents={weekEvents}
                    weekIndex={weekIndex}
                    onDayClick={handleDayClick}
                    onEventClick={handleEventClick}
                    isLastWeek={weekIndex === weeksCount - 1}
                  />
                );
              },
            )}
          </div>
        </div>
      </CCard>

      {editingEntry && (
        <CCalendarEventEditModal
          entry={editingEntry}
          onClose={handleCloseModal}
          onUpdate={onUpdateEntry}
          onDelete={onDeleteEntry}
        />
      )}

      {creatingEntry && (
        <CCalendarEventCreateModal
          initialDate={creatingEntry.date}
          onClose={handleCloseModal}
          onCreate={onCreateEntry}
        />
      )}
    </>
  );
}
