import { IUnitGroup } from "common";
import { IDtoEEnergyResource } from "common/build-api-schema";
import { useCallback, useEffect, useMemo } from "react";

import { CBadgeUnitGroup } from "@m/base/components/CBadgeUnitGroup";
import { CComboboxDepartment } from "@m/base/components/CComboboxDepartment";
import { CComboboxOrganizationEnergyResource } from "@m/base/components/CComboboxOrganizationEnergyResource";
import { CComboboxUnitGroup } from "@m/base/components/CComboboxUnitGroup";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CCheckbox } from "@m/core/components/CCheckbox";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputNumber } from "@m/core/components/CInputNumber";
import { CInputString } from "@m/core/components/CInputString";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoMeterRequest, IDtoMeterResponse } from "../interfaces/IDtoMeter";
import { CComboboxMetric } from "./CComboboxMetric";

export function CMeterForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoMeterResponse;
  onSubmit: (data: IDtoMeterRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputName = useInput(initialData?.name);
  const inputEnergyResource = useInput(initialData?.energyResource);
  const inputUnitGroup = useInput<IUnitGroup | undefined>(
    initialData?.metric.unitGroup,
  );
  const inputEnergyConversionRate = useInput<number | undefined>(
    initialData?.energyConversionRate,
  );
  const inputMetricId = useInput(initialData?.metric.id);
  const inputDepartmentId = useInput<string | undefined>();
  const inputIsMain = useInput<boolean>(false);

  const { onChange: setEnergyResource } = inputEnergyResource;
  const { onChange: setUnitGroup } = inputUnitGroup;
  const { onChange: setEnergyConversionRate } = inputEnergyConversionRate;
  const { onChange: setMetricId } = inputMetricId;

  const isElectricResource = inputEnergyResource.value === "ELECTRIC";
  const isAddForm = !initialData;

  const invalidForm = useInputInvalid(
    inputEnergyResource,
    inputUnitGroup,
    inputEnergyConversionRate,
    inputMetricId,
  );
  const departmentFieldsInvalid = useInputInvalid(inputDepartmentId);
  const invalid = invalidForm || (isAddForm && departmentFieldsInvalid);

  useEffect(() => {
    if (inputEnergyResource.value === "ELECTRIC") {
      setUnitGroup("ENERGY");
    }
  }, [inputEnergyResource.value, setUnitGroup]);

  useEffect(() => {
    if (inputUnitGroup.value === "ENERGY") {
      setEnergyConversionRate(1);
    }
  }, [inputUnitGroup.value, setEnergyConversionRate]);

  const handleEnergyResourceChange = useCallback(
    (value: IDtoEEnergyResource | undefined) => {
      setEnergyResource(value);
      setUnitGroup(undefined);
      setEnergyConversionRate(undefined);
      setMetricId(undefined);
    },
    [setEnergyConversionRate, setEnergyResource, setMetricId, setUnitGroup],
  );

  const handleUnitGroupChange = useCallback(
    (value: IUnitGroup | undefined) => {
      setUnitGroup(value);
      setEnergyConversionRate(undefined);
      setMetricId(undefined);
    },
    [setEnergyConversionRate, setMetricId, setUnitGroup],
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputName.value ||
      !inputEnergyResource.value ||
      !inputMetricId.value ||
      !inputUnitGroup.value ||
      inputEnergyConversionRate.value === undefined
    ) {
      return;
    }

    const body = {
      name: inputName.value,
      energyResource: inputEnergyResource.value,
      metricId: inputMetricId.value,
      unitGroup: inputUnitGroup.value,
      energyConversionRate: inputEnergyConversionRate.value,
      departmentId: "",
      isMain: inputIsMain.value,
    };

    if (isAddForm && inputDepartmentId.value) {
      body.departmentId = inputDepartmentId.value;
    }

    await onSubmit(body);
  }, [
    invalid,
    inputEnergyResource.value,
    inputMetricId.value,
    inputUnitGroup.value,
    inputEnergyConversionRate.value,
    inputName.value,
    inputIsMain.value,
    isAddForm,
    inputDepartmentId.value,
    onSubmit,
  ]);

  const nonElectricityUnitGroups = useMemo<IUnitGroup[]>(
    () => ["ENERGY", "WEIGHT", "VOLUME"],
    [],
  );

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("name")} invalidMsg={inputName.invalidMsg}>
          <CInputString {...inputName} placeholder={t("name")} required />
        </CFormLine>

        <CFormLine
          label={t("energyResource")}
          invalidMsg={inputEnergyResource.invalidMsg}
        >
          <CComboboxOrganizationEnergyResource
            {...inputEnergyResource}
            onChange={handleEnergyResourceChange}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("unit")}
          invalidMsg={
            isElectricResource ? undefined : inputUnitGroup.invalidMsg
          }
        >
          {isElectricResource ? (
            <div className="py-2">
              <CBadgeUnitGroup value="ENERGY" />
            </div>
          ) : (
            <CComboboxUnitGroup
              {...inputUnitGroup}
              onChange={handleUnitGroupChange}
              unitGroups={nonElectricityUnitGroups}
              disabled={!inputEnergyResource.value}
              required
            />
          )}
        </CFormLine>

        <CFormLine
          label={t("energyConversionRate")}
          invalidMsg={inputEnergyConversionRate.invalidMsg}
        >
          <CInputNumber
            {...inputEnergyConversionRate}
            disabled={
              !inputUnitGroup.value || inputUnitGroup.value === "ENERGY"
            }
            placeholder={t("energyConversionRate")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("metric")}
          invalidMsg={inputMetricId.invalidMsg}
          info={t("msgMeterFormMetricFieldInfo")}
        >
          <CComboboxMetric
            {...inputMetricId}
            type="COUNTER"
            unitGroup={inputUnitGroup.value}
            excludedValueFromFilters={
              inputUnitGroup.value === initialData?.metric.unitGroup
                ? initialData?.metric.id
                : undefined
            }
            disabled={!inputUnitGroup.value}
            required
          />
        </CFormLine>

        {isAddForm && (
          <CFormLine
            label={t("department")}
            invalidMsg={inputDepartmentId.invalidMsg}
          >
            <CComboboxDepartment {...inputDepartmentId} required />
          </CFormLine>
        )}

        {isAddForm && (
          <CFormLine
            label={t("mainMeter")}
            info={t("msgMeterFormMainMeterInfo")}
          >
            <CCheckbox
              selected={inputIsMain.value}
              onChange={inputIsMain.onChange}
            />
          </CFormLine>
        )}

        <CFormFooterSaveUpdate
          isUpdate={Boolean(initialData)}
          disabled={invalid}
        />
      </CFormPanel>
    </CForm>
  );
}
