import { useCallback } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CComboboxUser } from "@m/base/components/CComboboxUser";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CCombobox } from "@m/core/components/CCombobox";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputDate } from "@m/core/components/CInputDate";
import { CInputString } from "@m/core/components/CInputString";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useMapToComboList } from "@m/core/hooks/useMapToComboList";
import {
  IDtoTrainingRequest,
  IDtoTrainingResponse,
} from "@m/support/interfaces/IDtoTraining";

import { useTrainingMap } from "../hooks/useTrainingCategory";

export function CTrainingForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoTrainingResponse;
  onSubmit: (data: IDtoTrainingRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const trainingMap = useTrainingMap();
  const categoryList = useMapToComboList(trainingMap);

  const inputTitle = useInput(initialData?.title);
  const inputDate = useInput(initialData?.date);
  const inputCategory = useInput(initialData?.category);
  const inputTrainerUser = useInput(initialData?.trainerUser?.id);

  const invalid = useInputInvalid(
    inputTitle,
    inputDate,
    inputCategory,
    inputTrainerUser,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputTitle.value ||
      !inputDate.value ||
      !inputCategory.value ||
      !inputTrainerUser.value
    ) {
      return;
    }

    const body = {
      title: inputTitle.value,
      date: inputDate.value,
      category: inputCategory.value,
      trainerUserId: inputTrainerUser.value,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputTitle.value,
    inputDate.value,
    inputCategory.value,
    inputTrainerUser.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("title")} invalidMsg={inputTitle.invalidMsg}>
          <CInputString {...inputTitle} placeholder={t("title")} required />
        </CFormLine>

        <CFormLine label={t("date")} invalidMsg={inputDate.invalidMsg}>
          <CInputDate {...inputDate} placeholder={t("date")} required />
        </CFormLine>

        <CFormLine label={t("category")} invalidMsg={inputCategory.invalidMsg}>
          <CCombobox
            list={categoryList}
            {...inputCategory}
            placeholder={t("category")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("trainerUser")}
          invalidMsg={inputTrainerUser.invalidMsg}
        >
          <CComboboxUser
            {...inputTrainerUser}
            placeholder={t("trainerUser")}
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
