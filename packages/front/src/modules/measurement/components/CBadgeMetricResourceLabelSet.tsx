import { IDtoMetricResourceLabel } from "common/build-api-schema";
import { Tags } from "lucide-react";
import { useMemo } from "react";

import { CBadge } from "@m/core/components/CBadge";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { renderMetricResourceLabel } from "../utils/renderMetricResourceLabel";

export function CBadgeMetricResourceLabelSet({
  value,
}: {
  value: IDtoMetricResourceLabel[];
}) {
  const { t } = useTranslation();
  const labelsRendered = useMemo(
    () =>
      value
        .map((d) => renderMetricResourceLabel(t, d))
        .filter(Boolean)
        .join(", "),
    [value, t],
  );

  return <CBadge icon={Tags} value={labelsRendered} />;
}
