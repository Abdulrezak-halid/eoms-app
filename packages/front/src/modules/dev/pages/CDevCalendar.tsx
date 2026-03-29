import { useCallback, useState } from "react";

import { CBody } from "@m/base/components/CBody";
import {
  CCalendarMonthView,
  ICalendarEntry,
} from "@m/calendar/components/CCalendarMonthView";

export function CDevCalendar() {
  const [entries, setEntries] = useState<ICalendarEntry[]>([
    { id: "1", name: "Project Meeting", datetime: "2025-07-09T10:00:00" },
    { id: "2", name: "Team Sync", datetime: "2025-07-09T15:00:00" },
    {
      id: "3",
      name: "Tech Conference",
      datetime: "2025-07-15T08:00:00",
      datetimeEnd: "2025-07-17T18:00:00",
    },
  ]);

  const handleCreateEntry = useCallback(
    (newEntry: Omit<ICalendarEntry, "id">) => {
      const id = Date.now().toString();
      setEntries((prev) => [...prev, { ...newEntry, id }]);
    },
    [],
  );

  const handleUpdateEntry = useCallback((updatedEntry: ICalendarEntry) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry,
      ),
    );
  }, []);

  const handleDeleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  return (
    <CBody title="Dev - Calendar Month View">
      <div>Calendar - Month View</div>
      <div className="h-[700px]">
        <CCalendarMonthView
          entries={entries}
          onCreateEntry={handleCreateEntry}
          onUpdateEntry={handleUpdateEntry}
          onDeleteEntry={handleDeleteEntry}
        />
      </div>
    </CBody>
  );
}
