import { useMemo } from "react";

import { CTab, ITabListItem } from "@m/core/components/CTab";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CRegressionAnalysesTabs() {
  const { t } = useTranslation();

  const tabList = useMemo<ITabListItem[]>(
    () => [
      {
        label: t("regression"),
        path: "/analysis/advanced-regression",
      },
      {
        label: t("suggestions"),
        path: "/analysis/advanced-regression/suggestions",
      },
    ],
    [t],
  );

  return <CTab list={tabList} />;
}
