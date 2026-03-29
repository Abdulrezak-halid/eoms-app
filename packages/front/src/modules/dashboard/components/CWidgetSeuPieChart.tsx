import { useEnergyResourceMap } from "@m/base/hooks/useEnergyResourceMap";
import { useGlobalDatetimeRange } from "@m/base/hooks/useGlobalDatetimeRange";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CMutedText } from "@m/core/components/CMutedText";
import { CPieChart } from "@m/core/components/CPieChart";
import { useFetchSeuPiesGroupedByEnergyResource } from "@m/report/hooks/useFetchSeuPiesGroupedByEnergyResource";

import { IDtoWidgetConfigSeuPieChart } from "../interfaces/IDtoDashboard";

export function CWidgetSeuPieChart({
  config,
}: {
  config: IDtoWidgetConfigSeuPieChart;
}) {
  const range = useGlobalDatetimeRange();
  const energyResourceMap = useEnergyResourceMap();

  const data = useFetchSeuPiesGroupedByEnergyResource({
    primary: false,
    seuIds: config.seuIds,
    datetimeRange: range,
    noGroup: false,
  });

  return (
    <CAsyncLoader data={data}>
      {(payload) => (
        <div className="space-y-6 p-4">
          {payload.map(({ energyResource, pieData, unit }) => (
            <div key={energyResource}>
              {energyResource && (
                <CMutedText className="text-lg mb-3">
                  {energyResourceMap[energyResource].label}
                </CMutedText>
              )}

              <CPieChart data={pieData} unit={unit} disableInteractiveLegend />
            </div>
          ))}
        </div>
      )}
    </CAsyncLoader>
  );
}
