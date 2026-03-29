import { Play } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { CButton } from "@m/core/components/CButton";
import { CForm } from "@m/core/components/CForm";
import {
  CFormFooter,
  CFormLine,
  CFormPanel,
} from "@m/core/components/CFormPanel";
import { CInputDatetime } from "@m/core/components/CInputDatetime";
import { CRadioGroup } from "@m/core/components/CRadioGroup";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { CComboboxSeu } from "@m/measurement/components/CComboboxSeu";
import { CMultiSelectMeterSlice } from "@m/measurement/components/CMultiSelectMeterSlice";
import { CMultiSelectMetric } from "@m/measurement/components/CMultiSelectMetric";

import {
  IDtoAdvancedRegressionCommitRequest,
  IDtoAdvancedRegressionFormData,
  IDtoAdvancedRegressionResultItem,
} from "../interfaces/IDtoRegressionAnalyses";

export function CRegressionAnalysesForm({
  initialData,
  onSubmit,
}: {
  initialData?:
    | IDtoAdvancedRegressionResultItem
    | IDtoAdvancedRegressionFormData;
  onSubmit: (data: IDtoAdvancedRegressionCommitRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const sourceTypeList = useMemo(
    () => [
      {
        label: t("significantEnergyUser"),
        value: "SEU" as const,
      },
      {
        label: t("meters"),
        value: "METER_SLICES" as const,
      },
    ],
    [t],
  );

  const normalizedInitial = useMemo(() => {
    if (!initialData) {
      return {
        sourceType: "SEU" as const,
      };
    }

    if ("dateTrainStart" in initialData) {
      const hasSeu = Boolean(initialData.seu?.id);
      return {
        sourceType: hasSeu ? ("SEU" as const) : ("METER_SLICES" as const),
        seuId: initialData.seu?.id,
        meterSliceIds: initialData.slices.map((d) => d.id),
        driverIds: initialData.drivers.map((d) => d.id),
        dateTrainStart: initialData.dateTrainStart,
        dateTrainEnd: initialData.dateTrainEnd,
        datePredictStart: initialData.datePredictStart,
        datePredictEnd: initialData.datePredictEnd,
      };
    }

    const hasSeu = Boolean(initialData.seu?.id);
    return {
      sourceType: hasSeu ? ("SEU" as const) : ("METER_SLICES" as const),
      seuId: initialData.seu?.id,
      meterSliceIds: initialData.slices?.map((d) => d.id) || [],
      driverIds: initialData.drivers.map((d) => d.id),
    };
  }, [initialData]);

  const [sourceType, setSourceType] = useState(normalizedInitial.sourceType);
  const inputSeuId = useInput(normalizedInitial.seuId);
  const inputMeterSliceIds = useInput<string[]>(
    normalizedInitial.meterSliceIds || [],
  );
  const inputDriverIds = useInput<string[]>(normalizedInitial.driverIds || []);
  const inputDateTrainStart = useInput(normalizedInitial.dateTrainStart);
  const inputDateTrainEnd = useInput(normalizedInitial.dateTrainEnd);
  const inputDatePredictStart = useInput(normalizedInitial.datePredictStart);
  const inputDatePredictEnd = useInput(normalizedInitial.datePredictEnd);

  const invalidBase = useInputInvalid(
    inputDriverIds,
    inputDateTrainStart,
    inputDateTrainEnd,
    inputDatePredictStart,
    inputDatePredictEnd,
  );
  const invalidTarget =
    sourceType === "SEU"
      ? !inputSeuId.value
      : inputMeterSliceIds.value.length === 0;
  const invalid = invalidBase || invalidTarget;

  const handleSourceTypeChange = useCallback(
    (value: "SEU" | "METER_SLICES") => {
      setSourceType(value);
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputDriverIds.value?.length ||
      !inputDateTrainStart.value ||
      !inputDateTrainEnd.value ||
      !inputDatePredictStart.value ||
      !inputDatePredictEnd.value
    ) {
      return;
    }

    if (sourceType === "SEU" && !inputSeuId.value) {
      return;
    }

    if (sourceType === "METER_SLICES" && !inputMeterSliceIds.value.length) {
      return;
    }

    await onSubmit({
      driverIds: inputDriverIds.value,
      dateTrainStart: inputDateTrainStart.value,
      dateTrainEnd: inputDateTrainEnd.value,
      datePredictStart: inputDatePredictStart.value,
      datePredictEnd: inputDatePredictEnd.value,
      ...(sourceType === "SEU"
        ? { seuId: inputSeuId.value }
        : { meterSliceIds: inputMeterSliceIds.value }),
    });
  }, [
    invalid,
    sourceType,
    inputSeuId.value,
    inputMeterSliceIds.value,
    inputDriverIds.value,
    inputDateTrainStart.value,
    inputDateTrainEnd.value,
    inputDatePredictStart.value,
    inputDatePredictEnd.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("regressionAnalysis")}>
          <CRadioGroup
            list={sourceTypeList}
            value={sourceType}
            onChange={handleSourceTypeChange}
            inline
          />
        </CFormLine>

        {sourceType === "SEU" && (
          <CFormLine
            label={t("significantEnergyUser")}
            invalidMsg={inputSeuId.invalidMsg}
          >
            <CComboboxSeu {...inputSeuId} required />
          </CFormLine>
        )}

        {sourceType === "METER_SLICES" && (
          <CFormLine
            label={t("meters")}
            invalidMsg={inputMeterSliceIds.invalidMsg}
          >
            <CMultiSelectMeterSlice
              {...inputMeterSliceIds}
              allEnergyResources
              required
            />
          </CFormLine>
        )}

        <CFormLine label={t("drivers")} invalidMsg={inputDriverIds.invalidMsg}>
          <CMultiSelectMetric
            {...inputDriverIds}
            excludeUnitGroup="ENERGY"
            required
          />
        </CFormLine>

        <CFormLine
          label={t("dateTrainStart")}
          invalidMsg={inputDateTrainStart.invalidMsg}
        >
          <CInputDatetime
            {...inputDateTrainStart}
            max={inputDateTrainEnd.value || undefined}
            placeholder={t("dateTrainStart")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("dateTrainEnd")}
          invalidMsg={inputDateTrainEnd.invalidMsg}
        >
          <CInputDatetime
            {...inputDateTrainEnd}
            min={inputDateTrainStart.value || undefined}
            placeholder={t("dateTrainEnd")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("datePredictStart")}
          invalidMsg={inputDatePredictStart.invalidMsg}
        >
          <CInputDatetime
            {...inputDatePredictStart}
            max={inputDatePredictEnd.value || undefined}
            placeholder={t("datePredictStart")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("datePredictEnd")}
          invalidMsg={inputDatePredictEnd.invalidMsg}
        >
          <CInputDatetime
            {...inputDatePredictEnd}
            min={inputDatePredictStart.value || undefined}
            placeholder={t("datePredictEnd")}
            required
          />
        </CFormLine>

        <CFormFooter>
          <CButton
            icon={Play}
            primary
            label={t("create")}
            onClick={handleSubmit}
            disabled={invalid}
          />
        </CFormFooter>
      </CFormPanel>
    </CForm>
  );
}
