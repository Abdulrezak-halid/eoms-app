import { desc, eq } from "drizzle-orm";
import type { Context } from "hono";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser, sqlUserDisplayName } from "@m/base/orm/TbUser";
import { ServiceSession } from "@m/base/services/ServiceSession";
import type {
  IContextCore,
  IHonoContextUser,
} from "@m/core/interfaces/IContext";
import { ServiceCookie } from "@m/core/services/ServiceCookie";
import { UtilDb } from "@m/core/utils/UtilDb";

export namespace ServiceSysUser {
  export async function getAll(c: IContextCore) {
    return await c.db
      .select({
        id: TbUser.id,
        displayName: sqlUserDisplayName(),
        email: TbUser.email,
        lastSessionAt: UtilDb.isoDatetime(TbUser.lastSessionAt),
        orgDisplayName: TbOrganization.displayName,
      })
      .from(TbUser)
      .innerJoin(TbOrganization, eq(TbOrganization.id, TbUser.orgId))
      .orderBy(desc(TbUser.lastSessionAt));
  }

  export async function impersonateUser(
    c: Context<IHonoContextUser>,
    id: string,
  ) {
    await ServiceSession.remove(c.var, c.var.session.token);

    const { token } = await ServiceSession.create(c.var, id);

    await ServiceCookie.set(c, token);

    return await ServiceSession.getUserData(c.var, id);
  }
}
