import { IUnit, IUnitGroup, UtilUnit } from "common";
import { useCallback, useState } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeUnitGroup } from "@m/base/components/CBadgeUnitGroup";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CChart, IChartSeries } from "@m/base/components/CChart";
import { CComboboxUnit } from "@m/base/components/CComboboxUnit";
import { useGlobalDatetimeRange } from "@m/base/hooks/useGlobalDatetimeRange";
import {
  CAsyncLoader,
  IExtractAsyncData,
} from "@m/core/components/CAsyncLoader";
import { CCard } from "@m/core/components/CCard";
import { CMutedText } from "@m/core/components/CMutedText";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoEDataViewType } from "../interfaces/IDtoDataViewProfile";
import { CBadgeMetricResourceValuePeriod } from "./CBadgeMetricResourceValuePeriod";

interface IProps {
  profileId: string;
  profileType: IDtoEDataViewType;
}

interface IChartConfig {
  unitGroup: IUnitGroup;
  series: IChartSeries;
  seriesIds: string[];
}

export function CDataViewProfileValueGraph({ profileId, profileType }: IProps) {
  const { t } = useTranslation();

  const range = useGlobalDatetimeRange();

  const [displayUnits, setDisplayUnits] = useState<
    Partial<Record<IUnitGroup, IUnit>>
  >({});

  const fetcher = useCallback(() => {
    return Api.GET("/u/measurement/data-view/values/{profileId}", {
      params: {
        path: { profileId },
        query: range,
      },
    });
  }, [range, profileId]);

  const [data, load] = useLoader(fetcher);

  const period = data.payload?.period || "DAILY";

  const middleware = useCallback(
    (payload: IExtractAsyncData<typeof data>): IChartConfig[] => {
      const series = payload.series;

      const getDisplayUnitMultiplier = (unitGroup: IUnitGroup) => {
        const displayUnit =
          displayUnits[unitGroup] || UtilUnit.getDefault(unitGroup);
        return 1 / UtilUnit.getBaseMultiplier(displayUnit);
      };

      if (profileType === "METER_SLICE" || profileType === "SEU") {
        const unitGroup = "ENERGY" as IUnitGroup;
        const displayUnitMultiplier = getDisplayUnitMultiplier(unitGroup);

        const chartSeries: IChartSeries = series.map((serie) => ({
          name: serie.name,
          data: serie.values.map((value) => ({
            x: value.datetime,
            y: value.value * displayUnitMultiplier,
          })),
        }));

        return [
          {
            unitGroup,
            series: chartSeries,
            seriesIds: series.map((s) => s.id),
          },
        ];
      }

      const groupedByUnit = new Map<IUnitGroup, typeof series>();

      series.forEach((serie) => {
        const unitGroup = serie.unit;
        if (!groupedByUnit.has(unitGroup)) {
          groupedByUnit.set(unitGroup, []);
        }
        groupedByUnit.get(unitGroup)!.push(serie);
      });

      return Array.from(groupedByUnit.entries()).map(
        ([unitGroup, groupSeries]) => {
          const displayUnitMultiplier = getDisplayUnitMultiplier(unitGroup);

          const chartSeries: IChartSeries = groupSeries.map((serie) => ({
            name: serie.name,
            data: serie.values.map((value) => ({
              x: value.datetime,
              y: value.value * displayUnitMultiplier,
            })),
          }));

          return {
            unitGroup,
            series: chartSeries,
            seriesIds: groupSeries.map((s) => s.id),
          };
        },
      );
    },
    [profileType, displayUnits],
  );

  const processedData = useLoaderMiddleware(data, middleware);

  const handleUnitChange = useCallback(
    (unitGroup: IUnitGroup, unit: IUnit | undefined) => {
      if (unit) {
        setDisplayUnits((prev) => ({
          ...prev,
          [unitGroup]: unit,
        }));
      }
    },
    [],
  );

  const createHandleUnitChange = useCallback(
    (unitGroup: IUnitGroup) => {
      return (unit: IUnit | undefined) => handleUnitChange(unitGroup, unit);
    },
    [handleUnitChange],
  );

  const getDisplayUnitAbbr = useCallback(
    (unitGroup: IUnitGroup) => {
      const displayUnit =
        displayUnits[unitGroup] || UtilUnit.getDefault(unitGroup);
      return UtilUnit.getAbbreviation(displayUnit, t);
    },
    [displayUnits, t],
  );

  const getDisplayUnit = useCallback(
    (unitGroup: IUnitGroup) => {
      return displayUnits[unitGroup] || UtilUnit.getDefault(unitGroup);
    },
    [displayUnits],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col @sm:flex-row gap-2 @sm:justify-end @sm:items-center">
        <div className="grow flex justify-start space-x-2">
          <CMutedText value={t("displayedPeriod")} />
          <CBadgeMetricResourceValuePeriod value={period} />
        </div>
        <CButtonRefresh onClick={load} />
      </div>

      <CAsyncLoader data={processedData}>
        {(payload) => (
          <div className="space-y-4">
            {payload.map(({ unitGroup, series }, index) => (
              <div key={`${unitGroup}-${index}`} className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CMutedText value={t("unit")} />
                    <CBadgeUnitGroup value={unitGroup} />
                  </div>
                  <CComboboxUnit
                    unitGroup={unitGroup}
                    value={getDisplayUnit(unitGroup)}
                    onChange={createHandleUnitChange(unitGroup)}
                    required
                    noClear
                  />
                </div>

                <CCard>
                  <CChart
                    series={series}
                    unitStr={getDisplayUnitAbbr(unitGroup)}
                    {...range}
                  />
                </CCard>
              </div>
            ))}
          </div>
        )}
      </CAsyncLoader>
    </div>
  );
}
