import { useCallback } from "react";

import { Api } from "@m/base/api/Api";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CButton } from "@m/core/components/CButton";
import { CForm } from "@m/core/components/CForm";
import {
  CFormFooter,
  CFormLine,
  CFormPanel,
} from "@m/core/components/CFormPanel";
import { CInfoButton } from "@m/core/components/CInfoButton";
import { CInputNumber } from "@m/core/components/CInputNumber";
import { CModal } from "@m/core/components/CModal";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CRegressionAnalysesCardThresholdModal({
  id,
  initialValue,
  onDone,
  onClose,
}: {
  id: string;
  initialValue: number | null;
  onDone: () => Promise<void>;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  const inputValue = useInput(initialValue ?? undefined);

  const invalid = useInputInvalid(inputValue);

  const apiToast = useApiToast();

  const handleSubmit = useCallback(async () => {
    if (invalid) {
      return;
    }

    const res = await Api.PUT("/u/analysis/advanced-regression/set-threshold", {
      body: {
        id,
        value: inputValue.value ?? null,
      },
    });
    apiToast(res);

    if (!res.error) {
      await onDone();
      onClose();
    }
  }, [invalid, id, inputValue.value, apiToast, onDone, onClose]);

  return (
    <CModal onClickBg={onClose}>
      <CForm onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">{t("adjustThreshold")}</h3>
            <CInfoButton message={t("msgThresholdInfo")} />
          </div>

          <CFormPanel>
            <CFormLine invalidMsg={inputValue.invalidMsg}>
              <CInputNumber
                {...inputValue}
                placeholder={t("value")}
                float
                min={1}
                max={100}
              />
            </CFormLine>

            <CFormFooter>
              <CButton label={t("cancel")} onClick={onClose} />
              <CButton label={t("save")} submit primary disabled={invalid} />
            </CFormFooter>
          </CFormPanel>
        </div>
      </CForm>
    </CModal>
  );
}
