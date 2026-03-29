import { IDtoEEnergyResource } from "common/build-api-schema";
import { CircleGauge } from "lucide-react";
import { useCallback } from "react";

import { Api } from "@m/base/api/Api";
import {
  CAsyncLoader,
  IExtractAsyncData,
} from "@m/core/components/CAsyncLoader";
import { CCombobox, ICComboboxProps } from "@m/core/components/CCombobox";
import { useAsyncDataPending } from "@m/core/hooks/useAsyncDataPending";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

interface ICComboboxMeterSliceProps
  extends Omit<ICComboboxProps<string>, "list"> {
  energyResource?: IDtoEEnergyResource;
  allEnergyResources?: boolean;
  includeMains?: boolean;
  onBusyChange?: (value: boolean) => void;
}

export function CComboboxMeterSlice({
  energyResource,
  allEnergyResources = false,
  includeMains = false,
  onBusyChange,
  ...props
}: ICComboboxMeterSliceProps) {
  const { t } = useTranslation();

  const loader = useCallback(async () => {
    if (!allEnergyResources && !energyResource) {
      return undefined;
    }
    return await Api.GET("/u/measurement/meter/slice/names", {
      params: {
        query: {
          energyResource: allEnergyResources ? undefined : energyResource,
          nonMainOnly: !includeMains ? "true" : "false",
        },
      },
    });
  }, [allEnergyResources, energyResource, includeMains]);

  const [data] = useLoader(loader);

  useAsyncDataPending(data, onBusyChange);

  const middleware = useCallback((payload: IExtractAsyncData<typeof data>) => {
    return payload.records.map((d) => ({
      label: d.name,
      value: d.id,
    }));
  }, []);

  const list = useLoaderMiddleware(data, middleware);

  const shouldLoad = allEnergyResources || Boolean(energyResource);

  if (!shouldLoad) {
    return (
      <CCombobox
        icon={CircleGauge}
        placeholder={t("selectAMeter")}
        disabled
        {...props}
      />
    );
  }

  return (
    <CAsyncLoader data={list} inline>
      {(payload) => (
        <CCombobox
          icon={CircleGauge}
          placeholder={t("selectAMeter")}
          list={payload}
          {...props}
        />
      )}
    </CAsyncLoader>
  );
}
