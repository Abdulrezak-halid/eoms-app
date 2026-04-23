/**
 * @file: CReportEditTemplateForm.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 08.01.2026
 * Last Modified Date: 08.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useCallback, useMemo } from "react";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { getCurrentTimezone } from "@m/base/hooks/useTimezoneList";
import {
  CAsyncLoader,
  IExtractAsyncData,
} from "@m/core/components/CAsyncLoader";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { tolgee } from "@m/core/utils/tolgee";

import { CReportForm } from "../components/CReportForm";
import { IReportFormData } from "../interfaces/IDtoReport";
import { renderPlainOrTranslatableText } from "../utils/renderPlainOrTranslatableText";

export function CReportUseTemplateForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { templateId } = useParams();

  const fetcher = useCallback(async () => {
    if (!templateId) {
      return;
    }
    return await Api.GET("/u/report/profile/item/{id}", {
      params: { path: { id: templateId } },
    });
  }, [templateId]);
  const [data] = useLoader(fetcher);
  const middleware = useCallback(
    (payload: IExtractAsyncData<typeof data>): IReportFormData => {
      return {
        content: payload.content,
      };
    },
    [],
  );
  const formData = useLoaderMiddleware(data, middleware);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("templates"),
        path: "/report/template",
      },
      {
        label: data.payload?.title
          ? renderPlainOrTranslatableText(t, data.payload?.title)
          : undefined,
        dynamic: true,
      },
      {
        label: t("use"),
      },
    ],
    [data.payload?.title, t],
  );

  const handleSubmit = useCallback(
    async ({ content, attachmentIds }: IReportFormData) => {
      const timezone = getCurrentTimezone();
      const language = tolgee.getLanguage();

      const res = await Api.POST("/u/report/create", {
        params: { query: { tz: timezone } },
        headers: { "Accept-Language": language },
        body: {
          report: content,
          attachmentIds: attachmentIds || [],
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
      <CAsyncLoader data={formData} showSpinnerDuringNoFetch>
        {(payload) => (
          <CReportForm initialData={payload} onSubmit={handleSubmit} />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
