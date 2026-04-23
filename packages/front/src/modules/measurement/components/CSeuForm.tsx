import { IDtoEEnergyResource } from "common/build-api-schema";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { CComboboxOrganizationEnergyResource } from "@m/base/components/CComboboxOrganizationEnergyResource";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputString } from "@m/core/components/CInputString";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  IDtoSeuRequest,
  IDtoSeuResponse,
  IDtoSeuSuggestion,
} from "../interfaces/IDtoSeu";
import { CSeuDepartmentAndMeterSliceChecklist } from "./CSeuDepartmentAndMeterSliceChecklist";

export function CSeuForm({
  initialData,
  prefillData,
  onSubmit,
}: {
  initialData?: IDtoSeuResponse;
  prefillData?: IDtoSeuSuggestion;
  onSubmit: (data: IDtoSeuRequest) => Promise<void>;
}) {
  const { t } = useTranslation();
  const prevPrefillDataRef = useRef<IDtoSeuSuggestion | undefined>(undefined);

  const initialTreeState = useMemo(() => {
    if (initialData) {
      const departmentIds = initialData.departments.map((d) => d.id);
      const meterSliceIds = initialData.meterSlices
        .filter((m) => !departmentIds.includes(m.departmentId))
        .map((m) => m.id);
      return { departmentIds, meterSliceIds };
    }
    if (prefillData) {
      return {
        departmentIds: [],
        meterSliceIds: prefillData.meterSlices.map((d) => d.id),
      };
    }
    return { departmentIds: [], meterSliceIds: [] };
  }, [initialData, prefillData]);

  const inputName = useInput(initialData?.name || "");
  const inputEnergyResource = useInput<IDtoEEnergyResource | undefined>(
    initialData?.energyResource,
  );

  const inputTree = useInput(initialTreeState);

  const invalidForm = useInputInvalid(inputName, inputEnergyResource);

  useEffect(() => {
    if (prefillData && prefillData !== prevPrefillDataRef.current) {
      prevPrefillDataRef.current = prefillData;
      inputName.onChange(prefillData.name);
      inputEnergyResource.onChange(prefillData.energyResource);
      inputTree.onChange({
        departmentIds: [],
        meterSliceIds: prefillData.meterSlices.map((d) => d.id),
      });
    }
  }, [prefillData, inputName, inputEnergyResource, inputTree]);

  const handleEnergyResourceChange = useCallback(
    (value: IDtoEEnergyResource | undefined) => {
      inputEnergyResource.onChange(value);
      inputTree.onChange({ departmentIds: [], meterSliceIds: [] });
    },
    [inputEnergyResource, inputTree],
  );

  const invalid = invalidForm;

  const handleSubmit = useCallback(async () => {
    if (invalid || !inputName.value || !inputEnergyResource.value) {
      return;
    }

    const body = {
      name: inputName.value,
      energyResource: inputEnergyResource.value,
      departmentIds: inputTree.value.departmentIds,
      meterSliceIds: inputTree.value.meterSliceIds,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputName.value,
    inputEnergyResource.value,
    inputTree.value.departmentIds,
    inputTree.value.meterSliceIds,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("name")} invalidMsg={inputName.invalidMsg}>
          <CInputString {...inputName} placeholder={t("name")} required />
        </CFormLine>

        <CFormLine
          label={t("energyResources")}
          invalidMsg={inputEnergyResource.invalidMsg}
        >
          <CComboboxOrganizationEnergyResource
            {...inputEnergyResource}
            onChange={handleEnergyResourceChange}
            required
          />
        </CFormLine>

        {inputEnergyResource.value && (
          <CFormLine
            label={t("departmentsAndMeters")}
            invalidMsg={inputTree.invalidMsg}
          >
            <CSeuDepartmentAndMeterSliceChecklist
              {...inputTree}
              energyResource={inputEnergyResource.value}
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
