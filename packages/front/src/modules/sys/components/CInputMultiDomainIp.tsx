// CInputMultiDomainIp.tsx
import { CInputMultiString } from "@m/core/components/CInputMultiString";
import { IP_REGEX, DOMAIN_REGEX } from "common";
import { useTranslation } from "@m/core/hooks/useTranslation";


export function CInputMultiDomainIp({
  type,
  placeholder,
  value,
  onChange,
  onInvalidMsg,
  disabled,
  invalid,
  required,
}: {
  type: "domain" | "ip";
  placeholder?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  onInvalidMsg?: (msg: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
}) {
  const { t } = useTranslation();

  const regex = type === "ip" ? IP_REGEX : DOMAIN_REGEX;
  const regexInvalidMsg = type === "ip" ? t("invalidIp") : t("invalidDomain");

  return (
    <CInputMultiString
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onInvalidMsg={onInvalidMsg}
      disabled={disabled}
      invalid={invalid}
      required={required}
      regex={regex}
      regexInvalidMsg={regexInvalidMsg}
    />
  );
}