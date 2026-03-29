import { useFetchRegressionResult } from "@m/analysis/hooks/useFetchRegressionResult";
import { CChart } from "@m/base/components/CChart";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";

import { IDtoWidgetConfigRegression } from "../interfaces/IDtoDashboard";

export function CWidgetGraphRegression({
  config,
}: {
  config: IDtoWidgetConfigRegression;
}) {
  const [data] = useFetchRegressionResult(config.regressionResultId);

  return (
    <CAsyncLoader data={data}>
      {(payload) => (
        <CChart series={payload.mainSeries} unitStr={payload.unitAbbr} />
      )}
    </CAsyncLoader>
  );
}
