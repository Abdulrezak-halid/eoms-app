import { IUnitGroup } from "common";
import { IDtoEMetricType } from "common/build-api-schema";
import { Gauge } from "lucide-react";
import { useCallback } from "react";

import { Api } from "@m/base/api/Api";
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

export function CMultiSelectMetric({
  type,
  unitGroup,
  excludeUnitGroup,
  onBusyChange,
  ...props
}: Omit<ICMultiSelectProps<string>, "list"> & {
  type?: IDtoEMetricType;
  unitGroup?: IUnitGroup;
  excludeUnitGroup?: IUnitGroup;
  onBusyChange?: (value: boolean) => void;
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
            (!type || d.type === type) &&
            (!unitGroup || d.unitGroup === unitGroup) &&
            (!excludeUnitGroup || d.unitGroup !== excludeUnitGroup),
        )
        .map((d) => ({
          label: d.name,
          value: d.id,
        })),
    [type, unitGroup, excludeUnitGroup],
  );

  const list = useLoaderMiddleware(data, middleware);

  return (
    <CAsyncLoader data={list} inline>
      {(payload) => (
        <CMultiSelect
          icon={Gauge}
          placeholder={t("selectMetrics")}
          searchable
          list={payload}
          {...props}
        />
      )}
    </CAsyncLoader>
  );
}
