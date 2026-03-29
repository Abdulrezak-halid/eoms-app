/**
 * @file: CBadgeMetricResource.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 27.12.2025
 * Last Modified Date: 27.12.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IDtoMetricResourceLabel } from "common/build-api-schema";
import { useMemo } from "react";
import { Gauge } from "lucide-react";

import { CBadge } from "@m/core/components/CBadge";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { renderMetricResourceLabel } from "../utils/renderMetricResourceLabel";

export function CBadgeMetricResource({
  value,
}: {
  value: {
    metric?: { name: string };
    labels: IDtoMetricResourceLabel[];
  };
}) {
  const { t } = useTranslation();
  const labelsRendered = useMemo(
    () =>
      value.labels
        .map((d) => renderMetricResourceLabel(t, d))
        .filter(Boolean)
        .join(", "),
    [value.labels, t],
  );

  return (
    <CBadge
      icon={Gauge}
      value={
        value.metric?.name
          ? `${value.metric.name} (${labelsRendered})`
          : labelsRendered
      }
    />
  );
}
