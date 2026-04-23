import { classNames } from "@m/core/utils/classNames";

import { CCalendarDay } from "./CCalendarDay";
import { CCalendarEventBar } from "./CCalendarEventBar";
import {
  ICalendarDay,
  ICalendarEntry,
  IEventPosition,
} from "./CCalendarMonthView";

interface ICalendarWeekProps {
  weekDays: ICalendarDay[];
  weekEvents: IEventPosition[];
  weekIndex: number;
  onDayClick: (date: Date) => void;
  onEventClick: (event: ICalendarEntry) => void;
  isLastWeek?: boolean;
}

export function CCalendarWeek({
  weekDays,
  weekEvents,
  weekIndex,
  onDayClick,
  onEventClick,
  isLastWeek,
}: ICalendarWeekProps) {
  return (
    <div
      className={classNames(
        "flex-1 relative flex",
        "border-b border-gray-200 dark:border-gray-700",
        isLastWeek && "border-b-0",
      )}
    >
      {weekDays.map((day, dayIndex) => (
        <CCalendarDay
          key={`${weekIndex}-${dayIndex}`}
          day={day}
          onDayClick={onDayClick}
        />
      ))}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ top: "28px", bottom: "4px" }}
      >
        {weekEvents.map((eventPos, index) => (
          <CCalendarEventBar
            key={`${eventPos.event.id}-${index}`}
            eventPosition={eventPos}
            onClick={onEventClick}
          />
        ))}
      </div>
    </div>
  );
}
