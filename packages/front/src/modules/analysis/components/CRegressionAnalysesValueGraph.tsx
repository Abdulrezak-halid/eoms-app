import { CChart } from "@m/base/components/CChart";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CCard } from "@m/core/components/CCard";

import { useFetchRegressionResult } from "../hooks/useFetchRegressionResult";

export function CRegressionAnalysesValueGraph({
  resultId,
}: {
  resultId: string;
}) {
  const [chartData] = useFetchRegressionResult(resultId);

  return (
    <CAsyncLoader data={chartData}>
      {(payload) => (
        <div className="space-y-4">
          <div className="space-y-2">
            <CCard>
              <CChart
                series={payload.mainSeries}
                type="line"
                unitStr={payload.unitAbbr}
              />
            </CCard>
          </div>

          <div className="space-y-2">
            <CCard>
              <CChart
                series={payload.cumulativeSeries}
                type="line"
                unitStr={payload.unitAbbr}
              />
            </CCard>
          </div>
        </div>
      )}
    </CAsyncLoader>
  );
}
