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

import { CQdmsIntegrationForm } from "../components/CQdmsIntegrationForm";
import { IDtoQdmsIntegrationRequest } from "../interfaces/IDtoQdmsIntegration";

export function CQdmsIntegrationEditForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { id: paramId } = useParams();
  const id = paramId || "";

  const fetcher = useCallback(async () => {
    const res = await Api.GET("/u/dms/qdms-integration/item/{id}", {
      params: { path: { id } },
    });
    return res;
  }, [id]);
  const [data] = useLoader(fetcher);

  const handleSubmit = useCallback(
    async (body: IDtoQdmsIntegrationRequest) => {
      const res = await Api.PUT("/u/dms/qdms-integration/item/{id}", {
        params: { path: { id } },
        body,
      });
      apiToast(res);
      if (!res.error) {
        navigate("/dms/qdms-integration");
      }
    },
    [apiToast, navigate, id],
  );

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("qdmsShort"),
        path: "/dms/qdms-integration",
      },
      {
        label: data.payload?.name,
        dynamic: true,
      },
      {
        label: t("edit"),
      },
    ],
    [data.payload?.name, t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CQdmsIntegrationForm initialData={payload} onSubmit={handleSubmit} />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
