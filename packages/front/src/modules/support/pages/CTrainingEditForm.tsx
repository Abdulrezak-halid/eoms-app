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
import { CTrainingForm } from "@m/support/components/CTrainingForm";
import { IDtoTrainingRequest } from "@m/support/interfaces/IDtoTraining";

export function CTrainingEditForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { id: paramId } = useParams();
  const id = paramId || "";

  const fetcher = useCallback(async () => {
    const res = await Api.GET("/u/support/training/item/{id}", {
      params: { path: { id } },
    });
    return res;
  }, [id]);
  const [data] = useLoader(fetcher);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("trainings"),
        path: "/supporting-operations/training",
      },
      { label: data.payload?.title, dynamic: true },
      { label: t("edit") },
    ],
    [t, data.payload?.title],
  );

  const handleSubmit = useCallback(
    async (body: IDtoTrainingRequest) => {
      const res = await Api.PUT("/u/support/training/item/{id}", {
        params: { path: { id } },
        body,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/supporting-operations/training");
      }
    },
    [apiToast, navigate, id],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CTrainingForm initialData={payload} onSubmit={handleSubmit} />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
