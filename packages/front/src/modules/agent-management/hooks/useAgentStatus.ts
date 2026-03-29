/**
 * @file: useAgentStatus.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 03.10.2025
 * Last Modified Date: 03.10.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IDtoEAgentStatTypeNullable } from "common/build-api-schema";
import { useMemo } from "react";

import { IAgentStatus } from "../interfaces/IAgentStatus";

export function useAgentStatus(
  statType: IDtoEAgentStatTypeNullable,
  datetimeStat: string | null,
) {
  return useMemo<IAgentStatus>(() => {
    if (statType === null || datetimeStat === null) {
      return "NEVER_CONNECTED";
    }

    if (statType === "SHUTDOWN") {
      return "OFFLINE";
    }

    const timeStat = new Date(datetimeStat).getTime();
    const timeNow = Date.now();

    // Elapsed time is greater than 1.5 minutes, it is stale
    if (timeNow - timeStat > 1000 * 60 * 1.5) {
      return "STALE";
    }

    return "ONLINE";
  }, [datetimeStat, statType]);
}
