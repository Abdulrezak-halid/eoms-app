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
import {
  CAsyncLoader,
  IExtractAsyncData,
} from "@m/core/components/CAsyncLoader";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CReportForm } from "../components/CReportForm";
import { IReportFormData } from "../interfaces/IDtoReport";
import { renderPlainOrTranslatableText } from "../utils/renderPlainOrTranslatableText";

export function CReportEditTemplateForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { id } = useParams();

  const fetcher = useCallback(async () => {
    if (!id) {
      return;
    }
    return await Api.GET("/u/report/profile/item/{id}", {
      params: { path: { id } },
    });
  }, [id]);
  const [data] = useLoader(fetcher);
  const middleware = useCallback(
    (payload: IExtractAsyncData<typeof data>): IReportFormData => {
      return {
        templateDescription: payload.description,
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
        label: t("edit"),
      },
    ],
    [data.payload?.title, t],
  );

  const handleSubmit = useCallback(
    async ({ templateDescription, content }: IReportFormData) => {
      if (!id) {
        return;
      }
      const res = await Api.PUT("/u/report/profile/item/{id}", {
        params: { path: { id } },
        body: {
          description: templateDescription || {
            type: "PLAIN",
            value: "",
          },
          content: content,
        },
      });

      apiToast(res);

      if (res.error === undefined) {
        navigate("/report/template");
      }
    },
    [apiToast, id, navigate],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={formData} showSpinnerDuringNoFetch>
        {(payload) => (
          <CReportForm initialData={payload} onSubmit={handleSubmit} template />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
