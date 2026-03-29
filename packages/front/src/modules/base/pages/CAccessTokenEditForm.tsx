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

import { CAccessTokenForm } from "../components/CAccessTokenForm";
import { IDtoAccessTokenRequest } from "../interfaces/IDtoAccessToken";

export function CAccessTokenEditForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/base/access-token/item/{id}", {
      params: { path: { id } },
    });
  }, [id]);

  const [data] = useLoader(fetcher);

  const handleSubmit = useCallback(
    async (formData: IDtoAccessTokenRequest) => {
      if (!id) {
        return;
      }

      const res = await Api.PUT("/u/base/access-token/item/{id}", {
        params: { path: { id } },
        body: formData,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/configuration/access-token");
      }
    },
    [apiToast, id, navigate],
  );

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("accessTokens"),
        path: "/configuration/access-token",
      },
      {
        label: data.payload && data.payload.name,
        dynamic: true,
      },
      {
        label: t("edit"),
      },
    ],
    [data.payload, t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CAccessTokenForm initialData={payload} onSubmit={handleSubmit} />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
