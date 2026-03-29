/**
 * @file: usePermission.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 28.09.2025
 * Last Modified Date: 28.09.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
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
