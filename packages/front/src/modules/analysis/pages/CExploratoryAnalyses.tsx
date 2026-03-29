import { useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CTab, ITabListPathItem } from "@m/core/components/CTab";
import { useRoutePath } from "@m/core/hooks/useRoutePath";

import { CExploratoryAnalysesCorrelation } from "../components/CExploratoryAnalysesCorrelation";
import { CExploratoryAnalysesRegression } from "../components/CExploratoryAnalysesRegression";

export function CExploratoryAnalyses() {
  const { t } = useTranslation();
  const loc = useRoutePath();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("exploratoryAnalysis"),
      },
      {
        label:
          loc === "/analysis/exploratory-analyses/regression"
            ? t("regression")
            : t("correlation"),
      },
    ],
    [t, loc],
  );

  const tabList = useMemo<ITabListPathItem[]>(
    () => [
      {
        label: t("correlation"),
        path: "/analysis/exploratory-analyses/correlation",
        component: <CExploratoryAnalysesCorrelation />,
      },
      {
        label: t("regression"),
        path: "/analysis/exploratory-analyses/regression",
        component: <CExploratoryAnalysesRegression />,
      },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CTab list={tabList} />
    </CBody>
  );
}
