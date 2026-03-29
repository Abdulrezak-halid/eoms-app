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

import { CInternalExternalConsiderationForm } from "../components/CInternalExternalConsiderationForm";
import { IDtoInternalExternalConsiderationRequest } from "../interfaces/IDtoInternalExternalConsideration";

export function CInternalExternalConsiderationEditForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const id = paramId || "";

  const fetcher = useCallback(async () => {
    const res = await Api.GET(
      "/u/commitment/internal-external-consideration/item/{id}",
      {
        params: { path: { id } },
      },
    );
    return res;
  }, [id]);
  const [data] = useLoader(fetcher);

  const handleSubmit = useCallback(
    async (body: IDtoInternalExternalConsiderationRequest) => {
      const res = await Api.PUT(
        "/u/commitment/internal-external-consideration/item/{id}",
        {
          params: { path: { id } },
          body,
        },
      );
      apiToast(res);

      if (!res.error) {
        navigate("/commitment/internal-external-considerations");
      }
    },
    [apiToast, navigate, id],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("internalExternalConsiderations"),
        path: "/commitment/internal-external-considerations",
      },
      { label: data.payload?.specific, dynamic: true },
      { label: t("edit") },
    ],
    [t, data.payload?.specific],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CInternalExternalConsiderationForm
            initialData={payload}
            onSubmit={handleSubmit}
          />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
