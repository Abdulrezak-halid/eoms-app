import { IDtoEEnergyResource } from "common/build-api-schema";
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

export function CMultiSelectOrganizationEnergyResource({
  onBusyChange,
  ...props
}: {
  onBusyChange?: (value: boolean) => void;
} & Omit<ICMultiSelectProps<IDtoEEnergyResource>, "list">) {
  const { t } = useTranslation();

  const energyMap = useEnergyResourceMap();

  const loader = useCallback(async () => {
    return await Api.GET("/u/organization/energy-resources");
  }, []);

  const [data] = useLoader(loader);

  useAsyncDataPending(data, onBusyChange);

  const middleware = useCallback(
    (payload: IExtractAsyncData<typeof data>) => {
      return (
        payload.energyResources.map((resource: IDtoEEnergyResource) => {
          const { label, icon } = energyMap[resource] ?? {};
          return {
            value: resource,
            label,
            icon,
          };
        }) ?? []
      );
    },
    [energyMap],
  );

  const list = useLoaderMiddleware(data, middleware);

  return (
    <CAsyncLoader data={list} inline>
      {(payload) => (
        <CMultiSelect
          placeholder={t("selectEnergyResources")}
          {...props}
          list={payload}
        />
      )}
    </CAsyncLoader>
  );
}
