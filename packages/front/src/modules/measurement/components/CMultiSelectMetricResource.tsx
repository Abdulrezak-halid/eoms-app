/**
 * @file: CComboboxMetricResource.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 27.12.2025
 * Last Modified Date: 27.12.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IDtoEMetricType } from "common/build-api-schema";
import { Gauge } from "lucide-react";

import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import {
  CMultiSelect,
  ICMultiSelectProps,
} from "@m/core/components/CMultiSelect";
import { useAsyncDataPending } from "@m/core/hooks/useAsyncDataPending";
import { NO_FETCH_FAIL_CODE } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { useMetricResourceOptions } from "../hooks/useMetricResourceOptions";

export function CMultiSelectMetricResource({
  metricId,
  listWithMetrics,
  metricType,
  onBusyChange,
  ...props
}: Omit<ICMultiSelectProps<string>, "list"> & {
  metricId?: string;
  listWithMetrics?: boolean;
  metricType?: IDtoEMetricType;
  onBusyChange?: (value: boolean) => void;
}) {
  const { t } = useTranslation();

  const list = useMetricResourceOptions({
    metricId,
    listWithMetrics,
    metricType,
  });

  useAsyncDataPending(list, onBusyChange);

  if (list.failCode === NO_FETCH_FAIL_CODE) {
    return (
      <CMultiSelect
        icon={Gauge}
        placeholder={t("selectMetricResources")}
        disabled
      />
    );
  }

  return (
    <CAsyncLoader data={list} inline>
      {(payload) => (
        <CMultiSelect
          icon={Gauge}
          placeholder={t("selectMetricResources")}
          searchable
          {...props}
          list={payload}
        />
      )}
    </CAsyncLoader>
  );
}
