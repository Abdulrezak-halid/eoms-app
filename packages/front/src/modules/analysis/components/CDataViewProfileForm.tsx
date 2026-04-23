import { IDtoEEnergyResource } from "common/build-api-schema";
import { useCallback, useMemo } from "react";

import { CComboboxEnergyResource } from "@m/base/components/CComboboxEnergyResource";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CMultiSelectSeu } from "@m/base/components/CMultiSelectSeu";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  IDtoDataViewProfileRequest,
  IDtoDataViewProfileResponse,
} from "../../analysis/interfaces/IDtoDataViewProfile";
import { CComboboxDataViewType } from "./CComboboxDataViewType";
import { CMultiSelectMeterSlice } from "../../measurement/components/CMultiSelectMeterSlice";
import { CMultiSelectMetric } from "../../measurement/components/CMultiSelectMetric";

export function CDataViewProfileForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoDataViewProfileResponse;
  onSubmit: (data: IDtoDataViewProfileRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputName = useInput(initialData?.name);
  const inputDescription = useInput(initialData?.description || "");
  const inputType = useInput(initialData?.options.type);

  const initialMetricIds = useMemo(
    () =>
      initialData?.options?.type === "METRIC"
        ? initialData.options.metrics.map((d) => d.id)
        : [],
    [initialData],
  );

  const inputMetricIds = useInput(initialMetricIds);

  const initialMeterSliceIds = useMemo(
    () =>
      initialData?.options?.type === "METER_SLICE"
        ? initialData.options.meterSlices.map((d) => d.id)
        : [],
    [initialData],
  );

  const inputMeterSliceIds = useInput(initialMeterSliceIds);

  const initialSeuIds = useMemo(
    () =>
      initialData?.options?.type === "SEU"
        ? initialData.options.seus.map((d) => d.id)
        : [],
    [initialData],
  );

  const initialSeuEnergyResource = useMemo(
    () =>
      initialData?.options?.type === "SEU"
        ? initialData.options.seus[0].energyResource
        : undefined,
    [initialData],
  );

  const initialMeterSliceEnergyResource = useMemo(
    () =>
      initialData?.options?.type === "METER_SLICE"
        ? initialData.options.meterSlices[0].energyResource
        : undefined,
    [initialData],
  );

  const inputSeuIds = useInput(initialSeuIds);

  const inputSeuEnergyResource = useInput(initialSeuEnergyResource);

  const inputMeterSliceEnergyResource = useInput(
    initialMeterSliceEnergyResource,
  );

  const handleSeuEnergyResourceChange = useCallback(
    (value: IDtoEEnergyResource | undefined) => {
      inputSeuEnergyResource.onChange(value);
      inputSeuIds.onChange([]);
    },
    [inputSeuEnergyResource, inputSeuIds],
  );

  const handleMeterSliceEnergyResourceChange = useCallback(
    (value: IDtoEEnergyResource | undefined) => {
      inputMeterSliceEnergyResource.onChange(value);
      inputMeterSliceIds.onChange([]);
    },
    [inputMeterSliceEnergyResource, inputMeterSliceIds],
  );

  const buildDataViewRequest = useCallback(():
    | IDtoDataViewProfileRequest
    | undefined => {
    if (!inputName.value || !inputType.value) {
      return undefined;
    }
    const base: Omit<IDtoDataViewProfileRequest, "options"> = {
      name: inputName.value,
      description: inputDescription.value || null,
    };

    switch (inputType.value) {
      case "METRIC":
        return {
          ...base,
          options: {
            metricIds: inputMetricIds.value,
            type: inputType.value,
          },
        };
      case "METER_SLICE":
        return {
          ...base,
          options: {
            meterSliceIds: inputMeterSliceIds.value,
            type: inputType.value,
            energyResource: inputMeterSliceEnergyResource.value!,
          },
        };
      case "SEU":
        if (!inputSeuEnergyResource.value) {
          return undefined;
        }
        return {
          ...base,
          options: {
            seuIds: inputSeuIds.value,
            type: inputType.value,
            energyResource: inputSeuEnergyResource.value,
          },
        };
      default:
        return undefined;
    }
  }, [
    inputName.value,
    inputType.value,
    inputDescription.value,
    inputMetricIds.value,
    inputMeterSliceIds.value,
    inputMeterSliceEnergyResource.value,
    inputSeuEnergyResource.value,
    inputSeuIds.value,
  ]);

  const baseFormInvalid = useInputInvalid(
    inputName,
    inputDescription,
    inputType,
  );

  const invalidMetricForm = useInputInvalid(inputMetricIds);

  const invalidMeterSliceForm = useInputInvalid(
    inputMeterSliceIds,
    inputMeterSliceEnergyResource,
  );

  const invalidSeuForm = useInputInvalid(inputSeuIds, inputSeuEnergyResource);

  const invalid = useMemo(
    () =>
      baseFormInvalid ||
      (inputType.value === "METRIC" && invalidMetricForm) ||
      (inputType.value === "METER_SLICE" && invalidMeterSliceForm) ||
      (inputType.value === "SEU" && invalidSeuForm),
    [
      baseFormInvalid,
      inputType.value,
      invalidMetricForm,
      invalidMeterSliceForm,
      invalidSeuForm,
    ],
  );

  const handleSubmit = useCallback(async () => {
    const data = buildDataViewRequest();
    if (invalid || !data || !inputName.value || !inputType.value) {
      return;
    }
    await onSubmit(data);
  }, [
    buildDataViewRequest,
    inputName.value,
    inputType.value,
    invalid,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("name")} invalidMsg={inputName.invalidMsg}>
          <CInputString {...inputName} placeholder={t("name")} required />
        </CFormLine>

        <CFormLine label={t("metricType")} invalidMsg={inputType.invalidMsg}>
          <CComboboxDataViewType {...inputType} required />
        </CFormLine>

        {inputType.value === "METRIC" && (
          <CFormLine
            label={t("metrics")}
            invalidMsg={inputMetricIds.invalidMsg}
          >
            <CMultiSelectMetric {...inputMetricIds} required />
          </CFormLine>
        )}

        {inputType.value === "METER_SLICE" && (
          <>
            <CFormLine
              label={t("energyResource")}
              invalidMsg={inputMeterSliceEnergyResource.invalidMsg}
            >
              <CComboboxEnergyResource
                {...inputMeterSliceEnergyResource}
                onChange={handleMeterSliceEnergyResourceChange}
                required
              />
            </CFormLine>
            {inputMeterSliceEnergyResource.value && (
              <CFormLine
                label={t("meters")}
                invalidMsg={inputMeterSliceIds.invalidMsg}
              >
                <CMultiSelectMeterSlice
                  energyResource={inputMeterSliceEnergyResource.value}
                  {...inputMeterSliceIds}
                  includeMains
                  required
                />
              </CFormLine>
            )}
          </>
        )}

        {inputType.value === "SEU" && (
          <>
            <CFormLine
              label={t("energyResource")}
              invalidMsg={inputSeuEnergyResource.invalidMsg}
            >
              <CComboboxEnergyResource
                {...inputSeuEnergyResource}
                onChange={handleSeuEnergyResourceChange}
                required
              />
            </CFormLine>

            {inputSeuEnergyResource.value && (
              <CFormLine
                label={t("significantEnergyUsers")}
                invalidMsg={inputSeuIds.invalidMsg}
              >
                <CMultiSelectSeu
                  filterByEnergyResource={inputSeuEnergyResource.value}
                  {...inputSeuIds}
                  required
                />
              </CFormLine>
            )}
          </>
        )}

        <CFormLine
          label={t("description")}
          invalidMsg={inputDescription.invalidMsg}
        >
          <CInputTextarea
            {...inputDescription}
            placeholder={t("description")}
          />
        </CFormLine>

        <CFormFooterSaveUpdate
          isUpdate={Boolean(initialData)}
          disabled={invalid}
        />
      </CFormPanel>
    </CForm>
  );
}
