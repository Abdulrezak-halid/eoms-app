import { useCallback, useEffect } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CMultiSelectDepartment } from "@m/base/components/CMultiSelectDepartment";
import { CMultiSelectOrganizationEnergyResource } from "@m/base/components/CMultiSelectOrganizationEnergyResource";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputMultiString } from "@m/core/components/CInputMultiString";
import { CInputString } from "@m/core/components/CInputString";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useLoader } from "@m/core/hooks/useLoader";

import {
  IDtoScopeAndLimitsRequest,
  IDtoScopeAndLimitsResponse,
} from "../interfaces/IDtoScopeAndLimits";
import { CInputTextarea } from "@m/core/components/CInputTextarea";

export function CScopeAndLimitsForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoScopeAndLimitsResponse;
  onSubmit: (data: IDtoScopeAndLimitsRequest) => Promise<void>;
}) {
  const { t } = useTranslation();
  const fetchOrganizationAddress = useCallback(
    () => Api.GET("/u/organization"),
    [],
  );
  const [organizationData] = useLoader(fetchOrganizationAddress);

  const inputPhysicalLimits = useInput(initialData?.physicalLimits);
  const inputExcludedResources = useInput(initialData?.excludedResources);
  const inputExcludedResourceReason = useInput(
    initialData?.excludedResourceReason,
  );

  const inputProducts = useInput(initialData?.products);
  const inputDepartmentIds = useInput(
    initialData?.departments.map((d) => d.id) || [],
  );

  useEffect(() => {
    // Need to set callback like this to avoid eslint dependency warning
    const setPhysicalLimits = inputPhysicalLimits.setValue;
    if (!initialData && organizationData?.payload?.address) {
      setPhysicalLimits(organizationData.payload.address);
    }
  }, [
    initialData,
    organizationData?.payload?.address,
    inputPhysicalLimits.setValue,
  ]);

  const invalid = useInputInvalid(
    inputPhysicalLimits,
    inputExcludedResources,
    inputExcludedResourceReason,
    inputProducts,
    inputDepartmentIds,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputPhysicalLimits.value ||
      !inputExcludedResources.value ||
      !inputExcludedResourceReason.value ||
      !inputProducts.value ||
      !inputDepartmentIds.value
    ) {
      return;
    }

    const body = {
      physicalLimits: inputPhysicalLimits.value,
      excludedResources: inputExcludedResources.value,
      excludedResourceReason: inputExcludedResourceReason.value,
      products: inputProducts.value,
      departmentIds: inputDepartmentIds.value,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputPhysicalLimits.value,
    inputExcludedResources.value,
    inputExcludedResourceReason.value,
    inputProducts.value,
    inputDepartmentIds.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine
          label={t("physicalLimits")}
          invalidMsg={inputPhysicalLimits.invalidMsg}
        >
          <CAsyncLoader data={organizationData} inline>
            {() => (
              <CInputString
                {...inputPhysicalLimits}
                placeholder={t("physicalLimits")}
                required
              />
            )}
          </CAsyncLoader>
        </CFormLine>

        <CFormLine
          label={t("excludedResources")}
          invalidMsg={inputExcludedResources.invalidMsg}
        >
          <CMultiSelectOrganizationEnergyResource
            {...inputExcludedResources}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("excludedResourceReason")}
          invalidMsg={inputExcludedResourceReason.invalidMsg}
        >
          <CInputTextarea
            {...inputExcludedResourceReason}
            placeholder={t("excludedResourceReason")}
            required
          />
        </CFormLine>

        <CFormLine label={t("products")} invalidMsg={inputProducts.invalidMsg}>
          <CInputMultiString
            {...inputProducts}
            placeholder={t("products")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("departmentMulti")}
          invalidMsg={inputDepartmentIds.invalidMsg}
        >
          <CMultiSelectDepartment {...inputDepartmentIds} required />
        </CFormLine>

        <CFormFooterSaveUpdate
          isUpdate={Boolean(initialData)}
          disabled={invalid}
        />
      </CFormPanel>
    </CForm>
  );
}
