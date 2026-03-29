import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CEnpiForm } from "../components/CEnergyPerformanceIndicatorsForm";
import { IDtoEnpiRequest } from "../interfaces/IDtoEnergyPerformanceIndicators";

export function CEnpiAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoEnpiRequest) => {
      const res = await Api.POST("/u/analysis/enpi/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/analysis/enpi");
      }
    },
    [apiToast, navigate],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("energyPerformanceIndicators"),
        path: "/analysis/enpi",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CEnpiForm onSubmit={handleSubmit} />
    </CBody>
  );
}
