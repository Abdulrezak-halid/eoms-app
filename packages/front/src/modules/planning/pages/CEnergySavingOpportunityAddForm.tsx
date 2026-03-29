import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CEnergySavingOpportunityForm } from "../components/CEnergySavingOpportunityForm";
import { IDtoEnergySavingOpportunityRequest } from "../interfaces/IDtoEnergySavingOpportunity";

export function CEnergySavingOpportunityAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("energySavingOpportunities"),
        path: "/planning/energy-saving-opportunity",
      },
      {
        label: t("add"),
      },
    ],
    [t],
  );

  const handleSubmit = useCallback(
    async (data: IDtoEnergySavingOpportunityRequest) => {
      const res = await Api.POST("/u/planning/energy-saving-opportunity/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/planning/energy-saving-opportunity");
      }
    },
    [apiToast, navigate],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CEnergySavingOpportunityForm onSubmit={handleSubmit} />
    </CBody>
  );
}
