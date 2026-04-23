import { MAX_ISSUE_DESC, MIN_ISSUE_DESC } from "common";
import { IDtoEIssueType } from "common/build-api-schema";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CButton } from "@m/core/components/CButton";
import { CCombobox } from "@m/core/components/CCombobox";
import { CForm } from "@m/core/components/CForm";
import {
  CFormFooter,
  CFormLine,
  CFormPanel,
} from "@m/core/components/CFormPanel";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { CMessageCard } from "@m/core/components/CMessageCard";
import { ISelectListItem } from "@m/core/components/CSelectList";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";

export function CIssueReportRequest() {
  const { t } = useTranslation();

  const subjectList = useMemo<ISelectListItem<IDtoEIssueType>[]>(
    () => [
      {
        label: t("bugReport"),
        value: "BUG_REPORT",
      },
      {
        label: t("featureRequest"),
        value: "FEATURE_REQUEST",
      },
    ],
    [t],
  );

  const [submitted, setSubmitted] = useState(false);
  const [subject, setSubject] = useState<IDtoEIssueType | undefined>(
    "BUG_REPORT",
  );
  const inputDesc = useInput("");

  const invalid = useInputInvalid(inputDesc);

  const apiToast = useApiToast();
  const handleSubmit = useCallback(async () => {
    if (invalid || !subject) {
      return;
    }

    const res = await Api.POST("/u/issue", {
      body: {
        type: subject,
        description: inputDesc.value,
      },
    });
    apiToast(res);
    if (res.error === undefined) {
      inputDesc.onChange("");
      setSubmitted(true);
    }
  }, [subject, inputDesc, invalid, apiToast]);

  return (
    <CBody title={t("issueReportRequest")}>
      {submitted ? (
        <div>
          <CMessageCard message={t("msgIssueSubmitSuccess")} type="success" />
        </div>
      ) : (
        <CForm onSubmit={handleSubmit}>
          <CFormPanel>
            <CFormLine label={t("subject")}>
              <CCombobox
                list={subjectList}
                value={subject}
                onChange={setSubject}
              />
            </CFormLine>

            <CFormLine
              label={t("description")}
              invalidMsg={inputDesc.invalidMsg}
            >
              <CInputTextarea
                {...inputDesc}
                placeholder={t("description")}
                min={MIN_ISSUE_DESC}
                max={MAX_ISSUE_DESC}
                required
              />
            </CFormLine>

            <CFormFooter>
              <CButton label={t("submit")} primary submit disabled={invalid} />
            </CFormFooter>
          </CFormPanel>
        </CForm>
      )}
    </CBody>
  );
}
