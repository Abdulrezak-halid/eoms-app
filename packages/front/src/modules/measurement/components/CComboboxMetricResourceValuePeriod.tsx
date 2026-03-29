import { IDtoEMetricResourceValuePeriod } from "common/build-api-schema";
import { useMemo } from "react";
import { File } from "lucide-react";

import { CCombobox, ICComboboxProps } from "@m/core/components/CCombobox";
import { ISelectListItem } from "@m/core/components/CSelectList";
import { useMapToComboList } from "@m/core/hooks/useMapToComboList";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { useMetricResourceValuePeriodMap } from "../hooks/useMetricResourceValuePeriodMap";

export type IDtoEMetricResourceValuePeriodWithRaw =
  | IDtoEMetricResourceValuePeriod
  | "RAW";

// Generic type that conditionally includes RAW
type TPeriodType<T extends boolean> = T extends true
  ? IDtoEMetricResourceValuePeriodWithRaw
  : IDtoEMetricResourceValuePeriod;

export function CComboboxMetricResourceValuePeriod<
  TIncludeRaw extends boolean = false,
>({
  includeRaw,
  ...props
}: Omit<ICComboboxProps<TPeriodType<TIncludeRaw>>, "list"> & {
  includeRaw?: TIncludeRaw;
}) {
  const { t } = useTranslation();

  const metricResourceValuePeriodMap = useMetricResourceValuePeriodMap();
  const list = useMapToComboList(metricResourceValuePeriodMap);

  const filteredList = useMemo(
    () =>
      includeRaw
        ? ([
            {
              value: "RAW" as const,
              label: t("raw"),
              icon: File,
            },
            ...list,
          ] as ISelectListItem<TPeriodType<TIncludeRaw>>[])
        : list,
    [includeRaw, list, t],
  );

  return (
    <CCombobox
      placeholder={t("selectAPeriod")}
      {...props}
      list={filteredList}
    />
  );
}
