import { IDtoEPlanType } from "common/build-api-schema";
import { useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IValueLabelMap } from "@m/base/interfaces/IValueLabelMap";

export function usePlanTypeMap() {
  const { t } = useTranslation();
  return useMemo<IValueLabelMap<IDtoEPlanType>>(
    () => ({
      EXTERNAL: { label: t("planTypeExternal") },
      INTERNAL: { label: t("planTypeInternal") },
    }),
    [t],
  );
}
