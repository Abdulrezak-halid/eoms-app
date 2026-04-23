import { UtilDate } from "common";
import { useCallback, useMemo, useState } from "react";

import { CButton } from "@m/core/components/CButton";
import { CCheckbox } from "@m/core/components/CCheckbox";
import { CInputDate } from "@m/core/components/CInputDate";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTime } from "@m/core/components/CInputTime";
import { CLine } from "@m/core/components/CLine";
import { CModal } from "@m/core/components/CModal";
import { CMutedText } from "@m/core/components/CMutedText";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { ICalendarEntry } from "./CCalendarMonthView";

interface ICalendarEventCreateModalProps {
  initialDate: Date;
  onClose: () => void;
  onCreate?: (entry: ICalendarEntry) => void;
}

export function CCalendarEventCreateModal({
  initialDate,
  onClose,
  onCreate,
}: ICalendarEventCreateModalProps) {
  const [newEntry, setNewEntry] = useState<ICalendarEntry>({
    id: "",
    name: "",
    datetime: initialDate.toISOString(),
  });
  const [isMultiDay, setIsMultiDay] = useState(false);
  const { t } = useTranslation();

  const datetimeStart = useMemo(() => {
    const dt = new Date(newEntry.datetime);
    return {
      date: UtilDate.objToLocalIsoDate(dt),
      time: dt.toTimeString().slice(0, 5),
    };
  }, [newEntry.datetime]);

  const datetimeEnd = useMemo(() => {
    if (!newEntry.datetimeEnd) {
      return null;
    }
    const dt = new Date(newEntry.datetimeEnd);
    return {
      date: UtilDate.objToLocalIsoDate(dt),
      time: dt.toTimeString().slice(0, 5),
    };
  }, [newEntry.datetimeEnd]);

  const handleNameChange = useCallback((value: string) => {
    setNewEntry((prev) => ({ ...prev, name: value }));
  }, []);

  const handleStartDateChange = useCallback(
    (value: string | undefined) => {
      if (!value) {
        return;
      }
      const [year, month, day] = value.split("-").map(Number);
      const dt = new Date(newEntry.datetime);
      dt.setFullYear(year, month - 1, day);
      setNewEntry((prev) => ({ ...prev, datetime: dt.toISOString() }));
    },
    [newEntry.datetime],
  );

  const handleStartTimeChange = useCallback(
    (value: string) => {
      const [hours, minutes] = value.split(":").map(Number);
      const dt = new Date(newEntry.datetime);
      dt.setHours(hours, minutes);
      setNewEntry((prev) => ({ ...prev, datetime: dt.toISOString() }));
    },
    [newEntry.datetime],
  );

  const handleEndDateChange = useCallback(
    (value: string | undefined) => {
      if (!value) {
        return;
      }
      const [year, month, day] = value.split("-").map(Number);
      const dt = new Date(newEntry.datetimeEnd || newEntry.datetime);
      dt.setFullYear(year, month - 1, day);
      setNewEntry((prev) => ({ ...prev, datetimeEnd: dt.toISOString() }));
    },
    [newEntry.datetime, newEntry.datetimeEnd],
  );

  const handleEndTimeChange = useCallback(
    (value: string) => {
      const [hours, minutes] = value.split(":").map(Number);
      const dt = new Date(newEntry.datetimeEnd || newEntry.datetime);
      dt.setHours(hours, minutes);
      setNewEntry((prev) => ({ ...prev, datetimeEnd: dt.toISOString() }));
    },
    [newEntry.datetime, newEntry.datetimeEnd],
  );

  const handleMultiDayToggle = useCallback((checked: boolean) => {
    setIsMultiDay(checked);
    if (!checked) {
      setNewEntry((prev) => ({ ...prev, datetimeEnd: undefined }));
    } else {
      setNewEntry((prev) => ({ ...prev, datetimeEnd: prev.datetime }));
    }
  }, []);

  const handleCreate = useCallback(() => {
    if (newEntry.name.trim()) {
      onCreate?.(newEntry);
      onClose();
    }
  }, [newEntry, onCreate, onClose]);

  return (
    <CModal onClickBg={onClose}>
      <div className="space-y-4 min-w-[400px]">
        <h2 className="text-lg font-semibold">{t("newEvent")}</h2>

        <CInputString
          value={newEntry.name}
          onChange={handleNameChange}
          placeholder={t("title")}
          required
        />

        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <CMutedText> {t("startDate")}</CMutedText>
              <CInputDate
                value={datetimeStart.date}
                onChange={handleStartDateChange}
                required
              />
            </div>
            <div className="flex-1">
              <CMutedText> {t("startTime")}</CMutedText>
              <CInputTime
                value={datetimeStart.time}
                onChange={handleStartTimeChange}
                required
              />
            </div>
          </div>

          <CCheckbox
            label={t("multiDayEvent")}
            selected={isMultiDay}
            onChange={handleMultiDayToggle}
          />

          {isMultiDay && datetimeEnd && (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <CMutedText> {t("endDate")}</CMutedText>
                <CInputDate
                  value={datetimeEnd.date}
                  onChange={handleEndDateChange}
                  min={datetimeStart.date}
                  required
                />
              </div>
              <div className="flex-1">
                <CMutedText> {t("endTime")}</CMutedText>
                <CInputTime
                  value={datetimeEnd.time}
                  onChange={handleEndTimeChange}
                  required
                />
              </div>
            </div>
          )}
        </div>

        <CLine className="justify-end space-x-2 pt-4">
          <CButton label={t("cancel")} onClick={onClose} tertiary />
          <CButton
            label={t("create")}
            onClick={handleCreate}
            primary
            disabled={!newEntry.name.trim()}
          />
        </CLine>
      </div>
    </CModal>
  );
}
