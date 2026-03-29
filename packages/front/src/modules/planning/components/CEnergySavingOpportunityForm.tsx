import { MAX_API_NUMBER_VALUE } from "common";
import { IDtoEEnergyResource } from "common/build-api-schema";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CComboboxDocumentApprovementStatus } from "@m/base/components/CComboboxDocumentApprovementStatus";
import { CComboboxUser } from "@m/base/components/CComboboxUser";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CMultiSelectSeu } from "@m/base/components/CMultiSelectSeu";
import { allEnergyResourceTypes } from "@m/base/utils/allEnergyResourceTypes";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputNumber } from "@m/core/components/CInputNumber";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useLoader } from "@m/core/hooks/useLoader";

import {
  IDtoEnergySavingOpportunityRequest,
  IDtoEnergySavingOpportunityResponse,
} from "../interfaces/IDtoEnergySavingOpportunity";
import { CEnergyResourceInputs } from "./CEnergyResourceInputs";

export function CEnergySavingOpportunityForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoEnergySavingOpportunityResponse;
  onSubmit: (data: IDtoEnergySavingOpportunityRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputName = useInput(initialData?.name);
  const inputInvestmentApplicationPeriodMonth = useInput(
    initialData?.investmentApplicationPeriodMonth,
  );
  const inputResponsibleUserId = useInput(initialData?.responsibleUser.id);
  const inputApprovementStatus = useInput(initialData?.approvementStatus);
  const inputNotes = useInput(initialData?.notes || "");
  const inputSeuIds = useInput(initialData?.seus.map((d) => d.id));
  const inputInvestmentBudget = useInput(initialData?.investmentBudget);
  const inputPaybackMonth = useInput(initialData?.paybackMonth);
  const inputCalculationMethodOfPayback = useInput(
    initialData?.calculationMethodOfPayback || "",
  );

  const inputEstimatedBudgetSaving = useInput(
    initialData?.estimatedBudgetSaving,
  );

  const loader = useCallback(() => {
    return Api.GET("/u/organization/energy-resources");
  }, []);

  const [energyResourcesData] = useLoader(loader);

  const getInitialEnergyResourceValues = (): Record<
    IDtoEEnergyResource,
    number
  > => {
    const initialValues: Record<IDtoEEnergyResource, number> = {} as Record<
      IDtoEEnergyResource,
      number
    >;

    allEnergyResourceTypes.forEach((resource) => {
      initialValues[resource] = 0;
    });

    if (
      initialData?.estimatedSavings &&
      Array.isArray(initialData.estimatedSavings)
    ) {
      initialData.estimatedSavings.forEach((saving) => {
        if (
          saving &&
          saving.energyResource &&
          typeof saving.value === "number"
        ) {
          initialValues[saving.energyResource] = saving.value;
        }
      });
    }

    return initialValues;
  };

  const [energyResourceValues, setEnergyResourceValues] = useState<
    Record<IDtoEEnergyResource, number | undefined>
  >(getInitialEnergyResourceValues);

  const [energyResourceInvalidMsgs, setEnergyResourceInvalidMsgs] = useState<
    Record<IDtoEEnergyResource, string>
  >({} as Record<IDtoEEnergyResource, string>);

  useEffect(() => {
    if (energyResourcesData?.payload?.energyResources) {
      const availableResources = energyResourcesData.payload.energyResources;

      setEnergyResourceValues((prevValues) => {
        const newValues = { ...prevValues };

        allEnergyResourceTypes.forEach((resource) => {
          if (!availableResources.includes(resource)) {
            newValues[resource] = 0;
          }
        });

        return newValues;
      });
    }
  }, [energyResourcesData]);

  const hasAtLeastOneResource = useMemo(() => {
    return allEnergyResourceTypes.some(
      (resource) => (energyResourceValues[resource] || 0) > 0,
    );
  }, [energyResourceValues]);

  const hasEnergyResourceErrors = useMemo(() => {
    return allEnergyResourceTypes.some(
      (resource) =>
        energyResourceInvalidMsgs[resource] &&
        energyResourceInvalidMsgs[resource].length > 0,
    );
  }, [energyResourceInvalidMsgs]);

  const invalid = useInputInvalid(
    inputName,
    inputInvestmentApplicationPeriodMonth,
    inputResponsibleUserId,
    inputApprovementStatus,
    inputSeuIds,
  );

  const isLoadingResources = !energyResourcesData?.payload;

  const handleEnergyResourceChange = useCallback(
    (energyResource: IDtoEEnergyResource, value: number | undefined) => {
      setEnergyResourceValues((prev) => ({
        ...prev,
        [energyResource]: value,
      }));
    },
    [],
  );

  const handleEnergyResourceInvalidMsg = useCallback(
    (resource: IDtoEEnergyResource) => (msg: string) => {
      setEnergyResourceInvalidMsgs((prev) => ({
        ...prev,
        [resource]: msg,
      }));
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputName.value ||
      !inputInvestmentApplicationPeriodMonth.value ||
      !inputResponsibleUserId.value ||
      !inputApprovementStatus.value ||
      !inputSeuIds.value ||
      !hasAtLeastOneResource ||
      hasEnergyResourceErrors
    ) {
      return;
    }

    const availableResources =
      energyResourcesData?.payload?.energyResources || [];
    const estimatedSavings: Array<{
      energyResource: IDtoEEnergyResource;
      value: number;
    }> = [];

    allEnergyResourceTypes.forEach((resource) => {
      const value = Number(energyResourceValues[resource]) || 0;
      if (value > 0 && availableResources.includes(resource)) {
        estimatedSavings.push({
          energyResource: resource,
          value: value,
        });
      }
    });

    await onSubmit({
      name: inputName.value,
      investmentApplicationPeriodMonth:
        inputInvestmentApplicationPeriodMonth.value || 0,
      responsibleUserId: inputResponsibleUserId.value || "",
      approvementStatus: inputApprovementStatus.value,
      notes: inputNotes.value || null,
      seuIds: inputSeuIds.value || [],
      investmentBudget: inputInvestmentBudget.value || 0,
      paybackMonth: inputPaybackMonth.value || 0,
      calculationMethodOfPayback: inputCalculationMethodOfPayback.value || "",
      estimatedSavings: estimatedSavings,
      estimatedBudgetSaving: inputEstimatedBudgetSaving.value || 0,
    });
  }, [
    invalid,
    inputName.value,
    inputInvestmentApplicationPeriodMonth.value,
    inputResponsibleUserId.value,
    inputApprovementStatus.value,
    inputNotes.value,
    inputSeuIds.value,
    inputInvestmentBudget.value,
    inputPaybackMonth.value,
    inputCalculationMethodOfPayback.value,
    inputEstimatedBudgetSaving.value,
    energyResourcesData?.payload?.energyResources,
    energyResourceValues,
    hasAtLeastOneResource,
    hasEnergyResourceErrors,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("name")} invalidMsg={inputName.invalidMsg}>
          <CInputString {...inputName} placeholder={t("name")} required />
        </CFormLine>
        <CFormLine
          label={t("investmentApplicationPeriodMonth")}
          invalidMsg={inputInvestmentApplicationPeriodMonth.invalidMsg}
        >
          <CInputNumber
            {...inputInvestmentApplicationPeriodMonth}
            placeholder={t("investmentApplicationPeriodMonth")}
            min={0}
            max={MAX_API_NUMBER_VALUE}
            required
          />
        </CFormLine>
        <CFormLine
          label={t("responsibleUser")}
          invalidMsg={inputResponsibleUserId.invalidMsg}
        >
          <CComboboxUser {...inputResponsibleUserId} required />
        </CFormLine>
        <CFormLine
          label={t("approvementStatus")}
          invalidMsg={inputApprovementStatus.invalidMsg}
        >
          <CComboboxDocumentApprovementStatus
            {...inputApprovementStatus}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("significantEnergyUsers")}
          invalidMsg={inputSeuIds.invalidMsg}
        >
          <CMultiSelectSeu {...inputSeuIds} required />
        </CFormLine>
        <CFormLine
          label={t("investmentBudget")}
          invalidMsg={inputInvestmentBudget.invalidMsg}
        >
          <CInputNumber
            {...inputInvestmentBudget}
            placeholder={t("investmentBudget")}
            min={0}
            max={MAX_API_NUMBER_VALUE}
            required
          />
        </CFormLine>
        <CFormLine
          label={t("paybackMonth")}
          invalidMsg={inputPaybackMonth.invalidMsg}
        >
          <CInputNumber
            {...inputPaybackMonth}
            placeholder={t("paybackMonth")}
            min={0}
            max={MAX_API_NUMBER_VALUE}
            required
          />
        </CFormLine>
        <CFormLine
          label={t("calculationMethodOfPayback")}
          invalidMsg={inputCalculationMethodOfPayback.invalidMsg}
        >
          <CInputString
            {...inputCalculationMethodOfPayback}
            placeholder={t("calculationMethodOfPayback")}
            required
          />
        </CFormLine>
        <CFormLine
          label={t("estimatedBudgetSaving")}
          invalidMsg={inputEstimatedBudgetSaving.invalidMsg}
        >
          <CInputNumber
            {...inputEstimatedBudgetSaving}
            placeholder={t("estimatedBudgetSaving")}
            min={0}
            max={MAX_API_NUMBER_VALUE}
            required
          />
        </CFormLine>
        <CFormLine label={t("notes")} invalidMsg={inputNotes.invalidMsg}>
          <CInputTextarea {...inputNotes} placeholder={t("notes")} />
        </CFormLine>
        <CFormLine
          label={t("estimatedSavings")}
          invalidMsg={
            !hasAtLeastOneResource ? t("atLeastOneResourceRequired") : ""
          }
        >
          <CAsyncLoader inline data={energyResourcesData}>
            {(data) => (
              <CEnergyResourceInputs
                availableResources={data.energyResources}
                values={energyResourceValues}
                onChange={handleEnergyResourceChange}
                onInvalidMsg={handleEnergyResourceInvalidMsg}
                hasError={!hasAtLeastOneResource && invalid}
              />
            )}
          </CAsyncLoader>
        </CFormLine>

        <CFormFooterSaveUpdate
          isUpdate={Boolean(initialData)}
          disabled={
            invalid ||
            !hasAtLeastOneResource ||
            isLoadingResources ||
            hasEnergyResourceErrors
          }
        />
      </CFormPanel>
    </CForm>
  );
}
