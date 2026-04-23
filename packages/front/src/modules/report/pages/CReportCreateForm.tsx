/**
 * @file: CReportCreateForm.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 08.01.2026
 * Last Modified Date: 08.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useReport } from "@m/base/hooks/useReport";
import { getCurrentTimezone } from "@m/base/hooks/useTimezoneList";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { tolgee } from "@m/core/utils/tolgee";

import { CReportForm } from "../components/CReportForm";
import { useReportSectionDefaultTitleMap } from "../hooks/useReportSectionDefaultTitleMap";
import {
  IReportFormData,
  IReportFormInitialData,
} from "../interfaces/IDtoReport";

export function CReportCreateForm() {
  const apiToast = useApiToast();
  const { consumePrefillSections } = useReport();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const defaultTitleMap = useReportSectionDefaultTitleMap();

  const prefillSections = useMemo(
    () => consumePrefillSections(),
    [consumePrefillSections],
  );

  const initialData = useMemo<IReportFormInitialData | undefined>(() => {
    if (prefillSections.length === 0) {
      return undefined;
    }

    return {
      content: {
        title: { type: "PLAIN", value: "" },
        authorIds: [],
        sections: prefillSections.map((section) => {
          const sectionType = section.type;
          return {
            title: defaultTitleMap[sectionType] || {
              type: "PLAIN",
              value: section.type,
            },
            content: {
              type: sectionType,
            },
          };
        }),
      },
    };
  }, [defaultTitleMap, prefillSections]);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("reports"),
        path: "/report/item",
      },
      {
        label: t("createReport"),
      },
    ],
    [t],
  );

  const handleSubmit = useCallback(
    async (data: IReportFormData) => {
      const timezone = getCurrentTimezone();
      const language = tolgee.getLanguage();

      const res = await Api.POST("/u/report/create", {
        params: { query: { tz: timezone } },
        headers: { "Accept-Language": language },
        body: {
          report: data.content,
          attachmentIds: data.attachmentIds || [],
        },
      });

      apiToast(res);

      if (res.error === undefined) {
        navigate("/report/item");
      }
    },
    [apiToast, navigate],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CReportForm initialData={initialData} onSubmit={handleSubmit} />
    </CBody>
  );
}
