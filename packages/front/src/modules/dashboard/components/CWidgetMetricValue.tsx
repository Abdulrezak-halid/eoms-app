import { UtilUnit } from "common";

import { CChart } from "@m/base/components/CChart";
import { useGlobalDatetimeRange } from "@m/base/hooks/useGlobalDatetimeRange";
import { useUnitAbbreviation } from "@m/base/hooks/useUnitAbbreviation";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";

import { useFetchMetricValues } from "../hooks/useFetchMetricValues";
import { IDtoWidgetConfigMetric } from "../interfaces/IDtoDashboard";

export function CWidgetGraphMetricValue({
  config,
}: {
  config: IDtoWidgetConfigMetric;
}) {
  const range = useGlobalDatetimeRange();

  const [chartData] = useFetchMetricValues(config.metricId, range);
  const displayUnit = UtilUnit.getDefault("ENERGY");
  const displayUnitAbbr = useUnitAbbreviation(displayUnit);

  return (
    <CAsyncLoader data={chartData}>
      {(payload) => (
        <CChart
          series={payload}
          type="line"
          unitStr={displayUnitAbbr}
          hideLegends
          {...range}
        />
      )}
    </CAsyncLoader>
  );
}
