import { MAX_API_NUMBER_VALUE, MAX_YEAR, MIN_YEAR, UtilUnit } from "common";
import { useCallback, useMemo } from "react";

import { CComboboxOrganizationEnergyResource } from "@m/base/components/CComboboxOrganizationEnergyResource";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputNumber } from "@m/core/components/CInputNumber";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  IDtoTargetRequest,
  IDtoTargetResponse,
} from "../interfaces/IDtoTarget";

export function CTargetForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoTargetResponse;
  onSubmit: (data: IDtoTargetRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputYear = useInput(initialData?.year);
  const inputResource = useInput(initialData?.energyResource);
  const inputConsumption = useInput(initialData?.consumption);
  const inputPercentage = useInput(initialData?.percentage);

  const invalid = useInputInvalid(
    inputYear,
    inputResource,
    inputConsumption,
    inputPercentage,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputYear.value ||
      inputResource.value === undefined ||
      inputConsumption.value === undefined ||
      inputPercentage.value === undefined
    ) {
      return;
    }

    const body = {
      year: inputYear.value,
      energyResource: inputResource.value,
      consumption: inputConsumption.value,
      percentage: inputPercentage.value,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputYear.value,
    inputResource.value,
    inputConsumption.value,
    inputPercentage.value,
    onSubmit,
  ]);

  const consumptionUnitAbbr = useMemo(
    () => UtilUnit.getAbbreviation("ENERGY_MWH", t),
    [t],
  );

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("year")} invalidMsg={inputYear.invalidMsg}>
          <CInputNumber
            min={MIN_YEAR}
            max={MAX_YEAR}
            {...inputYear}
            placeholder={t("year")}
            required
          />
        </CFormLine>

        <CFormLine
          label={`${t("consumption")} (${consumptionUnitAbbr})`}
          invalidMsg={inputConsumption.invalidMsg}
        >
          <CInputNumber
            min={0}
            max={MAX_API_NUMBER_VALUE}
            {...inputConsumption}
            placeholder={t("consumption")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("percentage")}
          invalidMsg={inputPercentage.invalidMsg}
        >
          <CInputNumber
            min={0}
            max={100}
            {...inputPercentage}
            placeholder={t("percentage")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("energyResource")}
          invalidMsg={inputResource.invalidMsg}
        >
          <CComboboxOrganizationEnergyResource
            {...inputResource}
            placeholder={t("energyResource")}
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
