import { useCallback, useEffect, useMemo, useState } from "react";

import { Api } from "@m/base/api/Api";
import { useLoader } from "@m/core/hooks/useLoader";

import { IDtoCorrelationResultItem } from "../interfaces/IDtoExploratoryAnalyses";
import { CExploratoryAnalysesCorrelationChart } from "./CExploratoryAnalysesCorrelationChart";
import { CExploratoryAnalysesCorrelationForm } from "./CExploratoryAnalysesCorrelationForm";
import { CExploratoryAnalysesCorrelationList } from "./CExploratoryAnalysesCorrelationList";

export function CExploratoryAnalysesCorrelation() {
  const [selectedResult, setSelectedResult] =
    useState<IDtoCorrelationResultItem | null>(null);

  const [rerunData, setRerunData] = useState<IDtoCorrelationResultItem | null>(
    null,
  );

  const fetchList = useCallback(async () => {
    return await Api.GET("/u/analysis/correlation/results");
  }, []);

  const [data, loadList] = useLoader(fetchList);

  const latestResult = useMemo(() => {
    return data?.payload?.records[0];
  }, [data?.payload]);

  // If latest result is changed, that means new analysis is added.
  useEffect(() => {
    if (latestResult) {
      setSelectedResult(latestResult);
    }
  }, [latestResult]);

  const handleRerun = useCallback((item: IDtoCorrelationResultItem) => {
    setRerunData(item);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col-reverse @lg:flex-row gap-4">
        <div className="@lg:w-1/2 @lg:min-w-0">
          <CExploratoryAnalysesCorrelationForm
            onSubmitSuccess={loadList}
            rerunData={rerunData}
          />
        </div>
        <div className="@lg:w-1/2 @lg:min-w-0">
          <CExploratoryAnalysesCorrelationChart
            selectedResultId={selectedResult?.id}
          />
        </div>
      </div>
      <div>
        <CExploratoryAnalysesCorrelationList
          data={data}
          reload={loadList}
          selectedResult={selectedResult}
          onResultSelect={setSelectedResult}
          onRerun={handleRerun}
        />
      </div>
    </div>
  );
}
