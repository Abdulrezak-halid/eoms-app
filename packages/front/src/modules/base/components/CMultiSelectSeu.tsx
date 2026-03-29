import { IDtoEEnergyResource } from "common/build-api-schema";
import { CircleGauge } from "lucide-react";
import { useCallback } from "react";

import {
  CAsyncLoader,
  IExtractAsyncData,
} from "@m/core/components/CAsyncLoader";
import {
  CMultiSelect,
  ICMultiSelectProps,
} from "@m/core/components/CMultiSelect";
import { useAsyncDataPending } from "@m/core/hooks/useAsyncDataPending";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "../api/Api";
import { useEnergyResourceMap } from "../hooks/useEnergyResourceMap";

export function CMultiSelectSeu({
  filterByEnergyResource,
  onBusyChange,
  ...props
}: Omit<ICMultiSelectProps<string>, "list"> & {
  filterByEnergyResource?: IDtoEEnergyResource;
  onBusyChange?: (value: boolean) => void;
}) {
  const { t } = useTranslation();

  const loader = useCallback(async () => {
    return await Api.GET("/u/measurement/seu/names");
  }, []);

  const [data] = useLoader(loader);

  useAsyncDataPending(data, onBusyChange);

  const energyResourceMap = useEnergyResourceMap();

  const middleware = useCallback(
    (payload: IExtractAsyncData<typeof data>) => {
      let records = payload.records;
      if (filterByEnergyResource) {
        records = records.filter(
          (d) => d.energyResource === filterByEnergyResource,
        );
      }
      return records.map((d) => ({
        icon: energyResourceMap[d.energyResource].icon,
        label: `${d.name} (${energyResourceMap[d.energyResource].label})`,
        value: d.id,
      }));
    },
    [energyResourceMap, filterByEnergyResource],
  );

  const list = useLoaderMiddleware(data, middleware);

  return (
    <CAsyncLoader data={list} inline>
      {(payload) => (
        <CMultiSelect
          icon={CircleGauge}
          placeholder={t("selectSignificantEnergyUsers")}
          list={payload}
          {...props}
        />
      )}
    </CAsyncLoader>
  );
}
