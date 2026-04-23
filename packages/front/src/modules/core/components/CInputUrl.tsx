/**
 * @file: CInputEmail.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 29.10.2024
 * Last Modified Date: 29.10.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { URL_REGEX } from "common";
import { Link } from "lucide-react";

import { useTranslation } from "@m/core/hooks/useTranslation";

import { CInputString } from "./CInputString";

export function CInputUrl({
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
      icon={Link}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onInvalidMsg={onInvalidMsg}
      disabled={disabled}
      invalid={invalid}
      required={required}
      regex={URL_REGEX}
      regexInvalidMsg={t("invalidUrl")}
    />
  );
}
