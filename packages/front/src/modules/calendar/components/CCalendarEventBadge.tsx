import { useCallback, useMemo } from "react";

import { classNames } from "@m/core/utils/classNames";

import { ICalendarEntry } from "./CCalendarMonthView";

interface ICalendarEventBadgeProps {
  event: ICalendarEntry;
  isStart: boolean;
  isEnd: boolean;
  onClick: (event: ICalendarEntry) => void;
}

export function CCalendarEventBadge({
  event,
  isStart,
  isEnd,
  onClick,
}: ICalendarEventBadgeProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClick(event);
    },
    [onClick, event],
  );

  const timeStr = useMemo(() => {
    const eventStart = new Date(event.datetime);
    return eventStart.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [event.datetime]);

  return (
    <button
      type="button"
      className={classNames(
        "w-full text-left text-xs px-2 py-1",
        "bg-accent-600 text-white hover:bg-accent-700",
        "transition-colors",
        isStart ? "rounded-l" : "rounded-l-none",
        isEnd ? "rounded-r" : "rounded-r-none",
      )}
      onClick={handleClick}
      title={`${event.name} - ${timeStr}`}
    >
      <div className="truncate">
        {isStart && <span className="font-medium">{timeStr}</span>} {event.name}
      </div>
    </button>
  );
}
