import { IDtoETrainingCategory } from "common/build-api-schema";
import { useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IValueLabelMap } from "@m/base/interfaces/IValueLabelMap";

export function useTrainingMap() {
  const { t } = useTranslation();
  return useMemo<IValueLabelMap<IDtoETrainingCategory>>(
    () => ({
      AWARENESS: { label: t("awareness") },
      COMPETENCE: { label: t("competence") },
    }),
    [t],
  );
}
