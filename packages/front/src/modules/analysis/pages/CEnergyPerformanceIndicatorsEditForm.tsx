import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { useLoader } from "@m/core/hooks/useLoader";

import { CEnpiForm } from "../components/CEnergyPerformanceIndicatorsForm";
import { IDtoEnpiRequest } from "../interfaces/IDtoEnergyPerformanceIndicators";

export function CEnpiEditForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const id = paramId || "";

  const fetcher = useCallback(async () => {
    const res = await Api.GET("/u/analysis/enpi/item/{id}", {
      params: { path: { id } },
    });
    return res;
  }, [id]);
  const [data] = useLoader(fetcher);

  const handleSubmit = useCallback(
    async (body: IDtoEnpiRequest) => {
      const res = await Api.PUT("/u/analysis/enpi/item/{id}", {
        params: { path: { id } },
        body,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/analysis/enpi");
      }
    },
    [apiToast, navigate, id],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("energyPerformanceIndicators"),
        path: "/analysis/enpi",
      },
      { label: data.payload?.equipment, dynamic: true },
      { label: t("edit") },
    ],
    [t, data.payload?.equipment],
  );
  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CEnpiForm initialData={payload} onSubmit={handleSubmit} />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
