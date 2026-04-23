import { IDtoEQdmsIntegrationBindingPage } from "common/build-api-schema";
import { useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IValueLabelMap } from "@m/base/interfaces/IValueLabelMap";

export function useQdmsIntegrationBindingPageMap() {
  const { t } = useTranslation();
  return useMemo<IValueLabelMap<IDtoEQdmsIntegrationBindingPage>>(
    () => ({
      PROCUREMENTS: { label: t("procurements") },
      SCOPE_AND_LIMITS: { label: t("scopeAndLimits") },
      ENERGY_POLICIES: { label: t("energyPolicies") },
      TRAININGS: { label: t("trainings") },
      COMMUNICATION_AND_AWARENESS_PLANS: {
        label: t("communicationAndAwarenessPlans"),
      },
      DESIGNS: { label: t("designs") },
    }),
    [t],
  );
}
