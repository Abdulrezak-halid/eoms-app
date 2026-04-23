import { IDtoEEnergyResource } from "common/build-api-schema";
import { useCallback } from "react";

import { Api } from "@m/base/api/Api";
import { useEnergyResourceMap } from "@m/base/hooks/useEnergyResourceMap";
import { useUnitInfo } from "@m/base/hooks/useUnitMultiplierAndAbbr";
import {
  CAsyncLoader,
  IExtractAsyncData,
} from "@m/core/components/CAsyncLoader";
import { CDisplayNumber } from "@m/core/components/CDisplayNumber";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IDatetimeRange } from "@m/core/interfaces/IDatetimeRange";

import { IDtoReportSectionContent } from "../interfaces/IDtoReport";
import { customTableConverterMonthlyEnergyConsumption } from "../utils/customTableConverterMonthlyEnergyConsumption";
import { CButtonReportSectionCustomTableConverter } from "./CButtonReportSectionCustomTableConverter";
import { CMessageSelectDateRange } from "./CMessageSelectDateRange";

export function CReportSectionMonthlyEnergyConsumptionTable({
  datetimeRange,
  onChange,
}: {
  datetimeRange?: IDatetimeRange;
  onChange: (value: IDtoReportSectionContent) => void;
}) {
  const fetcher = useCallback(async () => {
    if (!datetimeRange) {
      return;
    }

    return await Api.GET("/u/report/section-data/consumption-cost-monthly", {
      params: { query: datetimeRange },
    });
  }, [datetimeRange]);

  const [data] = useLoader(fetcher);

  const energyResourceMap = useEnergyResourceMap();

  const { t } = useTranslation();

  const { multiplier, abbr } = useUnitInfo("ENERGY");

  const middleware = useCallback(
    (payload: IExtractAsyncData<typeof data>) => {
      const energyResources = [
        ...new Set(
          payload.records.flatMap((d) => Object.keys(d.energyResources)),
        ),
      ];

      const headerParent: ITableHeaderColumn[] = [
        { label: "" },
        ...energyResources.map((key) => ({
          label: energyResourceMap[key as keyof typeof energyResourceMap].label,
          colspan: 2,
          center: true,
        })),
        { label: t("total"), colspan: 2, center: true },
      ];

      const header: ITableHeaderColumn[] = [
        { label: t("months") },
        ...energyResources.flatMap(() => [
          { label: t("consumption"), right: true },
          { label: t("cost"), right: true },
        ]),
        { label: t("consumption"), right: true },
        { label: t("cost"), right: true },
      ];

      const rows = payload.records.map((record) => {
        const date = new Date(record.datetime);
        const monthAndYear = date.toLocaleDateString(undefined, {
          month: "long",
          year: "numeric",
        });

        let totalConsumption = 0;
        let totalCost = 0;

        for (const energyResource in record.energyResources) {
          const energyRecord =
            record.energyResources[energyResource as IDtoEEnergyResource]!;
          totalConsumption += energyRecord.consumption;
          totalCost += energyRecord.cost;
        }

        const resources = energyResources.flatMap((key) => {
          const energyResourcesMap = record.energyResources as Record<
            string,
            { consumption: number; cost: number }
          >;
          const energyResourceValues = energyResourcesMap[key];
          const resourceData = energyResourceValues
            ? {
                consumption: energyResourceValues.consumption * multiplier,
                cost: energyResourceValues.cost,
              }
            : {
                consumption: 0,
                cost: 0,
              };

          return resourceData;
        });

        return {
          monthAndYear,
          resources,
          totalConsumption,
          totalCost,
        };
      });

      return {
        headerParent,
        header,
        rows,
      };
    },
    [energyResourceMap, multiplier, t],
  );

  const processedData = useLoaderMiddleware(data, middleware);

  if (!datetimeRange) {
    return <CMessageSelectDateRange />;
  }

  return (
    <CAsyncLoader
      data={processedData}
      arrayField="rows"
      showSpinnerDuringNoFetch
    >
      {(payload) => (
        <div className="space-y-3">
          <CButtonReportSectionCustomTableConverter
            data={data.payload!}
            converter={customTableConverterMonthlyEnergyConsumption}
            onChange={onChange}
          />

          <CTable
            headerParent={payload.headerParent}
            header={payload.header}
            bordered
          >
            {payload.rows.map((d) => [
              d.monthAndYear,
              ...d.resources.flatMap((resource, i) => [
                <CDisplayNumber
                  key={`resource-${i}-consumption`}
                  value={resource.consumption}
                  maxDecimals={2}
                  unitStr={abbr}
                />,
                <CDisplayNumber
                  key={`resource-${i}-cost`}
                  value={resource.cost}
                  maxDecimals={2}
                />,
              ]),
              <CDisplayNumber
                key="total-consumption"
                value={d.totalConsumption}
                maxDecimals={2}
                unitStr={abbr}
              />,

              <CDisplayNumber
                key="total-cost"
                value={d.totalCost}
                maxDecimals={2}
              />,
            ])}
          </CTable>
        </div>
      )}
    </CAsyncLoader>
  );
}
