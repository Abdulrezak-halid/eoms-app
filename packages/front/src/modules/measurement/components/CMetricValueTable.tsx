import { IUnit, IUnitGroup, UtilUnit } from "common";
import { Trash2 } from "lucide-react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "wouter";

import { Api, InferApiQuery } from "@m/base/api/Api";
import {
  CDisplayDate,
  CDisplayDatetime,
} from "@m/base/components/CDisplayDatetime";
import { CPagination } from "@m/base/components/CPagination";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useGlobalDatetimeRange } from "@m/base/hooks/useGlobalDatetimeRange";
import { useUnitAbbreviation } from "@m/base/hooks/useUnitAbbreviation";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CButton } from "@m/core/components/CButton";
import { CCheckbox } from "@m/core/components/CCheckbox";
import { CDisplayNumber } from "@m/core/components/CDisplayNumber";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoEMetricResourceValuePeriodWithRaw } from "./CComboboxMetricResourceValuePeriod";
import { CMetricValueTab } from "./CMetricValueTab";

export function CMetricValueTable({ unitGroup }: { unitGroup: IUnitGroup }) {
  const { t } = useTranslation();
  const { id: metricId } = useParams<{ id: string }>();

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const range = useGlobalDatetimeRange();

  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(
    new Set(),
  );
  const [allRecords, setAllRecords] = useState<string[]>([]);

  const [displayUnit, setDisplayUnit] = useState<IUnit>(
    UtilUnit.getDefault(unitGroup),
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

  const handleSelectAll = useCallback(
    (selected: boolean) => {
      if (selected) {
        setSelectedRecords(new Set(allRecords));
      } else {
        setSelectedRecords(new Set());
      }
    },
    [allRecords],
  );

  const handleCheckboxClick = useCallback((id: string, selected: boolean) => {
    setSelectedRecords((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }, []);

  const defaultPeriod = "DAILY";

  const [period, setPeriod] = useState<
    IDtoEMetricResourceValuePeriodWithRaw | undefined
  >(defaultPeriod);

  const [resourceId, setResourceId] = useState<string | undefined>();

  const fetchInitialResources = useCallback(() => {
    return Api.GET("/u/measurement/metric/resources", {
      params: { query: { metricId } },
    });
  }, [metricId]);
  const [initialResources] = useLoader(fetchInitialResources);
  useEffect(() => {
    setResourceId(initialResources.payload?.records[0]?.id);
  }, [initialResources.payload?.records]);

  const isRawPeriod = period === "RAW";

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      ...(isRawPeriod
        ? [
            {
              label: (
                <div className="-my-1">
                  <CCheckbox
                    selected={
                      selectedRecords.size > 0 &&
                      selectedRecords.size === allRecords.length
                    }
                    semiSelected={
                      selectedRecords.size > 0 &&
                      selectedRecords.size < allRecords.length
                    }
                    onChange={handleSelectAll}
                  />
                </div>
              ),
              className: "w-12",
            },
          ]
        : []),
      { label: t("value"), right: true },
      { label: t("sampleCount"), right: true, hideSm: true },
      { label: t("datetime"), right: true },
    ],
    [selectedRecords.size, allRecords.length, handleSelectAll, t, isRawPeriod],
  );

  const [query, setQuery] = useState<
    InferApiQuery<
      "/u/measurement/metric/resource/{resourceId}/values",
      "get"
    > & {
      page: number;
    }
  >();

  const pageRecordCount = 20;

  // Reset query and checkboxes when filter params are changed.
  useEffect(() => {
    setQuery({
      ...range,
      count: pageRecordCount,
      period: period || defaultPeriod,
      // If query params are changed reset page
      page: 1,
    });

    setSelectedRecords(new Set());
  }, [range, period]);

  const setPage = useCallback((value: number) => {
    setQuery((d) => d && { ...d, page: value });
  }, []);

  const fetcherValues = useCallback(() => {
    if (!query || !resourceId) {
      return;
    }
    return Api.GET("/u/measurement/metric/resource/{resourceId}/values", {
      params: {
        path: { resourceId },
        query,
      },
    });
  }, [query, resourceId]);

  const [data, load] = useLoader(fetcherValues);

  useEffect(() => {
    if (data.payload?.records) {
      const datetimes = data.payload.records.map((record) => record.datetime);
      setAllRecords(datetimes);
      setSelectedRecords((prev) => {
        const newSelected = new Set<string>();
        datetimes.forEach((datetime) => {
          if (prev.has(datetime)) {
            newSelected.add(datetime);
          }
        });
        return newSelected;
      });
    }
  }, [data.payload?.records]);

  const handleDelete = useCallback(async () => {
    await push(
      t("msgRecordCountDeletionConfirm", {
        count: selectedRecords.size,
      }),
      async () => {
        if (!resourceId) {
          return;
        }

        const res = await Api.DELETE(
          "/u/measurement/metric/resource/{resourceId}/values",
          {
            params: { path: { resourceId } },
            body: {
              datetimes: Array.from(selectedRecords),
            },
          },
        );
        apiToast(res);
        if (res.error === undefined) {
          setSelectedRecords(new Set());
          await load();
        }
      },
    );
  }, [apiToast, load, push, resourceId, selectedRecords, t]);

  return (
    <div className="space-y-4">
      <CMetricValueTab
        id={metricId}
        resourceId={resourceId}
        // To hide resource combo during initial resource value fetch,
        //   or combo value set delayed
        onResourceChange={initialResources.pending ? undefined : setResourceId}
        unitGroup={unitGroup}
        unit={displayUnit}
        onUnitChange={handleUnitChange}
        period={period}
        onPeriodChange={setPeriod}
        load={load}
      />

      <CAsyncLoader
        data={data}
        arrayField="records"
        // On the initial render, if resource id is loading,
        //   do not show no data is available message
        showSpinnerDuringNoFetch={
          Boolean(resourceId) ||
          initialResources.pending ||
          Boolean(initialResources.payload?.records.length)
        }
      >
        {(payload) => (
          <div className="space-y-4">
            {isRawPeriod && (
              <CButton
                icon={Trash2}
                label={
                  selectedRecords.size > 0
                    ? `${t("_delete")} (${selectedRecords.size})`
                    : t("_delete")
                }
                onClick={handleDelete}
                color="red"
                disabled={selectedRecords.size === 0}
              />
            )}

            <CTable header={header}>
              {payload.records.map((d) => [
                ...(isRawPeriod
                  ? [
                      <div key="checkbox" className="-my-1">
                        <CCheckbox
                          selected={selectedRecords.has(d.datetime)}
                          value={d.datetime}
                          onClick={handleCheckboxClick}
                          disabled={!isRawPeriod}
                        />
                      </div>,
                    ]
                  : []),
                <CDisplayNumber
                  key="value"
                  value={d.value * displayUnitMultiplier}
                  minDecimals={2}
                  unitStr={displayUnitAbbr}
                />,
                <CDisplayNumber key="sample" value={d.sampleCount} />,
                period === "DAILY" || period === "MONTHLY" ? (
                  <CDisplayDate key="datetime" value={d.datetime} />
                ) : (
                  <CDisplayDatetime
                    key="datetime"
                    value={d.datetime}
                    withSeconds={isRawPeriod}
                  />
                ),
              ])}
            </CTable>

            <CPagination
              totalRecordCount={payload.recordCount}
              pageRecordCount={pageRecordCount}
              value={query?.page || 1}
              onChange={setPage}
              alignRight
            />
          </div>
        )}
      </CAsyncLoader>
    </div>
  );
}
