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
import { getCurrentTimezone } from "@m/base/hooks/useTimezoneList";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { tolgee } from "@m/core/utils/tolgee";

import { CReportForm } from "../components/CReportForm";
import { IReportFormData } from "../interfaces/IDtoReport";

export function CReportCreateForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      <CReportForm onSubmit={handleSubmit} />
    </CBody>
  );
}
