import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CProcurementProcedureForm } from "../components/CProcurementProcedureForm";
import { IDtoProcurementProcedureRequest } from "../interfaces/IDtoProcurementProcedure";

export function CProcurementProcedureAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoProcurementProcedureRequest) => {
      const res = await Api.POST("/u/support/procurement-procedure/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/supporting-operations/procurement-procedure");
      }
    },
    [apiToast, navigate],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("procurementProcedures"),
        path: "/supporting-operations/procurement-procedure",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CProcurementProcedureForm onSubmit={handleSubmit} />
    </CBody>
  );
}
