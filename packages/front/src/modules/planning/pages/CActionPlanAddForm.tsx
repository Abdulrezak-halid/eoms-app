import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CActionPlanForm } from "../components/CActionPlanForm";
import { IDtoActionPlanRequest } from "../interfaces/IDtoActionPlan";

export function CActionPlanAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("actionPlans"),
        path: "/planning/action-plan",
      },
      {
        label: t("add"),
      },
    ],
    [t],
  );

  const handleSubmit = useCallback(
    async (data: IDtoActionPlanRequest) => {
      const res = await Api.POST("/u/planning/action-plan/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/planning/action-plan");
      }
    },
    [apiToast, navigate],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CActionPlanForm onSubmit={handleSubmit} />
    </CBody>
  );
}
