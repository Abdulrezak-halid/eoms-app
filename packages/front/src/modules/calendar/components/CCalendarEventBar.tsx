import { useCallback, useMemo } from "react";

import { classNames } from "@m/core/utils/classNames";

import { ICalendarEntry, IEventPosition } from "./CCalendarMonthView";

interface ICalendarEventBarProps {
  eventPosition: IEventPosition;
  onClick: (event: ICalendarEntry) => void;
}

export function CCalendarEventBar({
  eventPosition,
  onClick,
}: ICalendarEventBarProps) {
  const handleClick = useCallback(() => {
    onClick(eventPosition.event);
  }, [onClick, eventPosition.event]);

  const timeStr = useMemo(() => {
    const eventStart = new Date(eventPosition.event.datetime);
    return eventStart.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [eventPosition.event.datetime]);

  return (
    <button
      type="button"
      className={classNames(
        "absolute h-5 text-xs px-1 rounded",
        "bg-accent-600 text-white hover:bg-accent-700",
        "transition-colors cursor-pointer",
        "flex items-center gap-1",
        "pointer-events-auto",
      )}
      style={{
        top: `${eventPosition.row * 24 + 4}px`,
        left: `calc(${(eventPosition.startCol * 100) / 7}% + 2px)`,
        width: `calc(${(eventPosition.span * 100) / 7}% - 4px)`,
      }}
      onClick={handleClick}
      title={`${eventPosition.event.name} - ${timeStr}`}
    >
      <span className="flex-shrink-0 text-[10px] font-medium">{timeStr}</span>
      <span className="truncate">{eventPosition.event.name}</span>
    </button>
  );
}
