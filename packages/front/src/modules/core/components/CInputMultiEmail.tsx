import { EMAIL_REGEX } from "common";
import { Mail } from "lucide-react";

import { useTranslation } from "@m/core/hooks/useTranslation";

import { CInputMultiString } from "./CInputMultiString";

export function CInputMultiEmail({
  value,
  onChange,
  placeholder,
  onInvalidMsg,
  disabled,
  invalid,
  required,
}: {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  onInvalidMsg?: (msg: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <CInputMultiString
      value={value}
      onChange={onChange}
      placeholder={placeholder || t("email")}
      onInvalidMsg={onInvalidMsg}
      icon={Mail}
      disabled={disabled}
      invalid={invalid}
      required={required}
      regex={EMAIL_REGEX}
      regexInvalidMsg={t("invalidEmail")}
    />
  );
}
