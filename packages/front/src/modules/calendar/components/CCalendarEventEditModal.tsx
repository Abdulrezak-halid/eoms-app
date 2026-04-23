import { UtilDate } from "common";
import { useCallback, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";

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

interface ICalendarEventEditModalProps {
  entry: ICalendarEntry;
  onClose: () => void;
  onUpdate?: (entry: ICalendarEntry) => void;
  onDelete?: (id: string) => void;
}

export function CCalendarEventEditModal({
  entry,
  onClose,
  onUpdate,
  onDelete,
}: ICalendarEventEditModalProps) {
  const [editedEntry, setEditedEntry] = useState<ICalendarEntry>({ ...entry });
  const [isMultiDay, setIsMultiDay] = useState(!!entry.datetimeEnd);
  const { t } = useTranslation();

  const datetimeStart = useMemo(() => {
    const dt = new Date(editedEntry.datetime);
    return {
      date: UtilDate.objToLocalIsoDate(dt),
      time: dt.toTimeString().slice(0, 5),
    };
  }, [editedEntry.datetime]);

  const datetimeEnd = useMemo(() => {
    if (!editedEntry.datetimeEnd) {
      return null;
    }
    const dt = new Date(editedEntry.datetimeEnd);
    return {
      date: UtilDate.objToLocalIsoDate(dt),
      time: dt.toTimeString().slice(0, 5),
    };
  }, [editedEntry.datetimeEnd]);

  const handleNameChange = useCallback((value: string) => {
    setEditedEntry((prev) => ({ ...prev, name: value }));
  }, []);

  const handleStartDateChange = useCallback(
    (value: string | undefined) => {
      if (!value) {
        return;
      }
      const [year, month, day] = value.split("-").map(Number);
      const dt = new Date(editedEntry.datetime);
      dt.setFullYear(year, month - 1, day);
      setEditedEntry((prev) => ({ ...prev, datetime: dt.toISOString() }));
    },
    [editedEntry.datetime],
  );

  const handleStartTimeChange = useCallback(
    (value: string) => {
      const [hours, minutes] = value.split(":").map(Number);
      const dt = new Date(editedEntry.datetime);
      dt.setHours(hours, minutes);
      setEditedEntry((prev) => ({ ...prev, datetime: dt.toISOString() }));
    },
    [editedEntry.datetime],
  );

  const handleEndDateChange = useCallback(
    (value: string | undefined) => {
      if (!value) {
        return;
      }
      const [year, month, day] = value.split("-").map(Number);
      const dt = new Date(editedEntry.datetimeEnd || editedEntry.datetime);
      dt.setFullYear(year, month - 1, day);
      setEditedEntry((prev) => ({ ...prev, datetimeEnd: dt.toISOString() }));
    },
    [editedEntry.datetime, editedEntry.datetimeEnd],
  );

  const handleEndTimeChange = useCallback(
    (value: string) => {
      const [hours, minutes] = value.split(":").map(Number);
      const dt = new Date(editedEntry.datetimeEnd || editedEntry.datetime);
      dt.setHours(hours, minutes);
      setEditedEntry((prev) => ({ ...prev, datetimeEnd: dt.toISOString() }));
    },
    [editedEntry.datetime, editedEntry.datetimeEnd],
  );

  const handleMultiDayToggle = useCallback((checked: boolean) => {
    setIsMultiDay(checked);
    if (!checked) {
      setEditedEntry((prev) => ({ ...prev, datetimeEnd: undefined }));
    } else {
      setEditedEntry((prev) => ({ ...prev, datetimeEnd: prev.datetime }));
    }
  }, []);

  const handleSave = useCallback(() => {
    onUpdate?.(editedEntry);
    onClose();
  }, [editedEntry, onUpdate, onClose]);

  const handleDelete = useCallback(() => {
    onDelete?.(entry.id);
    onClose();
  }, [entry.id, onDelete, onClose]);

  return (
    <CModal onClickBg={onClose}>
      <div className="space-y-4 min-w-[400px]">
        <h2 className="text-lg font-semibold">{t("editEvent")}</h2>
        <CMutedText> {t("eventName")}</CMutedText>
        <CInputString
          value={editedEntry.name}
          onChange={handleNameChange}
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

        <CLine className="justify-between pt-4">
          <CButton
            icon={Trash2}
            label={t("_delete")}
            onClick={handleDelete}
          />

          <CLine className="space-x-2">
            <CButton label={t("cancel")} onClick={onClose} tertiary />
            <CButton label={t("save")} onClick={handleSave} primary />
          </CLine>
        </CLine>
      </div>
    </CModal>
  );
}
