import { IDtoEOrganizationPlanFeature } from "common/build-api-schema";
import { useMemo } from "react";

import { IValueLabelMap } from "@m/base/interfaces/IValueLabelMap";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function usePlanFeatureMap() {
  const { t } = useTranslation();
  return useMemo<IValueLabelMap<IDtoEOrganizationPlanFeature>>(
    () => ({
      UNCATEGORIZED: { label: t("uncategorized") },
      USER_MANAGEMENT: { label: t("userManagement") },
      USER_TOKEN: { label: t("userToken") },
      SYSTEM: { label: t("system") },
      MEASUREMENT: { label: t("measurement") },
      ANALYSES: { label: t("analyses") },
      ISO50001: { label: t("iso50001") },
      PRODUCT: { label: t("product") },
      SUPPLY_CHAIN: { label: t("supplyChain") },
      REPORT: { label: t("report") },
      QDMS: { label: t("qdmsShort") },
      RENERYO_AGENT: { label: t("reneryoAgent") },
      ACCESS_TOKEN: { label: t("accessToken") },
      ORGANIZATION_PARTNER: { label: t("organizationPartner") },
    }),
    [t],
  );
}
