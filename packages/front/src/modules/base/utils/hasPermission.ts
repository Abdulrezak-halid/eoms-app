/**
 * @file: hasPermission.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 04.04.2025
 * Last Modified Date: 04.04.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IDtoEPermission } from "common/build-api-schema";

export function hasPermission(
  userPermissions: IDtoEPermission[],
  permission?: IDtoEPermission,
) {
  if (!permission) {
    return true;
  }

  for (const perm of userPermissions) {
    if (permission.startsWith(perm)) {
      return true;
    }
  }
  return false;
}
