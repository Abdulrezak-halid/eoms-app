/**
 * @file: TbUserPermission.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 05.03.2025
 * Last Modified Date: 05.03.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { DataPermissions } from "../interfaces/IPermission";
import { TbOrganization } from "./TbOrganization";
import { TbUser } from "./TbUser";

export const TbUserPermission = pgTable(
  "tb_user_permissions",
  {
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    userId: uuid()
      .notNull()
      .references(() => TbUser.id),
    permission: text({ enum: DataPermissions }).notNull(),
  },
  (t) => [
    // orgId, userId: find user permission
    uniqueIndex().on(t.orgId, t.userId, t.permission),
  ],
);
