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
