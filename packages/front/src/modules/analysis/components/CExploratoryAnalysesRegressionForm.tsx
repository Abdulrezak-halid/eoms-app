import { IDtoEEnergyResource } from "common/build-api-schema";
import { useCallback, useEffect, useRef } from "react";
import { Play } from "lucide-react";

import { Api } from "@m/base/api/Api";
import { CComboboxOrganizationEnergyResource } from "@m/base/components/CComboboxOrganizationEnergyResource";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CButton } from "@m/core/components/CButton";
import { CForm } from "@m/core/components/CForm";
import { CFormFooter, CFormLine } from "@m/core/components/CFormPanel";
import { CInputDatetime } from "@m/core/components/CInputDatetime";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { CComboboxMetric } from "@m/measurement/components/CComboboxMetric";
import { CMultiSelectMeterSlice } from "@m/measurement/components/CMultiSelectMeterSlice";

import { IDtoRegressionResultItem } from "../interfaces/IDtoExploratoryAnalyses";

export function CExploratoryAnalysesRegressionForm({
  onSubmitSuccess,
  rerunData,
}: {
  onSubmitSuccess: () => Promise<void>;
  rerunData?: IDtoRegressionResultItem | null;
}) {
  const { t } = useTranslation();
  const apiToast = useApiToast();

  const inputMeterSliceIds = useInput<string[]>([]);
  const inputEnergyResource = useInput<IDtoEEnergyResource>();
  const inputDriverId = useInput<string>();
  const inputdatetimeStart = useInput<string>();
  const inputdatetimeEnd = useInput<string>();

  const invalid = useInputInvalid(
    inputMeterSliceIds,
    inputDriverId,
    inputdatetimeStart,
    inputdatetimeEnd,
    inputEnergyResource,
  );

  const lastLoadedRerunId = useRef<string | null>(null);

  useEffect(() => {
    if (!rerunData) {
      lastLoadedRerunId.current = null;
      return;
    }

    if (rerunData.id === lastLoadedRerunId.current) {
      return;
    }

    lastLoadedRerunId.current = rerunData.id;

    inputEnergyResource.setValue(rerunData.energyResource);
    inputMeterSliceIds.setValue(rerunData.meterSlices.map((slice) => slice.id));
    inputDriverId.setValue(rerunData.driver.id);
    inputdatetimeStart.setValue(rerunData.datetimeStart);
    inputdatetimeEnd.setValue(rerunData.datetimeEnd);
  }, [
    inputMeterSliceIds,
    inputEnergyResource,
    inputDriverId,
    inputdatetimeStart,
    inputdatetimeEnd,
    rerunData,
  ]);

  const handleEnergyResourceChange = useCallback(
    (value: IDtoEEnergyResource | undefined) => {
      if (value !== inputEnergyResource.value) {
        inputMeterSliceIds.onChange([]);
      }
      inputEnergyResource.onChange(value);
    },
    [inputEnergyResource, inputMeterSliceIds],
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputDriverId.value ||
      !inputdatetimeStart.value ||
      !inputdatetimeEnd.value ||
      !inputEnergyResource.value
    ) {
      return;
    }

    const res = await Api.POST("/u/analysis/linear-regression/commit", {
      body: {
        meterSliceIds: inputMeterSliceIds.value,
        driverId: inputDriverId.value,
        datetimeStart: inputdatetimeStart.value,
        datetimeEnd: inputdatetimeEnd.value,
      },
    });

    apiToast(res, { NOT_FOUND: t("insufficientDataToProcess") });

    if (!res.error) {
      await onSubmitSuccess();
    }
  }, [
    invalid,
    inputMeterSliceIds,
    inputEnergyResource,
    inputDriverId,
    inputdatetimeStart,
    inputdatetimeEnd,
    apiToast,
    onSubmitSuccess,
    t,
  ]);

  return (
    <CForm onSubmit={handleSubmit} className="mb-4">
      <div className="space-y-2">
        <CFormLine
          label={t("energyResources")}
          invalidMsg={inputEnergyResource.invalidMsg}
        >
          <CComboboxOrganizationEnergyResource
            value={inputEnergyResource.value}
            onChange={handleEnergyResourceChange}
            onInvalidMsg={inputEnergyResource.onInvalidMsg}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("meters")}
          invalidMsg={inputMeterSliceIds.invalidMsg}
        >
          <CMultiSelectMeterSlice
            {...inputMeterSliceIds}
            energyResource={inputEnergyResource.value}
            required
          />
        </CFormLine>

        <CFormLine label={t("driver")} invalidMsg={inputDriverId.invalidMsg}>
          <CComboboxMetric
            {...inputDriverId}
            excludeUnitGroup="ENERGY"
            required
          />
        </CFormLine>

        <CFormLine
          label={t("datetimeStart")}
          invalidMsg={inputdatetimeStart.invalidMsg}
        >
          <CInputDatetime
            {...inputdatetimeStart}
            max={inputdatetimeEnd.value}
            placeholder={t("datetimeStart")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("datetimeEnd")}
          invalidMsg={inputdatetimeEnd.invalidMsg}
        >
          <CInputDatetime
            {...inputdatetimeEnd}
            min={inputdatetimeStart.value}
            placeholder={t("datetimeEnd")}
            required
          />
        </CFormLine>

        <CFormFooter>
          <CButton
            icon={Play}
            primary
            label={t("run")}
            onClick={handleSubmit}
            disabled={invalid}
          />
        </CFormFooter>
      </div>
    </CForm>
  );
}
