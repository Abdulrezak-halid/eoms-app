import { IDtoMetricFileDraftContentRecord } from "common/build-api-schema";
import { useMemo } from "react";

import { CDisplayDatetime } from "@m/base/components/CDisplayDatetime";
import { CDisplayNumber } from "@m/core/components/CDisplayNumber";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CBadgeMetricResourceLabel } from "./CBadgeMetricResourceLabel";

export function CMetricFileDraftTable({
  content,
}: {
  content: IDtoMetricFileDraftContentRecord[];
}) {
  const { t } = useTranslation();

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("datetime") },
      { label: t("value"), right: true },
      { label: t("labels") },
    ],
    [t],
  );

  const tableData = useMemo(
    () =>
      content.map((item) => [
        <CDisplayDatetime key="datetime" value={item.datetime} />,
        <CDisplayNumber key="value" value={item.value} minDecimals={2} />,
        <CGridBadge key="labels" className="gap-1">
          {item.labels.length > 0 ? (
            item.labels.map((label, i) => (
              <CBadgeMetricResourceLabel key={i} value={label} />
            ))
          ) : (
            <span>-</span>
          )}
        </CGridBadge>,
      ]),
    [content],
  );

  return <CTable header={header}>{tableData}</CTable>;
}
