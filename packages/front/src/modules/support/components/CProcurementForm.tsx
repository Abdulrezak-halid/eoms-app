import { MAX_API_NUMBER_VALUE } from "common";
import { useCallback } from "react";

import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputNumber } from "@m/core/components/CInputNumber";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  IDtoProcurementRequest,
  IDtoProcurementResponse,
} from "../interfaces/IDtoProcurement";

export function CProcurementForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoProcurementResponse;
  onSubmit: (data: IDtoProcurementRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputProduct = useInput(initialData?.product);
  const inputCategory = useInput(initialData?.category);
  const inputCriteriaList = useInput(initialData?.criteriaList);
  const inputSuggestedBrand = useInput(initialData?.suggestedBrand);
  const inputAdditionalSpecifications = useInput(
    initialData?.additionalSpecifications,
  );
  const inputPrice = useInput(initialData?.price);
  const inputAnnualMaintenanceCost = useInput(
    initialData?.annualMaintenanceCost,
  );
  const inputlifetimeYears = useInput(initialData?.lifetimeYears);

  const invalid = useInputInvalid(
    inputProduct,
    inputCategory,
    inputCriteriaList,
    inputSuggestedBrand,
    inputAdditionalSpecifications,
    inputPrice,
    inputAnnualMaintenanceCost,
    inputlifetimeYears,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputProduct.value ||
      !inputCategory.value ||
      !inputCriteriaList.value ||
      !inputSuggestedBrand.value ||
      !inputAdditionalSpecifications.value ||
      !inputPrice.value ||
      !inputAnnualMaintenanceCost.value ||
      !inputlifetimeYears.value
    ) {
      return;
    }

    const body = {
      product: inputProduct.value,
      category: inputCategory.value,
      criteriaList: inputCriteriaList.value,
      suggestedBrand: inputSuggestedBrand.value,
      additionalSpecifications: inputAdditionalSpecifications.value,
      price: inputPrice.value,
      annualMaintenanceCost: inputAnnualMaintenanceCost.value,
      lifetimeYears: inputlifetimeYears.value,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputProduct.value,
    inputCategory.value,
    inputCriteriaList.value,
    inputSuggestedBrand.value,
    inputAdditionalSpecifications.value,
    inputPrice.value,
    inputAnnualMaintenanceCost.value,
    inputlifetimeYears.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("product")} invalidMsg={inputProduct.invalidMsg}>
          <CInputString {...inputProduct} placeholder={t("product")} required />
        </CFormLine>

        <CFormLine label={t("category")} invalidMsg={inputCategory.invalidMsg}>
          <CInputString
            {...inputCategory}
            placeholder={t("category")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("criteriaList")}
          invalidMsg={inputCriteriaList.invalidMsg}
        >
          <CInputString
            {...inputCriteriaList}
            placeholder={t("criteriaList")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("suggestedBrand")}
          invalidMsg={inputSuggestedBrand.invalidMsg}
        >
          <CInputString
            {...inputSuggestedBrand}
            placeholder={t("suggestedBrand")}
            required
          />
        </CFormLine>

        <CFormLine label={t("price")} invalidMsg={inputPrice.invalidMsg}>
          <CInputNumber
            {...inputPrice}
            placeholder={t("price")}
            min={0}
            max={MAX_API_NUMBER_VALUE}
            float
            required
          />
        </CFormLine>

        <CFormLine
          label={t("annualMaintenanceCost")}
          invalidMsg={inputAnnualMaintenanceCost.invalidMsg}
        >
          <CInputNumber
            {...inputAnnualMaintenanceCost}
            placeholder={t("annualMaintenanceCost")}
            min={0}
            max={MAX_API_NUMBER_VALUE}
            float
            required
          />
        </CFormLine>

        <CFormLine
          label={t("lifetimeYears")}
          invalidMsg={inputlifetimeYears.invalidMsg}
        >
          <CInputNumber
            {...inputlifetimeYears}
            placeholder={t("lifetimeYears")}
            min={0}
            max={MAX_API_NUMBER_VALUE}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("additionalSpecifications")}
          invalidMsg={inputAdditionalSpecifications.invalidMsg}
        >
          <CInputTextarea
            {...inputAdditionalSpecifications}
            placeholder={t("additionalSpecifications")}
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
