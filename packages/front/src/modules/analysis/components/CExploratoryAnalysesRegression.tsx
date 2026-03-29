import { useCallback, useEffect, useMemo, useState } from "react";

import { Api } from "@m/base/api/Api";
import { useLoader } from "@m/core/hooks/useLoader";

import { IDtoRegressionResultItem } from "../interfaces/IDtoExploratoryAnalyses";
import { CExploratoryAnalysesRegressionChart } from "./CExploratoryAnalysesRegressionChart";
import { CExploratoryAnalysesRegressionForm } from "./CExploratoryAnalysesRegressionForm";
import { CExploratoryAnalysesRegressionList } from "./CExploratoryAnalysesRegressionList";

export function CExploratoryAnalysesRegression() {
  const [selectedResult, setSelectedResult] =
    useState<IDtoRegressionResultItem | null>(null);

  const [rerunData, setRerunData] = useState<IDtoRegressionResultItem | null>(
    null,
  );

  const fetchList = useCallback(async () => {
    return await Api.GET("/u/analysis/linear-regression/results");
  }, []);

  const [data, loadList] = useLoader(fetchList);

  const latestResult = useMemo(() => {
    return data?.payload?.[0];
  }, [data?.payload]);

  useEffect(() => {
    if (latestResult) {
      setSelectedResult(latestResult);
    }
  }, [latestResult]);

  const handleRerun = useCallback((item: IDtoRegressionResultItem) => {
    setRerunData(item);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col-reverse @lg:flex-row gap-4">
        <div className="@lg:w-1/2 @lg:min-w-0">
          <CExploratoryAnalysesRegressionForm
            onSubmitSuccess={loadList}
            rerunData={rerunData}
          />
        </div>

        <div className="@lg:w-1/2 @lg:min-w-0">
          <CExploratoryAnalysesRegressionChart
            selectedResultId={selectedResult?.id}
          />
        </div>
      </div>

      <div>
        <CExploratoryAnalysesRegressionList
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
