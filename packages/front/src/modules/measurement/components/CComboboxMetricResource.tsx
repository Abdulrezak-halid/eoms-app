import { IUnitGroup } from "common";
import { IDtoEMetricType } from "common/build-api-schema";
import { CircleGauge } from "lucide-react";

import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CCombobox, ICComboboxProps } from "@m/core/components/CCombobox";
import { useAsyncDataPending } from "@m/core/hooks/useAsyncDataPending";
import { NO_FETCH_FAIL_CODE } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { useMetricResourceOptions } from "../hooks/useMetricResourceOptions";

export function CComboboxMetricResource({
  metricId,
  listWithMetrics,
  metricType,
  metricUnitGroup,
  onBusyChange,
  ...props
}: Omit<ICComboboxProps<string>, "list"> & {
  metricId?: string;
  listWithMetrics?: boolean;
  metricType?: IDtoEMetricType;
  metricUnitGroup?: IUnitGroup;
  onBusyChange?: (value: boolean) => void;
}) {
  const { t } = useTranslation();

  const list = useMetricResourceOptions({
    metricId,
    listWithMetrics,
    metricType,
    metricUnitGroup,
  });

  useAsyncDataPending(list, onBusyChange);

  if (list.failCode === NO_FETCH_FAIL_CODE) {
    return (
      <CCombobox
        icon={CircleGauge}
        placeholder={t("selectAMetricResource")}
        disabled
      />
    );
  }

  return (
    <CAsyncLoader data={list} inline>
      {(payload) => (
        <CCombobox
          icon={CircleGauge}
          placeholder={t("selectAMetricResource")}
          searchable
          {...props}
          list={payload}
        />
      )}
    </CAsyncLoader>
  );
}
