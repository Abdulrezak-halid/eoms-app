/**
 * @file: CReportCreateTemplateForm.tsx
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
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CReportForm } from "../components/CReportForm";
import { IReportFormData } from "../interfaces/IDtoReport";

export function CReportCreateTemplateForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("templates"),
        path: "/report/template",
      },
      {
        label: t("createTemplate"),
      },
    ],
    [t],
  );

  const handleSubmit = useCallback(
    async (data: IReportFormData) => {
      const res = await Api.POST("/u/report/profile/item", {
        body: {
          description: data.templateDescription || {
            type: "PLAIN",
            value: "",
          },
          content: data.content,
        },
      });

      apiToast(res);

      if (res.error === undefined) {
        navigate("/report/template");
      }
    },
    [apiToast, navigate],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CReportForm onSubmit={handleSubmit} template />
    </CBody>
  );
}
