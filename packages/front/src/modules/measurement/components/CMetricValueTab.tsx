import { IUnit, IUnitGroup, UtilUnit } from "common";
import { Upload } from "lucide-react";
import { useMemo } from "react";

import { CBadgeUnit } from "@m/base/components/CBadgeUnit";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CComboboxUnit } from "@m/base/components/CComboboxUnit";
import { CDropdown, IDropdownListItem } from "@m/core/components/CDropdown";
import { CTab, ITabListItem } from "@m/core/components/CTab";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CBadgeMetricResourceValuePeriod } from "./CBadgeMetricResourceValuePeriod";
import { CComboboxMetricResource } from "./CComboboxMetricResource";
import {
  CComboboxMetricResourceValuePeriod,
  IDtoEMetricResourceValuePeriodWithRaw,
} from "./CComboboxMetricResourceValuePeriod";

export function CMetricValueTab({
  page = "metric",
  id,
  resourceId,
  onResourceChange,
  unitGroup,
  unit,
  onUnitChange,
  period,
  onPeriodChange,
  includeRaw = true,
  load,
}: {
  page?: "metric" | "significant-energy-user";
  id: string;
  resourceId?: string;
  onResourceChange?: (value: string | undefined) => void;
  unitGroup: IUnitGroup;
  unit: IUnit;
  onUnitChange: (value: IUnit | undefined) => void;
  period: IDtoEMetricResourceValuePeriodWithRaw | undefined;
  onPeriodChange?: (
    value: IDtoEMetricResourceValuePeriodWithRaw | undefined,
  ) => void;
  includeRaw?: boolean;
  load: () => Promise<void>;
}) {
  const { t } = useTranslation();

  const tabList = useMemo<ITabListItem[]>(
    () => [
      { label: t("graph"), path: `/measurements/${page}/values/graph/${id}` },
      { label: t("table"), path: `/measurements/${page}/values/table/${id}` },
    ],
    [id, page, t],
  );

  const importDropdownItems = useMemo<IDropdownListItem<undefined>[]>(
    () => [
      {
        icon: Upload,
        label: t("importExcelFile"),
        path: `/measurement/metric/values/import/${id}`,
      },
    ],
    [t, id],
  );

  const unitsInGroup = useMemo(
    () => UtilUnit.getUnitsByGroup(unitGroup),
    [unitGroup],
  );

  return (
    <div className="flex flex-col @md:flex-row @md:justify-between @md:items-center gap-x-4 gap-y-2">
      <div className="flex-none">
        <CTab list={tabList} />
      </div>

      <div className="flex gap-2 @sm:items-center justify-end min-w-0 flex-col @sm:flex-row">
        {onResourceChange && (
          <div className="min-w-0 w-full">
            <CComboboxMetricResource
              value={resourceId}
              onChange={onResourceChange}
              metricId={id}
              noClear
              required
            />
          </div>
        )}

        <div className="flex gap-2 items-center">
          <div className="w-1/2 text-right @sm:w-auto">
            {onPeriodChange ? (
              <CComboboxMetricResourceValuePeriod
                value={period}
                onChange={onPeriodChange}
                includeRaw={includeRaw}
                noClear
              />
            ) : (
              period &&
              period !== "RAW" && (
                <CBadgeMetricResourceValuePeriod value={period} />
              )
            )}
          </div>

          {unitsInGroup.length === 1 ? (
            <CBadgeUnit value={unit} />
          ) : (
            <div className="w-1/2 @sm:w-auto">
              <CComboboxUnit
                unitGroup={unitGroup}
                value={unit}
                onChange={onUnitChange}
                noClear
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-none justify-end">
          <CButtonRefresh onClick={load} noHideLabel />
          <CDropdown list={importDropdownItems} />
        </div>
      </div>
    </div>
  );
}
