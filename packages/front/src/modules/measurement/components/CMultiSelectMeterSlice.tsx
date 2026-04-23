import { IDtoEEnergyResource } from "common/build-api-schema";
import { CircleGauge } from "lucide-react";
import { useCallback } from "react";

import { Api, InferApiResponse } from "@m/base/api/Api";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import {
  CMultiSelect,
  ICMultiSelectProps,
} from "@m/core/components/CMultiSelect";
import { useAsyncDataPending } from "@m/core/hooks/useAsyncDataPending";
import {
  NO_FETCH_FAIL_CODE,
  useLoader,
  useLoaderMiddleware,
} from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

interface ICMultiSelectMeterSliceProps
  extends Omit<ICMultiSelectProps<string>, "list"> {
  energyResource?: IDtoEEnergyResource;
  allEnergyResources?: boolean;
  includeMains?: boolean;
  onBusyChange?: (value: boolean) => void;
}

export function CMultiSelectMeterSlice({
  energyResource,
  allEnergyResources,
  includeMains = false,
  onBusyChange,
  ...props
}: ICMultiSelectMeterSliceProps) {
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

  const middleware = useCallback(
    (payload: InferApiResponse<"/u/measurement/meter/slice/names", "get">) => {
      return payload.records.map((d) => ({
        label: d.name,
        value: d.id,
      }));
    },
    [],
  );

  const dataMapped = useLoaderMiddleware(data, middleware);

  if (dataMapped.failCode === NO_FETCH_FAIL_CODE) {
    return (
      <CMultiSelect
        icon={CircleGauge}
        placeholder={t("selectAMeters")}
        disabled
        {...props}
      />
    );
  }

  return (
    <CAsyncLoader data={dataMapped} inline>
      {(payload) => (
        <CMultiSelect
          icon={CircleGauge}
          placeholder={t("selectAMeters")}
          list={payload}
          {...props}
        />
      )}
    </CAsyncLoader>
  );
}
