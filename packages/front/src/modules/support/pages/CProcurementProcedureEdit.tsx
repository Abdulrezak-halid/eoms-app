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

import { CProcurementProcedureForm } from "../components/CProcurementProcedureForm";
import { IDtoProcurementProcedureRequest } from "../interfaces/IDtoProcurementProcedure";

export function CProcurementProcedureEditForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const id = paramId || "";

  const fetcher = useCallback(async () => {
    const res = await Api.GET("/u/support/procurement-procedure/item/{id}", {
      params: { path: { id } },
    });
    return res;
  }, [id]);
  const [data] = useLoader(fetcher);

  const handleSubmit = useCallback(
    async (body: IDtoProcurementProcedureRequest) => {
      const res = await Api.PUT("/u/support/procurement-procedure/item/{id}", {
        params: { path: { id } },
        body,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/supporting-operations/procurement-procedure");
      }
    },
    [apiToast, navigate, id],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("procurementProcedures"),
        path: "/supporting-operations/procurement-procedure",
      },
      { label: data.payload?.equipmentSpecifications, dynamic: true },
      { label: t("edit") },
    ],
    [t, data.payload?.equipmentSpecifications],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CProcurementProcedureForm
            initialData={payload}
            onSubmit={handleSubmit}
          />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
