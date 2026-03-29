import { UtilDate } from "common";
import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
} from "lucide-react";

import { CButton } from "@m/core/components/CButton";
import { CButtonPopup } from "@m/core/components/CButtonPopup";
import { CLine } from "@m/core/components/CLine";
import { CSelectDate } from "@m/core/components/CSelectDate";
import { usePopupState } from "@m/core/hooks/usePopupState";

interface ICalendarHeaderProps {
  currentDate: Date;
  monthNames: string[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onDateChange: (date: Date) => void;
}

export function CCalendarHeader({
  currentDate,
  monthNames,
  onPrevMonth,
  onNextMonth,
  onToday,
  onDateChange,
}: ICalendarHeaderProps) {
  const { t } = useTranslation();
  const popupState = usePopupState();

  const currentDateString = useMemo(
    () => UtilDate.objToLocalIsoDate(currentDate),
    [currentDate],
  );

  const handleDateSelect = useCallback(
    (dateString: string | undefined) => {
      if (dateString) {
        const newDate = UtilDate.localIsoDateToObj(dateString);
        onDateChange(newDate);
      }
      popupState.setIsOpen(false);
    },
    [onDateChange, popupState],
  );

  const datePickerPopup = useCallback(
    () => (
      <CSelectDate
        value={currentDateString}
        onChange={handleDateSelect}
        noClear
      />
    ),
    [currentDateString, handleDateSelect],
  );

  const displayText = useMemo(
    () => `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
    [monthNames, currentDate],
  );

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <CLine className="space-x-4">
        <CButton label={t("today")} onClick={onToday} tertiary />

        <CLine className="space-x-1">
          <CButton icon={ArrowLeft} onClick={onPrevMonth} tertiary />
          <CButton icon={ArrowRight} onClick={onNextMonth} tertiary />
        </CLine>

        <CButtonPopup
          icon={Calendar}
          label={displayText}
          popupComponent={datePickerPopup}
          popupState={popupState}
          tertiary
        />
      </CLine>
    </div>
  );
}
