import { PHONE_REGEX } from "common";
import { Phone } from "lucide-react";

import { useTranslation } from "@m/core/hooks/useTranslation";

import { CInputMultiString } from "./CInputMultiString";

export function CInputMultiPhone({
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
      placeholder={placeholder || t("phoneNumbers")}
      onInvalidMsg={onInvalidMsg}
      icon={Phone}
      disabled={disabled}
      invalid={invalid}
      required={required}
      regex={PHONE_REGEX}
      regexInvalidMsg={t("invalidPhone")}
    />
  );
}
