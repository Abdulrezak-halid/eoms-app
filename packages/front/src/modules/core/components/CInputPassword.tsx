/**
 * @file: CInputPassword.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 21.10.2024
 * Last Modified Date: 21.10.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { classNames } from "../utils/classNames";
import { IconType } from "./CIcon";
import { CInputInnerButton } from "./CInputInnerButton";
import { CInputString } from "./CInputString";

export function CInputPassword({
  icon = KeyRound,
  placeholder,
  value,
  onChange,
  onInvalidMsg,
  disabled,
  invalid,
  required,
  min,
  max,
  regex,
  regexInvalidMsg,
  className,
  noCleanButton,
}: {
  icon?: IconType;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onInvalidMsg?: (msg: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  regex?: RegExp;
  regexInvalidMsg?: string;
  className?: string;
  noCleanButton?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [visible, setVisibility] = useState(false);
  const toggleVisibility = useCallback(() => {
    setVisibility((d) => !d);
    if (!ref.current) {
      return;
    }
    ref.current.focus();

    // Here is to fix a bug that cursor is moved at the begginning.
    // Move cursor at end.
    setTimeout(() => {
      const el = ref.current;
      if (!el) {
        return;
      }
      const len = el.value.length;
      el.setSelectionRange(len, len);
    }, 0);
  }, []);

  return (
    <CInputString
      ref={ref}
      invalid={invalid}
      disabled={disabled}
      required={required}
      icon={icon}
      type={visible ? "text" : "password"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onInvalidMsg={onInvalidMsg}
      min={min}
      max={max}
      regex={regex}
      regexInvalidMsg={regexInvalidMsg}
      className={classNames("relative", className)}
      classNameInput="pr-12"
      noCleanButton={noCleanButton}
    >
      {!disabled && (
        <CInputInnerButton
          icon={visible ? EyeOff : Eye}
          onClick={toggleVisibility}
        />
      )}
    </CInputString>
  );
}
