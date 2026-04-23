import {
  IDtoEAdvancedRegressionSuggestionFail,
  IDtoEMessageQueueTaskStatus,
} from "common/build-api-schema";
import { CircleCheck, CircleX, Clock } from "lucide-react";
import { useMemo } from "react";

import { CBadge } from "@m/core/components/CBadge";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CBadgeMessageQueueTaskStatus({
  value,
  failInfo,
}: {
  value: IDtoEMessageQueueTaskStatus;
  failInfo?: IDtoEAdvancedRegressionSuggestionFail;
}) {
  const { t } = useTranslation();

  const info = useMemo(() => {
    switch (value) {
      case "PENDING": {
        return {
          className: "text-amber-700 dark:text-amber-300",
          icon: Clock,
          label: t("pending"),
        };
      }
      case "SUCCESS": {
        return {
          className: "text-green-700 dark:text-green-300",
          icon: CircleCheck,
          label: t("success"),
        };
      }
      case "FAILED": {
        const failLabel =
          failInfo === "INSUFFICIENT_DATA"
            ? t("insufficientData")
            : failInfo === "MESSAGE_PRODUCE_FAILED" || failInfo === "INTERNAL"
              ? t("somethingWentWrong")
              : t("failed");

        return {
          className: "text-red-700 dark:text-red-300",
          icon: CircleX,
          label: failLabel,
        };
      }
    }
  }, [failInfo, t, value]);

  return (
    <CBadge className={info.className} icon={info.icon} value={info.label} />
  );
}
