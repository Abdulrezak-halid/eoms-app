import { Plus } from "lucide-react";
import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CTab, ITabListItem } from "@m/core/components/CTab";
import { useLoader } from "@m/core/hooks/useLoader";
import { useRoutePath } from "@m/core/hooks/useRoutePath";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CRegressionAnalysesCard } from "../components/CRegressionAnalysesCard";
import { CRegressionSuggestCard } from "../components/CRegressionSuggestCard";

export function CRegressionAnalysesList() {
  const { t } = useTranslation();
  const loc = useRoutePath();

  const fetcherRegressions = useCallback(async () => {
    return await Api.GET("/u/analysis/advanced-regression/result");
  }, []);

  const fetcherSuggests = useCallback(async () => {
    return await Api.GET("/u/analysis/advanced-regression/suggest");
  }, []);

  const [dataRegressions, loadRegressions] = useLoader(fetcherRegressions);
  const [dataSuggests, loadSuggests] = useLoader(fetcherSuggests);

  const isSuggestionsTab = loc === "/analysis/advanced-regression/suggestions";

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("regressionAnalysis"),
      },
    ],
    [t],
  );

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

  const actions = useMemo(
    () => (
      <CLine className="gap-2 flex-shrink-0">
        {isSuggestionsTab ? (
          <CLink
            icon={Plus}
            label={t("startAnalysis")}
            path="/analysis/advanced-regression/suggestion-add"
            hideLabelSm
          />
        ) : (
          <CLinkAdd path="/analysis/advanced-regression/item-add" />
        )}
        <CButtonRefresh
          onClick={isSuggestionsTab ? loadSuggests : loadRegressions}
        />
      </CLine>
    ),
    [isSuggestionsTab, loadRegressions, loadSuggests, t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <div className="space-y-4">
        <div className="flex items-end justify-between space-x-2">
          <CTab list={tabList} />
          {actions}
        </div>

        {isSuggestionsTab ? (
          <CAsyncLoader data={dataSuggests} arrayField="records">
            {(payload) => (
              <div className="flex flex-col space-y-4">
                {payload.records.map((suggest) => (
                  <CRegressionSuggestCard
                    key={suggest.id}
                    data={suggest}
                    load={loadSuggests}
                  />
                ))}
              </div>
            )}
          </CAsyncLoader>
        ) : (
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
        )}
      </div>
    </CBody>
  );
}
