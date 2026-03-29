/**
 * @file: CReportSectionText.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.01.2026
 * Last Modified Date: 06.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useEffect } from "react";

import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoReportSectionContent } from "../interfaces/IDtoReport";
import { CInputStringPlainOrTranslatable } from "./CInputStringPlainOrTranslatable";

export function CReportSectionText({
  content,
  template,
  onChange,
  onInvalidChange,
}: {
  content: Extract<IDtoReportSectionContent, { type: "TEXT" }>;
  template?: boolean;
  onChange: (value: IDtoReportSectionContent) => void;
  onInvalidChange: (value: boolean) => void;
}) {
  const { t } = useTranslation();

  const inputText = useInput(content.value);
  const invalid = useInputInvalid(inputText);

  useEffect(() => {
    onInvalidChange(invalid);
  }, [invalid, onInvalidChange]);

  useEffect(() => {
    onChange({ type: "TEXT", value: inputText.value });
  }, [inputText.value, onChange]);

  return (
    <CFormPanel>
      <CFormLine label={t("content")} invalidMsg={inputText.invalidMsg}>
        <CInputStringPlainOrTranslatable
          {...inputText}
          placeholder={t("text")}
          required={!template}
          multiline
        />
      </CFormLine>
    </CFormPanel>
  );
}
