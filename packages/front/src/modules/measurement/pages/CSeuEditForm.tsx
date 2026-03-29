import { useCallback, useMemo } from "react";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useGlobalDatetimeRange } from "@m/base/hooks/useGlobalDatetimeRange";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { useLoader } from "@m/core/hooks/useLoader";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CSeuForm } from "../components/CSeuForm";
import { IDtoSeuRequest } from "../interfaces/IDtoSeu";

export function CSeuEditForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const id = paramId || "";

  const range = useGlobalDatetimeRange();

  const fetcher = useCallback(async () => {
    const res = await Api.GET("/u/measurement/seu/item/{id}", {
      params: { path: { id }, query: range },
    });
    return res;
  }, [range, id]);

  const [data] = useLoader(fetcher);

  const handleSubmit = useCallback(
    async (body: IDtoSeuRequest) => {
      const res = await Api.PUT("/u/measurement/seu/item/{id}", {
        params: { path: { id } },
        body,
      });
      apiToast(res);

      if (!res.error) {
        navigate(`/measurements/significant-energy-user/values/graph/${id}`);
      }
    },
    [apiToast, navigate, id],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("significantEnergyUsers"),
        path: "/measurements/significant-energy-user",
      },
      { label: data.payload?.name, dynamic: true },
      { label: t("edit") },
    ],
    [t, data.payload?.name],
  );

  return (
    <CBody breadcrumbs={breadcrumbs} showGlobalFilter>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CSeuForm initialData={payload} onSubmit={handleSubmit} />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
