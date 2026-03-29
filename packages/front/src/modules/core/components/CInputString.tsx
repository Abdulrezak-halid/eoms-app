import { MAX_API_STRING_LENGTH } from "common";
import { Paintbrush } from "lucide-react";
import {
  PropsWithChildren,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useTranslation } from "@m/core/hooks/useTranslation";

import { classNames } from "../utils/classNames";
import { IconType } from "./CIcon";
import { CInputContainer } from "./CInputContainer";
import { CInputCore } from "./CInputCore";
import { CInputInnerButton } from "./CInputInnerButton";

export type ICInputStringProps = PropsWithChildren<{
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

  type?: "text" | "password";
  className?: string;
  classNameInput?: string;
  noCleanButton?: boolean;
  onFocus?: () => void;

  // Forward ref is not used because ref is also used internally
  ref?: RefObject<HTMLInputElement | null>;
}>;

export function CInputString({
  icon,
  placeholder,
  value = "",
  onChange,
  onInvalidMsg,
  disabled,
  invalid,
  required,
  min,
  max = MAX_API_STRING_LENGTH,
  regex,
  regexInvalidMsg,

  type = "text",
  className,
  classNameInput,
  noCleanButton,
  onFocus,

  ref,
  children,
}: ICInputStringProps) {
  const { t } = useTranslation();

  const [invalidInternal, setInvalidInternal] = useState(false);
  const invalidFinal = invalid || invalidInternal;

  const handleInvalid = useCallback(
    (val: string | undefined) => {
      if (disabled) {
        onInvalidMsg?.("");
        setInvalidInternal(false);
        return;
      }

      const invalidRequired = required && !val;
      const invalidMin =
        min !== undefined && val !== undefined && val.length < min;
      const invalidMax =
        max !== undefined && val !== undefined && val.length > max;
      const invalidRegex = val && regex && !val.match(regex);

      let msg = "";
      if (invalidRequired) {
        msg = t("required");
      } else if (invalidMin) {
        msg = t("invalidTextMin", { value: min });
      } else if (invalidMax) {
        msg = t("invalidTextMax", { value: max });
      } else if (invalidRegex) {
        msg = regexInvalidMsg || t("invalidRegex");
      }

      onInvalidMsg?.(msg);
      setInvalidInternal(Boolean(msg));
    },
    [disabled, max, min, onInvalidMsg, regex, regexInvalidMsg, required, t],
  );

  useEffect(() => {
    handleInvalid(value);
  }, [handleInvalid, value]);

  const refInput = useRef<HTMLInputElement | null>(null);

  const handleRef = useCallback(
    (r: HTMLInputElement) => {
      if (ref) {
        ref.current = r;
      }
      refInput.current = r;
    },
    [ref],
  );

  const handleClear = useCallback(() => {
    onChange?.("");
    refInput.current?.focus();
  }, [onChange]);

  return (
    <CInputContainer
      className={classNames("flex", className)}
      disabled={disabled}
      invalid={invalidFinal}
      icon={icon}
    >
      <CInputCore
        ref={handleRef}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        disabled={disabled}
        className={classNames(classNameInput, icon && "pl-12")}
        maxLength={max}
      />

      {!noCleanButton && !required && !disabled && value && (
        <CInputInnerButton
          ariaLabel={t("clear")}
          icon={Paintbrush}
          onClick={handleClear}
        />
      )}

      {children}
    </CInputContainer>
  );
}
