import { PHONE_REGEX } from "common";
import { Phone } from "lucide-react";

import { useTranslation } from "@m/core/hooks/useTranslation";

import { CInputString } from "./CInputString";

export function CInputPhone({
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
      icon={Phone}
      placeholder={placeholder || t("phoneNumber")}
      value={value}
      onChange={onChange}
      onInvalidMsg={onInvalidMsg}
      disabled={disabled}
      invalid={invalid}
      required={required}
      regex={PHONE_REGEX}
      regexInvalidMsg={t("invalidPhone")}
    />
  );
}
