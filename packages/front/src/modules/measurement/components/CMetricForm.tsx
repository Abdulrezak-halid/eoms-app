import { UtilUnit } from "common";
import { IDtoEMetricType } from "common/build-api-schema";
import { useCallback, useMemo } from "react";

import { CComboboxUnitGroup } from "@m/base/components/CComboboxUnitGroup";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  IDtoMetricRequest,
  IDtoMetricResponse,
} from "../interfaces/IDtoMetric";
import { CComboboxMetricType } from "./CComboboxMetricType";

export function CMetricForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoMetricResponse;
  onSubmit: (data: IDtoMetricRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputName = useInput(initialData?.name);
  const inputUnitGroup = useInput(initialData?.unitGroup);
  const inputType = useInput(initialData?.type);
  const inputDescription = useInput(initialData?.description || "");

  const counterUnitGroups = useMemo(() => UtilUnit.getCounterUnitGroups(), []);

  const allowedUnitGroups = useMemo(() => {
    if (inputType.value === "COUNTER") {
      return counterUnitGroups;
    }
    return undefined;
  }, [inputType.value, counterUnitGroups]);

  const handleMetricTypeChange = useCallback(
    (newType: IDtoEMetricType | undefined) => {
      inputType.onChange(newType);

      if (newType === "COUNTER" && inputUnitGroup.value) {
        if (!counterUnitGroups.includes(inputUnitGroup.value)) {
          inputUnitGroup.onChange(undefined);
        }
      }
    },
    [inputType, inputUnitGroup, counterUnitGroups],
  );

  const invalid = useInputInvalid(
    inputName,
    inputType,
    inputUnitGroup,
    inputDescription,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputName.value ||
      !inputType.value ||
      !inputUnitGroup.value
    ) {
      return;
    }

    await onSubmit({
      name: inputName.value,
      type: inputType.value,
      unitGroup: inputUnitGroup.value,
      description: inputDescription.value || null,
    });
  }, [
    invalid,
    inputName.value,
    inputType.value,
    inputUnitGroup.value,
    inputDescription.value,
    onSubmit,
  ]);

  const isEditMode = Boolean(initialData);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("name")} invalidMsg={inputName.invalidMsg}>
          <CInputString {...inputName} placeholder={t("name")} required />
        </CFormLine>

        <CFormLine label={t("metricType")} invalidMsg={inputType.invalidMsg}>
          <CComboboxMetricType
            {...inputType}
            onChange={handleMetricTypeChange}
            disabled={isEditMode}
            required
          />
        </CFormLine>

        <CFormLine label={t("unit")} invalidMsg={inputUnitGroup.invalidMsg}>
          <CComboboxUnitGroup
            {...inputUnitGroup}
            unitGroups={allowedUnitGroups}
            disabled={isEditMode || !inputType.value}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("description")}
          invalidMsg={inputDescription.invalidMsg}
        >
          <CInputTextarea
            {...inputDescription}
            placeholder={t("description")}
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
