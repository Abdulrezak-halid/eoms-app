/**
 * @file: guardPermission.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 05.03.2025
 * Last Modified Date: 05.03.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { EApiFailCode } from "common";
import { Context, Next } from "hono";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IHonoContextUser } from "@m/core/interfaces/IContext";

import { IPermission } from "../interfaces/IPermission";

export function checkPermission(
  userPermissions: IPermission[],
  permissionToCheck: IPermission,
) {
  for (const perm of userPermissions) {
    if (permissionToCheck.startsWith(perm)) {
      return;
    }
  }
  throw new ApiException(
    EApiFailCode.FORBIDDEN,
    "You do not have permisson for this operation.",
  );
}

export function guardPermission(permission: IPermission) {
  return async (c: Context<IHonoContextUser>, next: Next) => {
    checkPermission(c.var.session.permissions, permission);
    await next();
  };
}
