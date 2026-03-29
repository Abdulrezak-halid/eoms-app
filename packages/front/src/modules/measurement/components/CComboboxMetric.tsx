import { IUnitGroup } from "common";
import { IDtoEMetricType } from "common/build-api-schema";
import { CircleGauge } from "lucide-react";
import { useCallback } from "react";

import { Api, InferApiGetResponse } from "@m/base/api/Api";
import {
  CAsyncLoader,
  IExtractAsyncData,
} from "@m/core/components/CAsyncLoader";
import { CCombobox, ICComboboxProps } from "@m/core/components/CCombobox";
import { useAsyncDataPending } from "@m/core/hooks/useAsyncDataPending";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

export type IMetricChangeDetails =
  InferApiGetResponse<"/u/measurement/metric/names">["records"][number];

export function CComboboxMetric({
  type,
  unitGroup,
  excludeUnitGroup,
  excludedValueFromFilters,
  onChange,
  onChangeWithDetails,
  onBusyChange,
  ...props
}: Omit<ICComboboxProps<string>, "list" | "onChange"> & {
  type?: IDtoEMetricType;
  unitGroup?: IUnitGroup;
  excludeUnitGroup?: IUnitGroup;
  excludedValueFromFilters?: string;
  onChange?: (value: string | undefined) => void;
  onBusyChange?: (value: boolean) => void;
  onChangeWithDetails?: (
    value: string | undefined,
    details: IMetricChangeDetails | undefined,
  ) => void;
}) {
  const { t } = useTranslation();
  const loader = useCallback(async () => {
    return await Api.GET("/u/measurement/metric/names");
  }, []);

  const [data] = useLoader(loader);

  useAsyncDataPending(data, onBusyChange);

  const middleware = useCallback(
    (payload: IExtractAsyncData<typeof data>) =>
      payload.records
        .filter(
          (d) =>
            d.id === excludedValueFromFilters ||
            ((!type || d.type === type) &&
              (!unitGroup || d.unitGroup === unitGroup) &&
              (!excludeUnitGroup || d.unitGroup !== excludeUnitGroup)),
        )
        .map((d) => ({
          label: d.name,
          value: d.id,
        })),
    [type, unitGroup, excludeUnitGroup, excludedValueFromFilters],
  );

  const list = useLoaderMiddleware(data, middleware);

  const handleChange = useCallback(
    (value: string | undefined) => {
      onChange?.(value);

      if (onChangeWithDetails) {
        if (value) {
          const selectedMetric = data.payload?.records.find(
            (d) => d.id === value,
          );
          onChangeWithDetails(value, selectedMetric);
        } else {
          onChangeWithDetails(undefined, undefined);
        }
      }
    },
    [data.payload?.records, onChange, onChangeWithDetails],
  );

  return (
    <CAsyncLoader data={list} inline>
      {(payload) => (
        <CCombobox
          icon={CircleGauge}
          placeholder={t("selectAMetric")}
          searchable
          {...props}
          list={payload}
          onChange={handleChange}
        />
      )}
    </CAsyncLoader>
  );
}
