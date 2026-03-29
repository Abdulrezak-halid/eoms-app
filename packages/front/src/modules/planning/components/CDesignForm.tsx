import { MAX_API_NUMBER_VALUE } from "common";
import { useCallback } from "react";

import { CComboboxUser } from "@m/base/components/CComboboxUser";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputNumber } from "@m/core/components/CInputNumber";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  IDtoDesignRequest,
  IDtoDesignResponse,
} from "../interfaces/IDtoDesign";

export function CDesignForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoDesignResponse;
  onSubmit: (data: IDtoDesignRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputName = useInput(initialData?.name);
  const inputNo = useInput(initialData?.no);
  const inputPurpose = useInput(initialData?.purpose);
  const inputImpact = useInput(initialData?.impact);
  const inputEstimatedSavings = useInput(initialData?.estimatedSavings);
  const inputEstimatedAdditionalCost = useInput(
    initialData?.estimatedAdditionalCost,
  );
  const inputEstimatedTurnaroundMonths = useInput(
    initialData?.estimatedTurnaroundMonths,
  );
  const inputLeaderUser = useInput(initialData?.leaderUser.id);
  const inputPotentialNonEnergyBenefits = useInput(
    initialData?.potentialNonEnergyBenefits,
  );

  const invalidForm = useInputInvalid(
    inputName,
    inputNo,
    inputPurpose,
    inputImpact,
    inputEstimatedSavings,
    inputEstimatedAdditionalCost,
    inputEstimatedTurnaroundMonths,
    inputLeaderUser,
    inputPotentialNonEnergyBenefits,
  );
  const invalid = invalidForm;

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputName.value ||
      !inputNo.value ||
      !inputPurpose.value ||
      !inputImpact.value ||
      !inputEstimatedSavings.value ||
      !inputEstimatedAdditionalCost.value ||
      !inputEstimatedTurnaroundMonths.value ||
      !inputLeaderUser.value ||
      !inputPotentialNonEnergyBenefits.value
    ) {
      return;
    }

    const body = {
      name: inputName.value,
      no: inputNo.value,
      purpose: inputPurpose.value,
      impact: inputImpact.value,
      estimatedSavings: inputEstimatedSavings.value,
      estimatedAdditionalCost: inputEstimatedAdditionalCost.value,
      estimatedTurnaroundMonths: inputEstimatedTurnaroundMonths.value,
      leaderUserId: inputLeaderUser.value,
      potentialNonEnergyBenefits: inputPotentialNonEnergyBenefits.value,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputName.value,
    inputNo.value,
    inputPurpose.value,
    inputImpact.value,
    inputEstimatedSavings.value,
    inputEstimatedAdditionalCost.value,
    inputEstimatedTurnaroundMonths.value,
    inputLeaderUser.value,
    inputPotentialNonEnergyBenefits.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("name")} invalidMsg={inputName.invalidMsg}>
          <CInputString {...inputName} placeholder={t("name")} required />
        </CFormLine>

        <CFormLine label={t("no")} invalidMsg={inputNo.invalidMsg}>
          <CInputNumber
            {...inputNo}
            min={0}
            max={MAX_API_NUMBER_VALUE}
            placeholder={t("no")}
            required
          />
        </CFormLine>

        <CFormLine label={t("purpose")} invalidMsg={inputPurpose.invalidMsg}>
          <CInputString {...inputPurpose} placeholder={t("purpose")} required />
        </CFormLine>

        <CFormLine label={t("impact")} invalidMsg={inputImpact.invalidMsg}>
          <CInputString {...inputImpact} placeholder={t("impact")} required />
        </CFormLine>

        <CFormLine
          label={t("estimatedSavings")}
          invalidMsg={inputEstimatedSavings.invalidMsg}
        >
          <CInputNumber
            {...inputEstimatedSavings}
            min={0}
            max={MAX_API_NUMBER_VALUE}
            placeholder={t("estimatedSavings")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("estimatedAdditionalCost")}
          invalidMsg={inputEstimatedAdditionalCost.invalidMsg}
        >
          <CInputNumber
            {...inputEstimatedAdditionalCost}
            min={0}
            max={MAX_API_NUMBER_VALUE}
            placeholder={t("estimatedAdditionalCost")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("estimatedTurnaroundMonths")}
          invalidMsg={inputEstimatedTurnaroundMonths.invalidMsg}
        >
          <CInputNumber
            {...inputEstimatedTurnaroundMonths}
            min={0}
            max={MAX_API_NUMBER_VALUE}
            placeholder={t("estimatedTurnaroundMonths")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("projectLeader")}
          invalidMsg={inputLeaderUser.invalidMsg}
        >
          <CComboboxUser {...inputLeaderUser} required />
        </CFormLine>

        <CFormLine
          label={t("potentialNonEnergyBenefits")}
          invalidMsg={inputPotentialNonEnergyBenefits.invalidMsg}
        >
          <CInputTextarea
            {...inputPotentialNonEnergyBenefits}
            placeholder={t("potentialNonEnergyBenefits")}
            required
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
