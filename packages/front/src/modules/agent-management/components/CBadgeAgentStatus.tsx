/**
 * @file: CBadgeAgentStatus.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 02.10.2025
 * Last Modified Date: 02.10.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IDtoEAgentStatTypeNullable } from "common/build-api-schema";
import { Server, ServerCog, ServerOff } from "lucide-react";
import { useMemo } from "react";

import { CBadge } from "@m/core/components/CBadge";
import { IconType } from "@m/core/components/CIcon";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { useAgentStatus } from "../hooks/useAgentStatus";
import { IAgentStatus } from "../interfaces/IAgentStatus";

type CBadgeAgentStatusProps =
  | { value: IAgentStatus }
  | { statType: IDtoEAgentStatTypeNullable; datetimeStat: string | null };

export function CBadgeAgentStatus(props: CBadgeAgentStatusProps) {
  const { t } = useTranslation();

  const statType = "statType" in props ? props.statType : null;
  const datetimeStat = "datetimeStat" in props ? props.datetimeStat : null;
  const computedStatus = useAgentStatus(statType, datetimeStat);

  const status = useMemo(() => {
    if ("value" in props) {
      return props.value;
    }
    return computedStatus;
  }, [props, computedStatus]);

  const config = useMemo<{
    className?: string;
    icon: IconType;
    label: string;
  }>(() => {
    switch (status) {
      case "NEVER_CONNECTED": {
        return {
          icon: ServerOff,
          label: t("agentStatusNeverConnected"),
        };
      }
      case "ONLINE": {
        return {
          className: "text-green-700 dark:text-green-300",
          icon: Server,
          label: t("agentStatusOnline"),
        };
      }
      case "OFFLINE": {
        return {
          className: "text-red-700 dark:text-red-300",
          icon: ServerOff,
          label: t("agentStatusOffline"),
        };
      }
      case "STALE": {
        return {
          className: "text-amber-700 dark:text-amber-300",
          icon: ServerCog,
          label: t("agentStatusStale"),
        };
      }
    }
  }, [t, status]);

  return (
    <CBadge
      className={config.className}
      icon={config.icon}
      value={config.label}
    />
  );
}
