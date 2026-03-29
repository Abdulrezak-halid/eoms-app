import { Play } from "lucide-react";
import { useCallback, useMemo } from "react";

import { CButton } from "@m/core/components/CButton";
import { CForm } from "@m/core/components/CForm";
import {
  CFormFooter,
  CFormLine,
  CFormPanel,
} from "@m/core/components/CFormPanel";
import { CInputDatetime } from "@m/core/components/CInputDatetime";
import { CRadioGroup } from "@m/core/components/CRadioGroup";
import { ISelectListItem } from "@m/core/components/CSelectList";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { CComboboxSeu } from "@m/measurement/components/CComboboxSeu";

import { IDtoAdvancedRegressionSuggestFormData } from "../interfaces/IDtoRegressionAnalyses";

type ISeuSelectionMode = "ALL" | "SPECIFIC";

export function CRegressionSuggestForm({
  onSubmit,
}: {
  onSubmit: (data: IDtoAdvancedRegressionSuggestFormData) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputSeuMode = useInput<ISeuSelectionMode>("ALL");
  const inputSeuId = useInput<string>();
  const inputDatetimeStart = useInput<string>();
  const inputDatetimeEnd = useInput<string>();

  const seuModeOptions = useMemo<ISelectListItem<ISeuSelectionMode>[]>(
    () => [
      { value: "ALL", label: t("useAllSEUs") },
      { value: "SPECIFIC", label: t("selectSEU") },
    ],
    [t],
  );

  const isSpecific = inputSeuMode.value === "SPECIFIC";

  const invalidBase = useInputInvalid(inputDatetimeStart, inputDatetimeEnd);
  const invalidSpecific = useInputInvalid(inputSeuId);
  const invalid = invalidBase || (isSpecific && invalidSpecific);

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputDatetimeStart.value ||
      !inputDatetimeEnd.value ||
      (isSpecific && !inputSeuId.value)
    ) {
      return;
    }

    await onSubmit({
      query: {
        datetimeMin: inputDatetimeStart.value,
        datetimeMax: inputDatetimeEnd.value,
      },
      body: {
        seuId: isSpecific ? inputSeuId.value : undefined,
      },
    });
  }, [
    invalid,
    inputDatetimeStart.value,
    inputDatetimeEnd.value,
    isSpecific,
    inputSeuId.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine
          label={t("significantEnergyUser")}
          invalidMsg={isSpecific ? inputSeuId.invalidMsg : undefined}
        >
          <div className="space-y-2">
            <CRadioGroup
              list={seuModeOptions}
              value={inputSeuMode.value || "all"}
              onChange={inputSeuMode.onChange}
              inline
            />

            {isSpecific && <CComboboxSeu {...inputSeuId} required />}
          </div>
        </CFormLine>

        <CFormLine
          label={t("datetimeStart")}
          invalidMsg={inputDatetimeStart.invalidMsg}
        >
          <CInputDatetime
            {...inputDatetimeStart}
            max={inputDatetimeEnd.value}
            placeholder={t("datetimeStart")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("datetimeEnd")}
          invalidMsg={inputDatetimeEnd.invalidMsg}
        >
          <CInputDatetime
            {...inputDatetimeEnd}
            min={inputDatetimeStart.value}
            placeholder={t("datetimeEnd")}
            required
          />
        </CFormLine>

        <CFormFooter>
          <CButton
            icon={Play}
            label={t("start")}
            onClick={handleSubmit}
            primary
            disabled={invalid}
          />
        </CFormFooter>
      </CFormPanel>
    </CForm>
  );
}
