import { useCallback } from "react";

import { classNames } from "@m/core/utils/classNames";

import { ICalendarDay } from "./CCalendarMonthView";

interface ICalendarDayProps {
  day: ICalendarDay;
  onDayClick: (date: Date) => void;
}

export function CCalendarDay({ day, onDayClick }: ICalendarDayProps) {
  const handleClick = useCallback(() => {
    onDayClick(day.date);
  }, [onDayClick, day.date]);

  return (
    <div
      className={classNames(
        "flex-1 h-full border-r border-gray-200 dark:border-gray-700 last:border-r-0",
        "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50",
        !day.isCurrentMonth && "bg-gray-50/50 dark:bg-gray-800/30",
        "p-2",
      )}
      onClick={handleClick}
    >
      <div
        className={classNames(
          "text-sm",
          day.isToday &&
            "w-7 h-7 rounded-full bg-accent-600 text-white flex items-center justify-center",
          !day.isCurrentMonth && "text-gray-400 dark:text-gray-600",
        )}
      >
        {day.date.getDate()}
      </div>
    </div>
  );
}
