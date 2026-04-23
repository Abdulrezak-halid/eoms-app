import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CProcurementForm } from "../components/CProcurementForm";
import { IDtoProcurementRequest } from "../interfaces/IDtoProcurement";

export function CProcurementAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoProcurementRequest) => {
      const res = await Api.POST("/u/support/procurement/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/supporting-operations/procurement");
      }
    },
    [apiToast, navigate],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("procurements"),
        path: "/supporting-operations/procurement",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CProcurementForm onSubmit={handleSubmit} />
    </CBody>
  );
}
