import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CLine } from "@m/core/components/CLine";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CRegressionAnalysesCard } from "../components/CRegressionAnalysesCard";
import { CRegressionAnalysesTabs } from "../components/CRegressionAnalysesTabs";

export function CRegressionAnalysesResultList() {
  const { t } = useTranslation();

  const fetcherRegressions = useCallback(async () => {
    return await Api.GET("/u/analysis/advanced-regression/result");
  }, []);

  const [dataRegressions, loadRegressions] = useLoader(fetcherRegressions);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("regressionAnalysis"),
      },
    ],
    [t],
  );

  const actions = useMemo(
    () => (
      <CLine className="gap-2 flex-shrink-0">
        <CLinkAdd path="/analysis/advanced-regression/item-add" />
        <CButtonRefresh onClick={loadRegressions} />
      </CLine>
    ),
    [loadRegressions],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <div className="space-y-4">
        <div className="flex items-end justify-between space-x-2">
          <CRegressionAnalysesTabs />
          {actions}
        </div>

        <CAsyncLoader data={dataRegressions} arrayField="records">
          {(payload) => (
            <div className="flex flex-col space-y-4">
              {payload.records.map((result) => (
                <CRegressionAnalysesCard
                  key={result.id}
                  data={result}
                  load={loadRegressions}
                />
              ))}
            </div>
          )}
        </CAsyncLoader>
      </div>
    </CBody>
  );
}
