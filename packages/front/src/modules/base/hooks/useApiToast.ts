import { EApiFailCode } from "common";
import { useCallback, useContext } from "react";
import { TrafficCone, TriangleAlert, WifiOff } from "lucide-react";

import { ContextToast } from "@m/core/contexts/ContextToast";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { ContextSession } from "../contexts/ContextSession";

export function useApiToast() {
  const { push } = useContext(ContextToast);
  const { t } = useTranslation();
  const { clearSession } = useContext(ContextSession);

  return useCallback(
    (
      res: { error?: string },
      messageLookup?: string | Partial<Record<EApiFailCode, string>>,
    ) => {
      if (res.error === undefined) {
        push(
          typeof messageLookup === "string"
            ? messageLookup
            : t("operationIsSuccessful"),
          "success",
        );
      } else {
        const customMsg =
          typeof messageLookup === "object" &&
          messageLookup[res.error as EApiFailCode];
        if (customMsg) {
          push(customMsg, "danger");
          return;
        }

        if (
          res?.error === EApiFailCode.UNAUTHORIZED &&
          !import.meta.env.VITE_NO_LOGIN
        ) {
          clearSession();
          return;
        }

        switch (res.error) {
          case EApiFailCode.ALREADY_EXISTS: {
            push(t("recordIsAlreadyExists"), "danger");
            return;
          }
          case EApiFailCode.RECORD_IN_USE: {
            push(t("recordIsInUse"), "danger");
            return;
          }
          case EApiFailCode.FOREIGN_KEY_IN_USE: {
            push(t("recordIsInUseCannotBeDeleted"), "danger");
            return;
          }
          case EApiFailCode.FOREIGN_KEY_NOT_FOUND: {
            push(t("relatedRecordIsNotFound"), "danger");
            return;
          }
          case EApiFailCode.NOT_FOUND: {
            push(t("relatedRecordIsNotFound"), "danger");
            return;
          }
          case EApiFailCode.FORBIDDEN: {
            push(t("forbiddenAction"), "warning", { icon: TriangleAlert });
            return;
          }
          case EApiFailCode.PLAN_LIMIT_EXCEEDED: {
            push(t("planLimitsExceeded"), "warning", { icon: TriangleAlert });
            return;
          }
          case EApiFailCode.PLAN_DISABLED_OP: {
            push(t("planDisabledOp"), "warning", { icon: TriangleAlert });
            return;
          }
          case EApiFailCode.TIMEOUT: {
            push(t("msgRequestTimeout"), "warning", { icon: WifiOff });
            return;
          }
          case EApiFailCode.MAINTENANCE: {
            push(t("msgServerMaintenance"), "warning", {
              icon: TrafficCone,
            });
            return;
          }
          default: {
            push(t("somethingWentWrong"), "danger");
            return;
          }
        }
      }
    },
    [push, t, clearSession],
  );
}
