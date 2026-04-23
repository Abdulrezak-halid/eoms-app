import { CChart } from "@m/base/components/CChart";
import { useGlobalDatetimeRange } from "@m/base/hooks/useGlobalDatetimeRange";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";

import { useFetchDataViewValues } from "../hooks/useFetchDataViewValues";
import { IDtoWidgetConfigDataView } from "../interfaces/IDtoDashboard";

export function CWidgetGraphDataView({
  config,
}: {
  config: IDtoWidgetConfigDataView;
}) {
  const range = useGlobalDatetimeRange();
  const [data] = useFetchDataViewValues(config.dataViewId, range);

  return (
    <CAsyncLoader data={data} className="min-h-72 h-full">
      {(payload) => (
        <CChart
          series={payload.series}
          type="line"
          unitStr={payload.displayUnitAbbr}
          {...range}
        />
      )}
    </CAsyncLoader>
  );
}
