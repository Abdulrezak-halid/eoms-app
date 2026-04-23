import { Play } from "lucide-react";
import { useCallback, useMemo } from "react";

import { CButton } from "@m/core/components/CButton";
import { CForm } from "@m/core/components/CForm";
import {
  CFormFooter,
  CFormLine,
  CFormPanel,
} from "@m/core/components/CFormPanel";
import {
  CQuickRangeSelect,
  ICQuickRangeValue,
} from "@m/core/components/CQuickRangeSelect";
import { CRadioGroup } from "@m/core/components/CRadioGroup";
import { ISelectListItem } from "@m/core/components/CSelectList";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { quickRangeToDatetimeRange } from "@m/core/utils/UtilQuickRange";
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
  const inputDatetimeRange = useInput<ICQuickRangeValue | undefined>();

  const seuModeOptions = useMemo<ISelectListItem<ISeuSelectionMode>[]>(
    () => [
      { value: "ALL", label: t("useAllSEUs") },
      { value: "SPECIFIC", label: t("selectSEU") },
    ],
    [t],
  );

  const isSpecific = inputSeuMode.value === "SPECIFIC";
  const datetimeRange = useMemo(
    () => quickRangeToDatetimeRange(inputDatetimeRange.value),
    [inputDatetimeRange.value],
  );

  const invalidBase = useInputInvalid();
  const invalidSpecific = useInputInvalid(inputSeuId);
  const invalidRange = Boolean(datetimeRange.invalidMsg);
  const invalid =
    invalidBase || invalidRange || (isSpecific && invalidSpecific);

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !datetimeRange.datetimeMin ||
      !datetimeRange.datetimeMax ||
      (isSpecific && !inputSeuId.value)
    ) {
      return;
    }

    await onSubmit({
      query: {
        datetimeMin: datetimeRange.datetimeMin,
        datetimeMax: datetimeRange.datetimeMax,
      },
      body: {
        seuId: isSpecific ? inputSeuId.value : undefined,
      },
    });
  }, [invalid, datetimeRange, isSpecific, inputSeuId.value, onSubmit]);

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

        <CFormLine label={t("dateRange")} invalidMsg={datetimeRange.invalidMsg}>
          <CQuickRangeSelect
            value={inputDatetimeRange.value}
            onChange={inputDatetimeRange.onChange}
            invalid={invalidRange}
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
