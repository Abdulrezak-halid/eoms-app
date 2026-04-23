import { useCallback, useState } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CComboboxJobHandler } from "@m/base/components/CComboboxJobHandler";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CCombobox } from "@m/core/components/CCombobox";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputDatetime } from "@m/core/components/CInputDatetime";
import { CInputJson } from "@m/core/components/CInputJson";
import { CInputNumber } from "@m/core/components/CInputNumber";
import { CInputString } from "@m/core/components/CInputString";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useMapToComboList } from "@m/core/hooks/useMapToComboList";

import { useScheduleTypeMap } from "../hooks/useScheduleType";
import {
  IDtoJobListResponse,
  IDtoJobScheduleRequest,
} from "../interfaces/IDtoServiceJob";

export function CJobScheduleForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoJobListResponse;
  onSubmit: (data: IDtoJobScheduleRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const scheduleMap = useScheduleTypeMap();
  const typeList = useMapToComboList(scheduleMap);

  const [valueParam, setValueParam] = useState<unknown>(
    () => initialData?.meta.param || {},
  );

  const inputName = useInput(initialData?.meta.name);
  const inputType = useInput(initialData?.meta.type);
  const inputRule = useInput(
    initialData?.meta.type === "CRON" ? initialData.meta.rule : "",
  );
  const inputPriority = useInput(
    initialData?.meta.type === "CRON" ? initialData.meta.priority : undefined,
  );
  const inputDatetime = useInput(
    initialData?.meta.type === "ONE_TIME"
      ? initialData.meta.datetime
      : undefined,
  );

  const invalidBase = useInputInvalid(inputName, inputType);
  const invalid =
    invalidBase ||
    (inputType.value === "CRON" && !inputRule.value) ||
    (inputType.value === "ONE_TIME" && !inputDatetime.value);

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputType.value ||
      !inputName.value ||
      !inputDatetime.value
    ) {
      return;
    }

    switch (inputType.value) {
      case "CRON": {
        await onSubmit({
          name: inputName.value,
          param: valueParam,
          type: inputType.value,
          rule: inputRule.value,
          priority: inputPriority.value,
        });
        return;
      }
      case "ONE_TIME": {
        await onSubmit({
          name: inputName.value,
          param: valueParam,
          type: inputType.value,
          datetime: inputDatetime.value,
        });
        return;
      }
      case "IMMEDIATE": {
        await onSubmit({
          name: inputName.value,
          param: valueParam,
          type: inputType.value,
        });
        return;
      }
    }
  }, [
    invalid,
    inputType.value,
    valueParam,
    inputName.value,
    inputRule.value,
    inputDatetime.value,
    inputPriority.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("name")} invalidMsg={inputName.invalidMsg}>
          <CComboboxJobHandler {...inputName} required />
        </CFormLine>

        <CFormLine label={t("parameter")}>
          <CInputJson value={valueParam} onChange={setValueParam} />
        </CFormLine>

        <CFormLine label={t("type")} invalidMsg={inputType.invalidMsg}>
          <CCombobox
            list={typeList}
            {...inputType}
            placeholder={t("type")}
            required
          />
        </CFormLine>

        {inputType.value === "CRON" && (
          <>
            <CFormLine label={t("rule")} invalidMsg={inputRule.invalidMsg}>
              <CInputString
                {...inputRule}
                placeholder={`${t("example")}: 0 * * * *`}
                required
              />
            </CFormLine>
            <CFormLine
              label={t("priority")}
              invalidMsg={inputPriority.invalidMsg}
            >
              <CInputNumber {...inputPriority} placeholder={t("priority")} />
            </CFormLine>
          </>
        )}

        {inputType.value === "ONE_TIME" && (
          <CFormLine
            label={t("datetime")}
            invalidMsg={inputDatetime.invalidMsg}
          >
            <CInputDatetime {...inputDatetime} required />
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
