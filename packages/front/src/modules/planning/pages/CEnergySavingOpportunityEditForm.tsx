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

import { CEnergySavingOpportunityForm } from "../components/CEnergySavingOpportunityForm";
import { IDtoEnergySavingOpportunityRequest } from "../interfaces/IDtoEnergySavingOpportunity";

export function CEnergySavingOpportunityEditForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { id: paramId } = useParams();
  const id = paramId || "";

  const fetcher = useCallback(async () => {
    const res = await Api.GET(
      "/u/planning/energy-saving-opportunity/item/{id}",
      {
        params: { path: { id } },
      },
    );
    return res;
  }, [id]);
  const [data] = useLoader(fetcher);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("energySavingOpportunities"),
        path: "/planning/energy-saving-opportunity",
      },
      { label: data.payload?.name, dynamic: true },
      { label: t("edit") },
    ],
    [t, data.payload?.name],
  );

  const handleSubmit = useCallback(
    async (body: IDtoEnergySavingOpportunityRequest) => {
      const res = await Api.PUT(
        "/u/planning/energy-saving-opportunity/item/{id}",
        {
          params: { path: { id } },
          body,
        },
      );
      apiToast(res);
      if (!res.error) {
        navigate("/planning/energy-saving-opportunity");
      }
    },
    [apiToast, navigate, id],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CEnergySavingOpportunityForm
            initialData={payload}
            onSubmit={handleSubmit}
          />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
