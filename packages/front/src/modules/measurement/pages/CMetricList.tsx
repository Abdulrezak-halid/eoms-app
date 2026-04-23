import { IUnitGroup } from "common";
import { Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CComboboxUnitGroup } from "@m/base/components/CComboboxUnitGroup";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import {
  CAsyncLoader,
  IExtractAsyncData,
} from "@m/core/components/CAsyncLoader";
import { CInputString } from "@m/core/components/CInputString";
import { CLine } from "@m/core/components/CLine";
import { useBuffer } from "@m/core/hooks/useBuffer";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { classNames } from "@m/core/utils/classNames";

import { CMetricCard } from "../components/CMetricCard";

export function CMetricList() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("metrics") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/measurement/metric/item");
  }, []);
  const [data, load] = useLoader(fetcher);

  const [searchQuery, setSearchQuery] = useState("");
  const [bufferedSearch, bufferedSearchPending] = useBuffer(searchQuery);

  const [selectedUnitGroup, setSelectedUnitGroup] = useState<
    IUnitGroup | undefined
  >(undefined);

  const middeware = useCallback(
    (payload: IExtractAsyncData<typeof data>) => {
      let filtered = payload.records;

      const query = bufferedSearch.trim().toLowerCase();
      if (query) {
        filtered = filtered.filter((record) =>
          record.name.toLowerCase().includes(query),
        );
      }

      if (selectedUnitGroup) {
        filtered = filtered.filter(
          (record) => record.unitGroup === selectedUnitGroup,
        );
      }

      return filtered;
    },
    [bufferedSearch, selectedUnitGroup],
  );

  const filteredRecords = useLoaderMiddleware(data, middeware);

  return (
    <CBody breadcrumbs={breadcrumbs} showGlobalFilter>
      <div className="flex flex-col @sm:flex-row gap-2">
        <CLine className="flex-col @sm:flex-row gap-2 items-start w-full @sm:grow">
          <CInputString
            value={searchQuery}
            onChange={setSearchQuery}
            icon={Search}
            placeholder={t("search")}
            className="w-full @sm:flex-1 @sm:min-w-0"
          />

          <CComboboxUnitGroup
            value={selectedUnitGroup}
            onChange={setSelectedUnitGroup}
            className="w-full @sm:flex-1 @sm:min-w-0"
          />
        </CLine>

        <CLine className="gap-2 justify-end @sm:flex-shrink-0">
          <CLinkAdd path="/measurements/metric/item-add" />
          <CButtonRefresh onClick={load} />
        </CLine>
      </div>

      <CAsyncLoader data={filteredRecords}>
        {(payload) => (
          <div
            className={classNames(
              "space-y-3",
              bufferedSearchPending && "opacity-50",
            )}
          >
            {payload.map((d) => (
              <CMetricCard
                key={d.id}
                data={d}
                load={load}
                searchQuery={bufferedSearch.trim()}
              />
            ))}
          </div>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
