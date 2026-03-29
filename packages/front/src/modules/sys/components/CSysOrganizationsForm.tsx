import { MAX_API_STRING_LENGTH, WORKSPACE_REGEX } from "common";
import { useCallback } from "react";

import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CMultiSelectEnergyResource } from "@m/base/components/CMultiSelectEnergyResource";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CFormTitle } from "@m/core/components/CFormTitle";
import { CInputEmail } from "@m/core/components/CInputEmail";
import { CInputMultiPhone } from "@m/core/components/CInputMultiPhone";
import { CInputNumber } from "@m/core/components/CInputNumber";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  IDtoSysOrganizationsRequest,
  IDtoSysOrganizationsResponse,
} from "../interfaces/IDtoSysOrganizations";
import { CMultiSelectPlanFeature } from "./CMultiSelectPlanFeature";

export function CSysOrganizationsForm({
  initialData,
  onSubmit,
  showAdminFields = false,
}: {
  initialData?: IDtoSysOrganizationsResponse;
  onSubmit: (data: IDtoSysOrganizationsRequest) => Promise<void>;
  showAdminFields?: boolean;
}) {
  const { t } = useTranslation();

  const inputDisplayName = useInput(initialData?.displayName);
  const inputFullName = useInput(initialData?.fullName);
  const inputPhones = useInput(initialData?.phones);
  const inputEmail = useInput(initialData?.email);
  const inputWorkspace = useInput(initialData?.workspace);
  const inputEnergyResources = useInput(
    initialData?.config.energyResources || [],
  );
  const inputAddress = useInput(initialData?.address);
  const inputAdminEmail = useInput("");
  const inputAdminDisplayName = useInput("");
  const inputPlanMaxUserCount = useInput(initialData?.plan.maxUserCount);
  const inputPlanFeatures = useInput(initialData?.plan.features || []);

  const adminFieldsInvalid = useInputInvalid(
    inputAdminEmail,
    inputAdminDisplayName,
  );

  const baseFieldsInvalid = useInputInvalid(
    inputDisplayName,
    inputFullName,
    inputPhones,
    inputEmail,
    inputWorkspace,
    inputEnergyResources,
    inputAddress,
    inputPlanMaxUserCount,
    inputPlanFeatures,
  );
  const invalid = baseFieldsInvalid || (showAdminFields && adminFieldsInvalid);

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputDisplayName.value ||
      !inputFullName.value ||
      !inputPhones.value ||
      !inputEmail.value ||
      !inputEnergyResources.value ||
      !inputAddress.value ||
      !inputWorkspace.value ||
      inputPlanMaxUserCount.value === undefined ||
      !inputPlanFeatures.value
    ) {
      return;
    }

    const body = {
      displayName: inputDisplayName.value,
      fullName: inputFullName.value,
      workspace: inputWorkspace.value,
      adminEmail: "",
      phones: inputPhones.value,
      email: inputEmail.value,
      config: {
        energyResources: inputEnergyResources.value,
      },
      address: inputAddress.value,
      adminName: "",
      plan: {
        maxUserCount: inputPlanMaxUserCount.value,
        features: inputPlanFeatures.value,
      },
    };

    if (showAdminFields) {
      body.adminEmail = inputAdminEmail.value;
      body.adminName = inputAdminDisplayName.value;
    }

    await onSubmit(body);
  }, [
    invalid,
    inputDisplayName.value,
    inputFullName.value,
    inputWorkspace.value,
    inputPhones.value,
    inputEmail.value,
    inputEnergyResources.value,
    inputAddress.value,
    inputPlanMaxUserCount,
    inputPlanFeatures,
    showAdminFields,
    onSubmit,
    inputAdminEmail.value,
    inputAdminDisplayName.value,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormTitle value={t("informations")} />

        <CFormLine
          label={t("displayName")}
          invalidMsg={inputDisplayName.invalidMsg}
        >
          <CInputString
            {...inputDisplayName}
            placeholder={t("displayName")}
            max={MAX_API_STRING_LENGTH}
            required
          />
        </CFormLine>

        <CFormLine label={t("fullName")} invalidMsg={inputFullName.invalidMsg}>
          <CInputString
            {...inputFullName}
            placeholder={t("fullName")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("workspace")}
          invalidMsg={inputWorkspace.invalidMsg}
        >
          <CInputString
            {...inputWorkspace}
            placeholder={t("workspace")}
            regex={WORKSPACE_REGEX}
            required
          />
        </CFormLine>

        <CFormTitle value={t("contactInfo")} />

        <CFormLine label={t("phones")} invalidMsg={inputPhones.invalidMsg}>
          <CInputMultiPhone {...inputPhones} required />
        </CFormLine>

        <CFormLine label={t("email")} invalidMsg={inputEmail.invalidMsg}>
          <CInputEmail {...inputEmail} placeholder={t("email")} required />
        </CFormLine>

        <CFormLine label={t("address")} invalidMsg={inputAddress.invalidMsg}>
          <CInputTextarea
            {...inputAddress}
            placeholder={t("address")}
            required
          />
        </CFormLine>

        {showAdminFields && (
          <>
            <CFormTitle value={t("adminUser")} />

            <CFormLine
              label={t("adminEmail")}
              invalidMsg={inputAdminEmail.invalidMsg}
            >
              <CInputEmail
                {...inputAdminEmail}
                placeholder={t("adminEmail")}
                required
              />
            </CFormLine>

            <CFormLine
              label={t("adminDisplayName")}
              invalidMsg={inputAdminDisplayName.invalidMsg}
            >
              <CInputString
                {...inputAdminDisplayName}
                placeholder={t("adminDisplayName")}
                max={MAX_API_STRING_LENGTH}
                required
              />
            </CFormLine>
          </>
        )}

        <CFormTitle value={t("resourcesAndPlan")} />

        <CFormLine
          label={t("energyResources")}
          invalidMsg={inputEnergyResources.invalidMsg}
        >
          <CMultiSelectEnergyResource {...inputEnergyResources} required />
        </CFormLine>

        <CFormLine
          label={t("maxUserCount")}
          invalidMsg={inputPlanMaxUserCount.invalidMsg}
        >
          <CInputNumber
            {...inputPlanMaxUserCount}
            placeholder={t("maxUserCount")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("features")}
          invalidMsg={inputPlanFeatures.invalidMsg}
        >
          <CMultiSelectPlanFeature {...inputPlanFeatures} />
        </CFormLine>

        <CFormFooterSaveUpdate
          isUpdate={Boolean(initialData)}
          disabled={invalid}
        />
      </CFormPanel>
    </CForm>
  );
}
