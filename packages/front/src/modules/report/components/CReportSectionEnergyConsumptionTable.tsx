import { IDtoEEnergyResource } from "common/build-api-schema";
import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeEnergyResource } from "@m/base/components/CBadgeEnergyResource";
import { useUnitInfo } from "@m/base/hooks/useUnitMultiplierAndAbbr";
import {
  CAsyncLoader,
  IExtractAsyncData,
} from "@m/core/components/CAsyncLoader";
import { CDisplayNumber } from "@m/core/components/CDisplayNumber";
import { CTable } from "@m/core/components/CTable";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IDatetimeRange } from "@m/core/interfaces/IDatetimeRange";

import { IDtoReportSectionContent } from "../interfaces/IDtoReport";
import { customTableConverterEnergyConsumptionCostTable } from "../utils/customTableConverterEnergyConsumptionCostTable";
import { CButtonReportSectionCustomTableConverter } from "./CButtonReportSectionCustomTableConverter";
import { CMessageSelectDateRange } from "./CMessageSelectDateRange";

export function CReportSectionEnergyConsumptionTable({
  datetimeRange,
  onChange,
}: {
  datetimeRange?: IDatetimeRange;
  onChange: (value: IDtoReportSectionContent) => void;
}) {
  const { t } = useTranslation();

  const fetcher = useCallback(async () => {
    if (!datetimeRange) {
      return;
    }

    return await Api.GET("/u/measurement/meter/item", {
      params: {
        query: datetimeRange,
      },
    });
  }, [datetimeRange]);

  const [data] = useLoader(fetcher);

  const middleware = useCallback((payload: IExtractAsyncData<typeof data>) => {
    const meters = payload.records;

    const groupedByResource = meters.reduce(
      (acc, meter) => {
        const resource = meter.energyResource;
        if (!acc[resource]) {
          acc[resource] = {
            resource,
            consumption: 0,
            cost: 0,
          };
        }
        acc[resource].consumption += meter.consumption || 0;
        return acc;
      },
      {} as Partial<
        Record<
          IDtoEEnergyResource,
          {
            resource: IDtoEEnergyResource;
            consumption: number;
            cost: number;
          }
        >
      >,
    );

    return Object.values(groupedByResource).filter(
      (item) => item.consumption > 0,
    );
  }, []);

  const groupedData = useLoaderMiddleware(data, middleware);

  const { multiplier, abbr } = useUnitInfo("ENERGY");

  const header = useMemo(
    () => [
      { label: t("energyResource") },
      { label: t("consumption"), right: true },
      { label: t("cost"), right: true },
    ],
    [t],
  );

  if (!datetimeRange) {
    return <CMessageSelectDateRange />;
  }

  return (
    <CAsyncLoader data={groupedData}>
      {(rows) => (
        <div className="space-y-3">
          <CButtonReportSectionCustomTableConverter
            data={rows}
            converter={customTableConverterEnergyConsumptionCostTable}
            onChange={onChange}
          />

          <CTable header={header} bordered>
            {rows.map((row) => [
              <CBadgeEnergyResource key="energy-resource" value={row.resource} />,

              <CDisplayNumber
                key="consumption"
                value={row.consumption * multiplier}
                unitStr={abbr}
              />,

              <CDisplayNumber key="cost" value={row.cost} />,
            ])}
          </CTable>
        </div>
      )}
    </CAsyncLoader>
  );
}
