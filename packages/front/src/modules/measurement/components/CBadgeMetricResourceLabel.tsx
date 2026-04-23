import { IDtoMetricResourceLabel } from "common/build-api-schema";
import { Tag } from "lucide-react";
import { useMemo } from "react";

import { CBadge } from "@m/core/components/CBadge";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { renderMetricResourceLabel } from "@m/measurement/utils/renderMetricResourceLabel";

export function CBadgeMetricResourceLabel({
  value,
}: {
  value: IDtoMetricResourceLabel;
}) {
  const { t } = useTranslation();

  const display = useMemo(
    () => renderMetricResourceLabel(t, value),
    [t, value],
  );

  return <CBadge icon={Tag} value={display} />;
}
