import { UtilUnit } from "common";

import { CChart } from "@m/base/components/CChart";
import { useGlobalDatetimeRange } from "@m/base/hooks/useGlobalDatetimeRange";
import { useUnitAbbreviation } from "@m/base/hooks/useUnitAbbreviation";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { useFetchSeuValues } from "@m/measurement/hooks/useFetchSeuValues";

import { IDtoWidgetConfigSeu } from "../interfaces/IDtoDashboard";

export function CWidgetGraphSeuValue({
  config,
}: {
  config: IDtoWidgetConfigSeu;
}) {
  const range = useGlobalDatetimeRange();
  const [data] = useFetchSeuValues({
    seuIds: config.seuIds,
    datetimeRange: range,
  });

  const displayUnit = UtilUnit.getDefault("ENERGY");
  const displayUnitAbbr = useUnitAbbreviation(displayUnit);

  return (
    <CAsyncLoader data={data}>
      {(series) => (
        <CChart
          series={series}
          type="line"
          unitStr={displayUnitAbbr}
          {...range}
        />
      )}
    </CAsyncLoader>
  );
}
