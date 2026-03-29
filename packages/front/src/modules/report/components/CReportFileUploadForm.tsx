import { useCallback } from "react";
import { Upload } from "lucide-react";

import { CButton } from "@m/core/components/CButton";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputFile } from "@m/core/components/CInputFile";
import { CInputString } from "@m/core/components/CInputString";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CReportFileUploadForm({
  onSubmit,
}: {
  onSubmit: (name: string, file: File) => Promise<void>;
}) {
  const { t } = useTranslation();
  const inputFile = useInput<File[]>([]);
  const inputName = useInput("");

  const invalid = useInputInvalid(inputName, inputFile);

  const handleSubmit = useCallback(async () => {
    if (invalid) {
      return;
    }

    await onSubmit(inputName.value, inputFile.value[0]);
  }, [invalid, onSubmit, inputName.value, inputFile.value]);

  return (
    <CFormPanel>
      <CFormLine label={t("name")} invalidMsg={inputName.invalidMsg}>
        <CInputString {...inputName} placeholder={t("name")} required />
      </CFormLine>

      <CFormLine label={t("file")} invalidMsg={inputFile.invalidMsg}>
        <CInputFile {...inputFile} accept="application/pdf" required />
      </CFormLine>

      <div className="flex justify-end">
        <CButton
          icon={Upload}
          label={t("upload")}
          onClick={handleSubmit}
          disabled={invalid}
        />
      </div>
    </CFormPanel>
  );
}
