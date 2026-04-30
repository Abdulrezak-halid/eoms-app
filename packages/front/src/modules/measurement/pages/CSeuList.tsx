import { IDtoEEnergyResource } from "common/build-api-schema";
import { useCallback, useMemo, useState } from "react";

import { Api } from "@m/base/api/Api";
import { InferApiGetResponse } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CComboboxEnergyResource } from "@m/base/components/CComboboxEnergyResource";
import { CDisplayEnergyValue } from "@m/base/components/CDisplayEnergyValue";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useEnergyResourceMap } from "@m/base/hooks/useEnergyResourceMap";
import { useGlobalDatetimeRange } from "@m/base/hooks/useGlobalDatetimeRange";
import { useUnitInfo } from "@m/base/hooks/useUnitMultiplierAndAbbr";
import {
  CAsyncLoader,
  IExtractAsyncData,
} from "@m/core/components/CAsyncLoader";
import { CBadgePercentage } from "@m/core/components/CBadgePercentage";
import { CCard } from "@m/core/components/CCard";
import { CHr } from "@m/core/components/CHr";
import { CLine } from "@m/core/components/CLine";
import { CMutedText } from "@m/core/components/CMutedText";
import { CPieChart, IPieChartDataSingle } from "@m/core/components/CPieChart";
import { CSwitch } from "@m/core/components/CSwitch";
import { useLoaderMiddleware, useLoaderMulti } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CSeuCard } from "../components/CSeuCard";

export function CSeuList() {
  const { t } = useTranslation();

  const [selectedEnergyResource, setSelectedEnergyResource] = useState<
    IDtoEEnergyResource | undefined
  >(undefined);

  const [showPieChart, setShowPieChart] = useState(false);

  const { multiplier, unit } = useUnitInfo("ENERGY");

  const energyResourceMap = useEnergyResourceMap();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("significantEnergyUsers") }],
    [t],
  );

  const range = useGlobalDatetimeRange();

  const fetcher = useCallback(async () => {
    return {
      seus: await Api.GET("/u/measurement/seu/item", {
        params: {
          query: {
            ...range,
            energyResource: selectedEnergyResource,
          },
        },
      }),
      mainConsumptions: await Api.GET(
        "/u/measurement/meter/slice/main-consumptions",
        {
          params: {
            query: {
              ...range,
              energyResource: selectedEnergyResource,
            },
          },
        },
      ),
    };
  }, [range, selectedEnergyResource]);

  const [data, load] = useLoaderMulti(fetcher);

  const middleware = useCallback(
    (payload: IExtractAsyncData<typeof data>) => {
      const mainConsumptionMap = new Map<
        IDtoEEnergyResource,
        InferApiGetResponse<"/u/measurement/meter/slice/main-consumptions">["records"][number]["consumption"]
      >(
        payload.mainConsumptions.records.map((record) => [
          record.energyResource,
          record.consumption,
        ]),
      );

      const groupedByResource = payload.seus.records.reduce(
        (acc, record) => {
          const key = record.energyResource;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(record);
          return acc;
        },
        {} as Peomsal<Record<IDtoEEnergyResource, typeof payload.seus.records>>,
      );

      const groups = (
        Object.entries(groupedByResource) as [
          IDtoEEnergyResource,
          typeof payload.seus.records,
        ][]
      ).map(([energyResource, records]) => {
        const totalConsumption = records.reduce(
          (sum, r) => sum + (r.consumption ?? 0),
          0,
        );
        const totalPercentage = records.reduce(
          (sum, r) => sum + (r.percentage ?? 0),
          0,
        );
        const pieData: IPieChartDataSingle = records.map((r) => ({
          label: r.name,
          value: (r.consumption ?? 0) * multiplier,
        }));

        return {
          energyResource,
          records,
          totalConsumption,
          totalPercentage,
          mainConsumption: mainConsumptionMap.get(energyResource) ?? null,
          pieData,
        };
      });

      return { groups };
    },
    [multiplier],
  );

  const processedData = useLoaderMiddleware(data, middleware);

  return (
    <CBody breadcrumbs={breadcrumbs} showGlobalFilter>
      <div className="flex flex-col @sm:flex-row gap-2">
        <CLine className="flex-col @sm:flex-row gap-2 items-start w-full @sm:grow">
          <CComboboxEnergyResource
            value={selectedEnergyResource}
            onChange={setSelectedEnergyResource}
            className="w-full @sm:flex-1 @sm:min-w-0"
          />
        </CLine>

        <CLine className="gap-2 justify-end @sm:flex-shrink-0">
          <CSwitch
            selected={showPieChart}
            onChange={setShowPieChart}
            label={t("showPieCharts")}
          />
          <CLinkAdd path="/measurements/significant-energy-user/item-add" />
          <CButtonRefresh onClick={load} />
        </CLine>
      </div>

      <CAsyncLoader data={processedData} arrayField="groups">
        {(payload) => (
          <div className="space-y-12">
            {payload.groups.map((group) => (
              <div key={group.energyResource} className="space-y-2">
                {!selectedEnergyResource && (
                  <>
                    <CMutedText className="text-lg">
                      {energyResourceMap[group.energyResource].label}
                    </CMutedText>
                    <CHr />
                  </>
                )}

                {group.records.map((d) => (
                  <CSeuCard key={d.id} data={d} load={load} />
                ))}

                <CCard className="p-3 border-2 border-accent-600 dark:border-accent-700">
                  <CLine className="justify-between">
                    <CMutedText className="font-bold">{t("total")}</CMutedText>
                    <div className="flex flex-col @sm:flex-row @sm:items-center gap-4">
                      <div className="flex flex-col @sm:flex-row items-end @sm:items-center space-x-2">
                        <CMutedText>{t("consumption")}</CMutedText>
                        <CLine className="space-x-2">
                          <CDisplayEnergyValue
                            value={group.totalConsumption * multiplier}
                            minDecimals={2}
                          />
                          <CBadgePercentage
                            value={group.totalPercentage}
                            description={t("consumptionRate")}
                          />
                        </CLine>
                      </div>
                      <div className="flex flex-col @sm:flex-row items-end @sm:items-center space-x-2">
                        <CMutedText>{t("mainConsumption")}</CMutedText>
                        <CDisplayEnergyValue
                          value={
                            group.mainConsumption === null
                              ? null
                              : group.mainConsumption * multiplier
                          }
                          minDecimals={2}
                        />
                      </div>
                    </div>
                  </CLine>
                </CCard>

                {showPieChart && (
                  <CPieChart
                    data={group.pieData}
                    unit={unit}
                    disableInteractiveLegend
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
