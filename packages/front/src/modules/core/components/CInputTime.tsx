import { Clock } from "lucide-react";
import { useCallback, useEffect } from "react";

import { useInputTimeInvalidMsg } from "../hooks/useInputTimeInvalidMsg";
import { usePopupState } from "../hooks/usePopupState";
import { IconType } from "./CIcon";
import { CInputPopup } from "./CInputPopup";
import { CSelectTime } from "./CSelectTime";

export function CInputTime({
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
  onChange?: (value: string) => void;
  onInvalidMsg?: (msg: string) => void;
  icon?: IconType;
  disabled?: boolean;
  placeholder?: string;
  invalid?: boolean;
  required?: boolean;
  min?: string;
  max?: string;
}) {
  const inputPopupState = usePopupState();

  const handleChange = useCallback(
    (v: string) => {
      onChange?.(v);
    },
    [onChange],
  );

  const invalidMsg = useInputTimeInvalidMsg(
    value,
    disabled,
    required,
    min,
    max,
  );

  useEffect(() => {
    onInvalidMsg?.(invalidMsg);
  }, [onInvalidMsg, invalidMsg]);

  const invalidFinal = invalid || Boolean(invalidMsg);

  const popupComponent = useCallback(
    () => (
      <CSelectTime value={value} onChange={handleChange} min={min} max={max} />
    ),
    [value, handleChange, min, max],
  );

  return (
    <CInputPopup
      state={inputPopupState}
      caretIcon={Clock}
      popupComponent={popupComponent}
      icon={icon}
      disabled={disabled}
      placeholder={placeholder}
      invalid={invalidFinal}
    >
      {value}
    </CInputPopup>
  );
}
