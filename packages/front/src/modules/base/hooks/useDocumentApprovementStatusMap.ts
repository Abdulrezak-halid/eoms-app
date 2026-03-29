import { IDtoEDocumentApprovementStatus } from "common/build-api-schema";
import { useMemo } from "react";
import { CircleCheck, CircleX, Clock } from "lucide-react";

import { useTranslation } from "@m/core/hooks/useTranslation";

import { IValueLabelMap } from "../interfaces/IValueLabelMap";

export function useDocumentApprovementStatusMap() {
  const { t } = useTranslation();
  return useMemo<IValueLabelMap<IDtoEDocumentApprovementStatus>>(
    () => ({
      APPROVED: {
        icon: CircleCheck,
        label: t("documentApprovementStatusApproved"),
      },
      PENDING: {
        icon: Clock,
        label: t("documentApprovementStatusPending"),
      },
      REJECTED: {
        icon: CircleX,
        label: t("documentApprovementStatusRejected"),
      },
    }),
    [t],
  );
}
