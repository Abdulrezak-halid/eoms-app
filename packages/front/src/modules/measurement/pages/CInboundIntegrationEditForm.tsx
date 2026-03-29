/**
 * @file: CInboundIntegrationEditForm.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 15.07.2025
 * Last Modified Date: 15.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { useLoader } from "@m/core/hooks/useLoader";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CInboundIntegrationForm } from "../components/CInboundIntegrationForm";
import { IDtoInboundIntegrationRequest } from "../interfaces/IDtoInboundIntegration";

export function CInboundIntegrationEditForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const id = paramId || "";

  const fetcher = useCallback(async () => {
    const res = await Api.GET(
      "/u/measurement/inbound-integration/item/{id}",
      {
        params: { path: { id } },
      },
    );
    return res;
  }, [id]);
  const [data] = useLoader(fetcher);

  const handleSubmit = useCallback(
    async (body: IDtoInboundIntegrationRequest) => {
      const res = await Api.PUT(
        "/u/measurement/inbound-integration/item/{id}",
        {
          params: { path: { id } },
          body,
        },
      );
      apiToast(res);

      if (!res.error) {
        navigate("/measurements/metric-integration/inbound");
      }
    },
    [apiToast, navigate, id],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      { label: t("integrations") },
      {
        label: t("inbound"),
        path: "/measurements/metric-integration/inbound",
      },
      {
        label: data.payload?.name,
        dynamic: true,
      },
      { label: t("edit") },
    ],
    [data.payload, t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CInboundIntegrationForm
            initialData={payload}
            onSubmit={handleSubmit}
          />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
