import { EMAIL_REGEX } from "common";
import { Mail } from "lucide-react";

import { useTranslation } from "@m/core/hooks/useTranslation";

import { CInputString } from "./CInputString";

export function CInputEmail({
  placeholder,
  value,
  onChange,
  onInvalidMsg,
  disabled,
  invalid,
  required,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onInvalidMsg?: (msg: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <CInputString
      icon={Mail}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onInvalidMsg={onInvalidMsg}
      disabled={disabled}
      invalid={invalid}
      required={required}
      regex={EMAIL_REGEX}
      regexInvalidMsg={t("invalidEmail")}
    />
  );
}
