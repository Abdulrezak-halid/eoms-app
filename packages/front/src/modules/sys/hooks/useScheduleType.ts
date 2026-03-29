import { useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IValueLabelMap } from "@m/base/interfaces/IValueLabelMap";

import { IDtoEJobType } from "../interfaces/IDtoServiceJob";

export function useScheduleTypeMap() {
  const { t } = useTranslation();
  return useMemo<IValueLabelMap<IDtoEJobType>>(
    () => ({
      CRON: { label: t("cron") },
      ONE_TIME: { label: t("oneTime") },
      IMMEDIATE: { label: t("immediate") },
    }),
    [t],
  );
}
