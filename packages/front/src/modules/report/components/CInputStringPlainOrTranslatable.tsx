/**
 * @file: CInputStringPlainOrTranslatable.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.01.2026
 * Last Modified Date: 06.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { MAX_REPORT_TEXT_STRING_LENGTH } from "common";
import { IDtoPlainOrTranslatableText } from "common/build-api-schema";
import { Languages, RotateCcw } from "lucide-react";
import { useCallback, useMemo } from "react";

import { CInputInnerButton } from "@m/core/components/CInputInnerButton";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { CLine } from "@m/core/components/CLine";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { renderPlainOrTranslatableText } from "../utils/renderPlainOrTranslatableText";

/**
 * Component for editing Plain or Translatable strings.
 *
 * Behavior:
 * - If value comes from backend as TRANSLATABLE, displays the translated text
 * - If user edits the text, it automatically converts to PLAIN type
 * - User can never set or change to TRANSLATABLE type (only backend can)
 * - If user doesn't change the value, it stays as TRANSLATABLE
 * - Supports optional defaultValue for initial translatable values (e.g., section titles)
 */
export function CInputStringPlainOrTranslatable({
  value,
  onChange,
  onInvalidMsg,
  placeholder,
  required = false,
  disabled = false,
  invalid = false,
  multiline = false,
  defaultValue,
  min,
  max = MAX_REPORT_TEXT_STRING_LENGTH,
}: {
  value?: IDtoPlainOrTranslatableText;
  onChange?: (value: IDtoPlainOrTranslatableText) => void;
  onInvalidMsg?: (msg: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  multiline?: boolean;
  className?: string;
  defaultValue?: IDtoPlainOrTranslatableText;
  min?: number;
  max?: number;
}) {
  const { t } = useTranslation();

  const displayValue = useMemo(
    () => renderPlainOrTranslatableText(t, value),
    [value, t],
  );

  const handleChange = useCallback(
    (v: string) => {
      onChange?.({ type: "PLAIN", value: v });
    },
    [onChange],
  );

  const handleRevert = useCallback(() => {
    if (!defaultValue) {
      return;
    }
    onChange?.(defaultValue);
  }, [defaultValue, onChange]);

  const isTranslated = value?.type === "TRANSLATED";

  const showRevertButton =
    defaultValue &&
    (!value ||
      value.type !== defaultValue.type ||
      value.value !== defaultValue.value);

  return (
    <CLine>
      <div className="grow">
        {multiline ? (
          <CInputTextarea
            icon={isTranslated ? Languages : undefined}
            value={displayValue}
            onChange={handleChange}
            onInvalidMsg={onInvalidMsg}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            invalid={invalid}
            min={min}
            max={max}
          >
            {showRevertButton && (
              <CInputInnerButton
                ariaLabel={t("revert")}
                icon={RotateCcw}
                onClick={handleRevert}
              />
            )}
          </CInputTextarea>
        ) : (
          <CInputString
            icon={isTranslated ? Languages : undefined}
            value={displayValue}
            onChange={handleChange}
            onInvalidMsg={onInvalidMsg}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            invalid={invalid}
            min={min}
            max={max}
          >
            {showRevertButton && (
              <CInputInnerButton
                ariaLabel={t("revert")}
                icon={RotateCcw}
                onClick={handleRevert}
              />
            )}
          </CInputString>
        )}
      </div>
    </CLine>
  );
}
