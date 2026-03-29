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

import { CDataViewProfileForm } from "../components/CDataViewProfileForm";
import { IDtoDataViewProfileRequest } from "../interfaces/IDtoDataViewProfile";

export function CDataViewProfileEditForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const id = paramId || "";

  const fetcher = useCallback(async () => {
    const res = await Api.GET("/u/measurement/data-view/profile/{id}", {
      params: { path: { id } },
    });
    return res;
  }, [id]);
  const [data] = useLoader(fetcher);

  const handleSubmit = useCallback(
    async (body: IDtoDataViewProfileRequest) => {
      const res = await Api.PUT("/u/measurement/data-view/profile/{id}", {
        params: { path: { id } },
        body,
      });
      apiToast(res);

      if (!res.error) {
        navigate(`/measurements/data-view/values/${id}`);
      }
    },
    [apiToast, navigate, id],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("dataViews"),
        path: "/measurements/data-view/profile",
      },
      { label: data.payload?.name, dynamic: true },
      { label: t("edit") },
    ],
    [t, data.payload?.name],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CDataViewProfileForm initialData={payload} onSubmit={handleSubmit} />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
