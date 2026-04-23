import { IDtoEPermission } from "common/build-api-schema";
import { useContext, useMemo } from "react";

import { ContextSession } from "../contexts/ContextSession";
import { hasPermission } from "../utils/hasPermission";

export function usePermission(permission: IDtoEPermission) {
  const { session } = useContext(ContextSession);
  return useMemo(
    () => hasPermission(session.permissions, permission),
    [permission, session.permissions],
  );
}
