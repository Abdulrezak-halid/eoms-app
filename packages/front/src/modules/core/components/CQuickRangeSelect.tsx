import { UtilDate } from "common";
import { ArrowRight, Calendar } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import {
  IDateQuickRange,
  useQuickDateRanges,
} from "@m/base/hooks/useQuickDateRanges";
import {
  IDatetimeQuickRange,
  useQuickTimeRanges,
} from "@m/base/hooks/useQuickTimeRanges";
import { usePopupState } from "@m/core/hooks/usePopupState";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CButton } from "./CButton";
import { CIcon } from "./CIcon";
import { CInputDate } from "./CInputDate";
import { CInputDatetime } from "./CInputDatetime";
import { CInputPopup } from "./CInputPopup";
import { CLine } from "./CLine";
import { CMutedText } from "./CMutedText";
import { CPopupPanel } from "./CPopupPanel";
import { CSelectList } from "./CSelectList";

export interface ICQuickRangeValue {
  quickRange?: IDatetimeQuickRange;
  customMin?: string;
  customMax?: string;
}

export interface ICQuickDateRangeValue {
  quickRange?: IDateQuickRange;
  customMin?: string;
  customMax?: string;
}

function hasQuickRangeValue(value?: ICQuickRangeValue | ICQuickDateRangeValue) {
  return Boolean(value?.quickRange || (value?.customMin && value?.customMax));
}

type ICQuickRangeBaseProps = {
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
};

type ICQuickRangeSelectProps =
  | (ICQuickRangeBaseProps & {
      mode?: "datetime";
      value?: ICQuickRangeValue;
      onChange?: (value: ICQuickRangeValue) => void;
    })
  | (ICQuickRangeBaseProps & {
      mode: "dateOnly";
      value?: ICQuickDateRangeValue;
      onChange?: (value: ICQuickDateRangeValue) => void;
    });

