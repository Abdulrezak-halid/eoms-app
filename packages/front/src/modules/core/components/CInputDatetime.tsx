/**
 * @file: CInputDatetime.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 30.03.2025
 * Last Modified Date: 30.03.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { UtilDate } from "common";
import { CalendarDays, Paintbrush } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";

import { useTranslation } from "@m/core/hooks/useTranslation";

import { useDatetimeParts } from "../hooks/useDatetimeParts";
import { useInputDateInvalidMsg } from "../hooks/useInputDateInvalidMsg";
import { useInputTimeInvalidMsg } from "../hooks/useInputTimeInvalidMsg";
import { usePopupState } from "../hooks/usePopupState";
import { IconType } from "./CIcon";
import { CInputInnerButton } from "./CInputInnerButton";
import { CInputPopup } from "./CInputPopup";
import { CSelectDatetime, ISelectDatetimeSection } from "./CSelectDatetime";

export function CInputDatetime({
  value,
  placeholder,
  onChange,
  onInvalidMsg,
  disabled,
  invalid,
  required,
  min,
  max,
  icon,
  noClearButton,
}: {
  value?: string;
  onChange?: (
    value: string | undefined,
    section: ISelectDatetimeSection,
  ) => void;
  onInvalidMsg?: (msg: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  min?: string;
  max?: string;
  icon?: IconType;
  placeholder?: string;
  noClearButton?: boolean;
}) {
  const { t } = useTranslation();

  const inputPopupState = usePopupState();

  const handleChange = useCallback(
    (v: string | undefined, section: ISelectDatetimeSection) => {
      onChange?.(v, section);
      // Keep popup open while selecting time, but close when select date
      if (section !== "TIME") {
        const setIsOpen = inputPopupState.setIsOpen;
        setIsOpen(false);
      }
    },
    [inputPopupState.setIsOpen, onChange],
  );

  const [valueDate, valueTime] = useDatetimeParts(value);
  const [valueDateMin, valueTimeMin] = useDatetimeParts(min);
  const [valueDateMax, valueTimeMax] = useDatetimeParts(max);

  const invalidMsgDate = useInputDateInvalidMsg(
    valueDate,
    disabled,
    required,
    valueDateMin,
    valueDateMax,
  );

  const invalidMsgTime = useInputTimeInvalidMsg(
    valueTime,
    disabled,
    required,
    valueDate === valueDateMin ? valueTimeMin : undefined,
    valueDate === valueDateMax ? valueTimeMax : undefined,
  );

  useEffect(() => {
    onInvalidMsg?.(invalidMsgDate || invalidMsgTime);
  }, [invalidMsgDate, invalidMsgTime, onInvalidMsg]);

  const invalidFinal = Boolean(invalid || invalidMsgDate || invalidMsgTime);

  const popupComponent = useCallback(
    () => (
      <CSelectDatetime
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
      />
    ),
    [value, min, max, handleChange],
  );

  const formattedValue = useMemo(
    () => (value ? UtilDate.formatUtcIsoToLocalDatetime(value) : undefined),
    [value],
  );

  const handleClear = useCallback(() => {
    onChange?.(undefined, "BOTH");
  }, [onChange]);

  return (
    <CInputPopup
      state={inputPopupState}
      caretIcon={CalendarDays}
      popupComponent={popupComponent}
      popupFixedSize
      icon={icon}
      disabled={disabled}
      placeholder={placeholder || t("datetime")}
      invalid={invalidFinal}
      classNameChildrenContainer="grow flex"
    >
      {formattedValue && (
        <>
          <div className="grow truncate">{formattedValue}</div>

          {!required && !disabled && !noClearButton && (
            <CInputInnerButton
              ariaLabel={t("clear")}
              icon={Paintbrush}
              onClick={handleClear}
              className="-my-3 -mr-2"
            />
          )}
        </>
      )}
    </CInputPopup>
  );
}
