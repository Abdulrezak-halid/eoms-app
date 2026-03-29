import { useCallback, useMemo } from "react";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { useLoader } from "@m/core/hooks/useLoader";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CTargetForm } from "../components/CTargetForm";
import { IDtoTargetRequest } from "../interfaces/IDtoTarget";

export function CTargetEditForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { id: paramId } = useParams();
  const id = paramId || "";

  const fetcher = useCallback(async () => {
    const res = await Api.GET("/u/planning/target/item/{id}", {
      params: { path: { id } },
    });
    return res;
  }, [id]);
  const [data] = useLoader(fetcher);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("targets"),
        path: "/planning/target",
      },
      { label: data.payload?.year.toString(), dynamic: true },
      { label: t("edit") },
    ],
    [t, data.payload?.year],
  );

  const handleSubmit = useCallback(
    async (body: IDtoTargetRequest) => {
      const res = await Api.PUT("/u/planning/target/item/{id}", {
        params: { path: { id } },
        body,
      });
      apiToast(res);
      if (!res.error) {
        navigate("/planning/target");
      }
    },
    [apiToast, navigate, id],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CTargetForm initialData={payload} onSubmit={handleSubmit} />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
