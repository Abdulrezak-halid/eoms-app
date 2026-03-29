import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CPlansForm } from "../components/CPlanForm";
import { IDtoPlanRequest } from "../interfaces/IDtoPlan";

export function CPlansAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoPlanRequest) => {
      const res = await Api.POST("/u/internal-audit/plan/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/internal-audit/plan");
      }
    },
    [apiToast, navigate],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("internalAudit"),
        path: "/internal-audit/plan",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CPlansForm onSubmit={handleSubmit} />
    </CBody>
  );
}
