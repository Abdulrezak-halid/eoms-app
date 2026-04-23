import { MAX_API_STRING_LONG_LENGTH } from "common";
import { ChevronsUpDown, Paintbrush } from "lucide-react";
import {
  ChangeEvent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { useTranslation } from "@m/core/hooks/useTranslation";

import { classNames } from "../utils/classNames";
import { CIcon, IconType } from "./CIcon";
import { CInputContainer } from "./CInputContainer";
import { CInputInnerButton } from "./CInputInnerButton";
import "./CInputTextarea.css";

export function CInputTextarea({
  icon,
  placeholder,
  value = "",
  onChange,
  onInvalidMsg,
  disabled,
  invalid,
  required,
  min,
  max = MAX_API_STRING_LONG_LENGTH,
  noCleanButton,
  children,
}: PropsWithChildren<{
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
  noCleanButton?: boolean;
}>) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e.target.value);
    },
    [onChange],
  );

  const ref = useRef<HTMLTextAreaElement>(null);
  const handleClear = useCallback(() => {
    onChange?.("");
    ref.current?.focus();
  }, [onChange]);

  const invalidRequired = required && !value;
  const invalidMin =
    min !== undefined && value !== undefined && value.length < min;
  const invalidMax =
    max !== undefined && value !== undefined && value.length > max;
  const { t } = useTranslation();
  const invalidMsg = useMemo(() => {
    if (disabled) {
      return "";
    }

    if (invalidRequired) {
      return t("required");
    }
    if (invalidMin) {
      return t("invalidTextMin", { value: min });
    }
    if (invalidMax) {
      return t("invalidTextMax", { value: max });
    }
    return "";
  }, [invalidRequired, invalidMin, invalidMax, min, max, t, disabled]);

  const invalidFinal = invalid || Boolean(invalidMsg);

  useEffect(() => {
    onInvalidMsg?.(invalidMsg);
  }, [onInvalidMsg, invalidMsg]);

  return (
    <CInputContainer
      icon={icon}
      disabled={disabled}
      invalid={invalidFinal}
      className="flex"
    >
      <CIcon
        value={ChevronsUpDown}
        className="absolute bottom-1 right-0 pointer-events-none text-gray-400 dark:text-gray-500"
      />
      <textarea
        ref={ref}
        className={classNames(
          "w-full p-3 bg-transparent block placeholder:x-placeholder outline-hidden min-h-24",
          icon && "pl-12",
        )}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
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
