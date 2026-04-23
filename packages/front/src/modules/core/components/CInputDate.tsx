import { UtilDate } from "common";
import { CalendarDays, Paintbrush } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";

import { useInputDateInvalidMsg } from "../hooks/useInputDateInvalidMsg";
import { usePopupState } from "../hooks/usePopupState";
import { useTranslation } from "../hooks/useTranslation";
import { IconType } from "./CIcon";
import { CInputInnerButton } from "./CInputInnerButton";
import { CInputPopup } from "./CInputPopup";
import { CSelectDate } from "./CSelectDate";

export function CInputDate({
  value,
  onChange,
  onInvalidMsg,
  icon,
  disabled,
  placeholder,
  invalid,
  required,
  min,
  max,
}: {
  value?: string;
  onChange?: (value: string | undefined) => void;
  onInvalidMsg?: (msg: string) => void;
  icon?: IconType;
  disabled?: boolean;
  placeholder?: string;
  invalid?: boolean;
  required?: boolean;
  min?: string;
  max?: string;
}) {
  const { t } = useTranslation();
  const inputPopupState = usePopupState();
  const setIsOpen = inputPopupState.setIsOpen;

  const handleChange = useCallback(
    (v: string | undefined) => {
      setIsOpen(false);
      onChange?.(v);
    },
    [onChange, setIsOpen],
  );

  const invalidMsg = useInputDateInvalidMsg(
    value,
    disabled,
    required,
    min,
    max,
  );

  const invalidFinal = invalid || Boolean(invalidMsg);

  useEffect(() => {
    onInvalidMsg?.(invalidMsg);
  }, [onInvalidMsg, invalidMsg]);

  const formattedValue = useMemo(
    () => (value ? UtilDate.formatLocalIsoDateToLocalDate(value) : undefined),
    [value],
  );

  const popupComponent = useCallback(
    () => (
      <CSelectDate value={value} onChange={handleChange} min={min} max={max} />
    ),
    [value, min, max, handleChange],
  );

  const handleClear = useCallback(() => {
    onChange?.(undefined);
  }, [onChange]);

  return (
    <CInputPopup
      state={inputPopupState}
      caretIcon={CalendarDays}
      popupComponent={popupComponent}
      popupFixedSize
      icon={icon}
      disabled={disabled}
      placeholder={placeholder}
      invalid={invalidFinal}
      classNameChildrenContainer="grow flex"
    >
      {formattedValue && (
        <>
          <div className="grow truncate">{formattedValue}</div>

          {!required && !disabled && (
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
