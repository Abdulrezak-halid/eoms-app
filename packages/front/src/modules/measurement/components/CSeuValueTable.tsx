import { IUnit, UtilUnit } from "common";
import { IDtoEMetricResourceValuePeriod } from "common/build-api-schema";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Api, InferApiQuery } from "@m/base/api/Api";
import {
  CDisplayDate,
  CDisplayDatetime,
} from "@m/base/components/CDisplayDatetime";
import { CPagination } from "@m/base/components/CPagination";
import { useGlobalDatetimeRange } from "@m/base/hooks/useGlobalDatetimeRange";
import { useUnitAbbreviation } from "@m/base/hooks/useUnitAbbreviation";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CDisplayNumber } from "@m/core/components/CDisplayNumber";
import { CLine } from "@m/core/components/CLine";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoEMetricResourceValuePeriodWithRaw } from "./CComboboxMetricResourceValuePeriod";
import { CMetricValueTab } from "./CMetricValueTab";

export function CSeuValueTable({ seuId }: { seuId: string }) {
  const { t } = useTranslation();

  const range = useGlobalDatetimeRange();

  const header = useMemo<ITableHeaderColumn[]>(
    () => [{ label: t("value"), right: true }, { label: t("datetime") }],
    [t],
  );

  const [displayUnit, setDisplayUnit] = useState<IUnit>(() =>
    UtilUnit.getDefault("ENERGY"),
  );
  const handleUnitChange = useCallback((unit: IUnit | undefined) => {
    if (unit) {
      setDisplayUnit(unit);
    }
  }, []);

  const displayUnitMultiplier = useMemo(
    () => 1 / UtilUnit.getBaseMultiplier(displayUnit),
    [displayUnit],
  );
  const displayUnitAbbr = useUnitAbbreviation(displayUnit);

  const defaultPeriod = "DAILY";

  const [period, setPeriod] =
    useState<IDtoEMetricResourceValuePeriod>(defaultPeriod);

  const handlePeriodChange = useCallback(
    (value: IDtoEMetricResourceValuePeriodWithRaw | undefined) => {
      if (value && value !== "RAW") {
        setPeriod(value);
      }
    },
    [],
  );

  const [query, setQuery] =
    useState<InferApiQuery<"/u/measurement/seu/item/{id}/values", "get">>();

  const pageRecordCount = 20;

  // If query params are changed reset page
  useEffect(() => {
    setQuery({
      ...range,
      count: pageRecordCount,
      period: period,
      page: 1,
    });
  }, [range, period]);

  const setPage = useCallback((value: number) => {
    setQuery((d) => d && { ...d, page: value });
  }, []);

  const fetcherValues = useCallback(() => {
    if (!query) {
      return;
    }
    return Api.GET("/u/measurement/seu/item/{id}/values", {
      params: {
        path: { id: seuId },
        query,
      },
    });
  }, [seuId, query]);

  const [data, load] = useLoader(fetcherValues);

  return (
    <div className="space-y-4">
      <CMetricValueTab
        id={seuId}
        page="significant-energy-user"
        unitGroup="ENERGY"
        unit={displayUnit}
        onUnitChange={handleUnitChange}
        period={period}
        includeRaw={false}
        onPeriodChange={handlePeriodChange}
        load={load}
      />

      <CAsyncLoader data={data} arrayField="records" showSpinnerDuringNoFetch>
        {(payload) => (
          <div className="space-y-4">
            <CTable header={header}>
              {payload.records.map((d) => [
                <CDisplayNumber
                  key="value"
                  value={d.value * displayUnitMultiplier}
                  minDecimals={2}
                  unitStr={displayUnitAbbr}
                />,
                period === "DAILY" || period === "MONTHLY" ? (
                  <CDisplayDate key="datetime" value={d.datetime} />
                ) : (
                  <CDisplayDatetime key="datetime" value={d.datetime} />
                ),
              ])}
            </CTable>

            <CLine className="justify-end">
              <CPagination
                totalRecordCount={payload.recordCount}
                pageRecordCount={pageRecordCount}
                value={query?.page || 1}
                onChange={setPage}
                alignRight
              />
            </CLine>
          </div>
        )}
      </CAsyncLoader>
    </div>
  );
}
