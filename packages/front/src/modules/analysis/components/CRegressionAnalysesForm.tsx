import { Play } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

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
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";
import {
  datetimeRangeToQuickRange,
  quickRangeToDatetimeRange,
} from "@m/core/utils/UtilQuickRange";
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
  const inputDateTrainRange = useInput<ICQuickRangeValue | undefined>(
    datetimeRangeToQuickRange(
      normalizedInitial.dateTrainStart,
      normalizedInitial.dateTrainEnd,
    ),
  );
  const inputDatePredictRange = useInput<ICQuickRangeValue | undefined>(
    datetimeRangeToQuickRange(
      normalizedInitial.datePredictStart,
      normalizedInitial.datePredictEnd,
    ),
  );

  const trainRangeValue = useMemo(
    () => quickRangeToDatetimeRange(inputDateTrainRange.value),
    [inputDateTrainRange.value],
  );
  const predictRangeValue = useMemo(
    () => quickRangeToDatetimeRange(inputDatePredictRange.value),
    [inputDatePredictRange.value],
  );

  const invalidBase = useInputInvalid(inputDriverIds);
  const invalidTarget =
    sourceType === "SEU"
      ? !inputSeuId.value
      : inputMeterSliceIds.value.length === 0;
  const invalidRange = Boolean(
    trainRangeValue.invalidMsg || predictRangeValue.invalidMsg,
  );
  const invalid = invalidBase || invalidTarget || invalidRange;

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
      !trainRangeValue.datetimeMin ||
      !trainRangeValue.datetimeMax ||
      !predictRangeValue.datetimeMin ||
      !predictRangeValue.datetimeMax
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
      dateTrainStart: trainRangeValue.datetimeMin,
      dateTrainEnd: trainRangeValue.datetimeMax,
      datePredictStart: predictRangeValue.datetimeMin,
      datePredictEnd: predictRangeValue.datetimeMax,
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
    trainRangeValue,
    predictRangeValue,
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
          label={t("dateTrainRange")}
          invalidMsg={trainRangeValue.invalidMsg}
        >
          <CQuickRangeSelect
            value={inputDateTrainRange.value}
            onChange={inputDateTrainRange.onChange}
            invalid={Boolean(trainRangeValue.invalidMsg)}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("datePredictRange")}
          invalidMsg={predictRangeValue.invalidMsg}
        >
          <CQuickRangeSelect
            value={inputDatePredictRange.value || {}}
            onChange={inputDatePredictRange.onChange}
            invalid={Boolean(predictRangeValue.invalidMsg)}
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