function CQuickRangeSelectDatetimePopup({
  value,
  onChange,
  onClose,
}: {
  value?: ICQuickRangeValue;
  onChange?: (value: ICQuickRangeValue) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const ranges = useQuickTimeRanges();

  const [minDate, setMinDate] = useState(
    value?.quickRange ? undefined : value?.customMin,
  );
  const [maxDate, setMaxDate] = useState(
    value?.quickRange ? undefined : value?.customMax,
  );

  const isApplyDisabled = useMemo(
    () =>
      Boolean(!minDate || !maxDate || new Date(minDate) > new Date(maxDate)),
    [minDate, maxDate],
  );

  const handleQuickRangeSelect = useCallback(
    (quickRange: IDatetimeQuickRange) => {
      onChange?.({ quickRange });
      onClose();
    },
    [onChange, onClose],
  );

  const handleApply = useCallback(() => {
    if (!minDate || !maxDate) {
      return;
    }
    onChange?.({ customMin: minDate, customMax: maxDate });
    onClose();
  }, [minDate, maxDate, onChange, onClose]);

  return (
    <CPopupPanel className="flex flex-col">
      <div className="flex flex-col @sm:flex-row h-full @sm:h-80">
        <div className="p-3 flex-none flex flex-col space-y-4 w-56">
          <div>
            <CMutedText className="block mb-1">{t("from")}</CMutedText>
            <CInputDatetime
              value={minDate}
              placeholder={t("startDate")}
              max={maxDate}
              onChange={setMinDate}
              noClearButton
            />
          </div>

          <div>
            <CMutedText className="block mb-1">{t("to")}</CMutedText>
            <CInputDatetime
              value={maxDate}
              placeholder={t("endDate")}
              min={minDate}
              onChange={setMaxDate}
              noClearButton
            />
          </div>

          <div className="flex justify-end">
            <CButton
              label={t("applyTimeRange")}
              onClick={handleApply}
              disabled={isApplyDisabled}
              className="w-full"
            />
          </div>
        </div>

        <div className="border-t @sm:border-t-0 @sm:border-l border-gray-200 dark:border-gray-700 grow flex min-h-0">
          <CSelectList
            list={ranges}
            value={value?.quickRange}
            onChange={handleQuickRangeSelect}
            className="rounded-b-md"
            inline
          />
        </div>
      </div>
    </CPopupPanel>
  );
}

function CQuickRangeSelectDateOnlyPopup({
  value,
  onChange,
  onClose,
}: {
  value?: ICQuickDateRangeValue;
  onChange?: (value: ICQuickDateRangeValue) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const ranges = useQuickDateRanges();

  const [minDate, setMinDate] = useState(
    value?.quickRange ? undefined : value?.customMin,
  );
  const [maxDate, setMaxDate] = useState(
    value?.quickRange ? undefined : value?.customMax,
  );

  const isApplyDisabled = useMemo(
    () =>
      Boolean(!minDate || !maxDate || new Date(minDate) > new Date(maxDate)),
    [minDate, maxDate],
  );

  const handleQuickRangeSelect = useCallback(
    (quickRange: IDateQuickRange) => {
      onChange?.({ quickRange });
      onClose();
    },
    [onChange, onClose],
  );

  const handleApply = useCallback(() => {
    if (!minDate || !maxDate) {
      return;
    }
    onChange?.({ customMin: minDate, customMax: maxDate });
    onClose();
  }, [minDate, maxDate, onChange, onClose]);

  return (
    <CPopupPanel className="flex flex-col">
      <div className="flex flex-col @sm:flex-row h-full @sm:h-80">
        <div className="p-3 flex-none flex flex-col space-y-4 w-56">
          <div>
            <CMutedText className="block mb-1">{t("from")}</CMutedText>
            <CInputDate
              value={minDate}
              placeholder={t("startDate")}
              max={maxDate}
              onChange={setMinDate}
            />
          </div>

          <div>
            <CMutedText className="block mb-1">{t("to")}</CMutedText>
            <CInputDate
              value={maxDate}
              placeholder={t("endDate")}
              min={minDate}
              onChange={setMaxDate}
            />
          </div>

          <div className="flex justify-end">
            <CButton
              label={t("applyTimeRange")}
              onClick={handleApply}
              disabled={isApplyDisabled}
              className="w-full"
            />
          </div>
        </div>

        <div className="border-t @sm:border-t-0 @sm:border-l border-gray-200 dark:border-gray-700 grow flex min-h-0">
          <CSelectList
            list={ranges}
            value={value?.quickRange}
            onChange={handleQuickRangeSelect}
            className="rounded-b-md"
            inline
          />
        </div>
      </div>
    </CPopupPanel>
  );
}

function CQuickRangeSelectDatetime({
  value,
  onChange,
  placeholder,
  required,
  invalid,
}: {
  value?: ICQuickRangeValue;
  onChange?: (value: ICQuickRangeValue) => void;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
}) {
  const { t } = useTranslation();
  const popupState = usePopupState();
  const ranges = useQuickTimeRanges();

  const handleClose = useCallback(() => {
    popupState.setIsOpen(false);
  }, [popupState]);

  const selectedRangeItem = useMemo(
    () => ranges.find((r) => r.value === value?.quickRange),
    [ranges, value?.quickRange],
  );

  const displayValue = useMemo(() => {
    if (selectedRangeItem) {
      return { type: "quick" as const, label: selectedRangeItem.label };
    }
    if (value?.customMin && value?.customMax) {
      return {
        type: "dates" as const,
        min: UtilDate.formatUtcIsoToLocalDatetime(value.customMin),
        max: UtilDate.formatUtcIsoToLocalDatetime(value.customMax),
      };
    }
    return null;
  }, [selectedRangeItem, value?.customMin, value?.customMax]);

  const placeholderValue = placeholder || t("selectDateRange");
  const isInvalid = Boolean(
    invalid || (required && !hasQuickRangeValue(value)),
  );

  const popupComponent = useCallback(
    () => (
      <CQuickRangeSelectDatetimePopup
        value={value}
        onChange={onChange}
        onClose={handleClose}
      />
    ),
    [value, onChange, handleClose],
  );

  return (
    <CInputPopup
      state={popupState}
      caretIcon={Calendar}
      popupComponent={popupComponent}
      popupFixedSize
      placeholder={placeholderValue}
      invalid={isInvalid}
      classNameChildrenContainer="pl-1"
    >
      {displayValue ? (
        <CLine className="gap-2">
          {displayValue.type === "quick" && (
            <span className="truncate">{displayValue.label}</span>
          )}
          {displayValue.type === "dates" && (
            <>
              <span className="truncate">{displayValue.min}</span>
              <CIcon
                className="flex-none text-gray-600 dark:text-gray-300"
                value={ArrowRight}
              />
              <span className="truncate">{displayValue.max}</span>
            </>
          )}
        </CLine>
      ) : null}
    </CInputPopup>
  );
}

function CQuickRangeSelectDateOnly({
  value,
  onChange,
  placeholder,
  required,
  invalid,
}: {
  value?: ICQuickDateRangeValue;
  onChange?: (value: ICQuickDateRangeValue) => void;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
}) {
  const { t } = useTranslation();
  const popupState = usePopupState();
  const ranges = useQuickDateRanges();

  const handleClose = useCallback(() => {
    popupState.setIsOpen(false);
  }, [popupState]);

  const selectedRangeItem = useMemo(
    () => ranges.find((r) => r.value === value?.quickRange),
    [ranges, value?.quickRange],
  );

  const displayValue = useMemo(() => {
    if (selectedRangeItem) {
      return { type: "quick" as const, label: selectedRangeItem.label };
    }
    if (value?.customMin && value?.customMax) {
      return {
        type: "dates" as const,
        min: UtilDate.formatLocalIsoDateToLocalDate(value.customMin),
        max: UtilDate.formatLocalIsoDateToLocalDate(value.customMax),
      };
    }
    return null;
  }, [selectedRangeItem, value?.customMin, value?.customMax]);

  const placeholderValue = placeholder || t("selectDateRange");
  const isInvalid = Boolean(
    invalid || (required && !hasQuickRangeValue(value)),
  );

  const popupComponent = useCallback(
    () => (
      <CQuickRangeSelectDateOnlyPopup
        value={value}
        onChange={onChange}
        onClose={handleClose}
      />
    ),
    [value, onChange, handleClose],
  );

  return (
    <CInputPopup
      state={popupState}
      caretIcon={Calendar}
      popupComponent={popupComponent}
      popupFixedSize
      placeholder={placeholderValue}
      invalid={isInvalid}
      classNameChildrenContainer="pl-1"
    >
      {displayValue ? (
        <CLine className="gap-2">
          {displayValue.type === "quick" && (
            <span className="truncate">{displayValue.label}</span>
          )}
          {displayValue.type === "dates" && (
            <>
              <span className="truncate">{displayValue.min}</span>
              <CIcon
                className="flex-none text-gray-600 dark:text-gray-300"
                value={ArrowRight}
              />
              <span className="truncate">{displayValue.max}</span>
            </>
          )}
        </CLine>
      ) : null}
    </CInputPopup>
  );
}

export function CQuickRangeSelect(props: ICQuickRangeSelectProps) {
  if (props.mode === "dateOnly") {
    return <CQuickRangeSelectDateOnly {...props} />;
  }

  return <CQuickRangeSelectDatetime {...props} />;
}
