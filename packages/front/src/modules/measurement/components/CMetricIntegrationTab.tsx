import { useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CTab, ITabListPathItem } from "@m/core/components/CTab";

export function CMetricIntegrationTab() {
  const { t } = useTranslation();

  const tabList = useMemo<ITabListPathItem[]>(
    () => [
      {
        label: t("outbound"),
        path: "/measurements/metric-integration/outbound",
      },
      {
        label: t("inbound"),
        path: "/measurements/metric-integration/inbound",
      },
    ],
    [t],
  );

  return <CTab list={tabList} />;
}
