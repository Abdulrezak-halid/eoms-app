import { eq } from "drizzle-orm";

import {
  ROOT_ORG_ID,
  ROOT_ORG_USER_ID,
  SYSADMIN_EMAIL,
  SYSADMIN_NAME,
  SYSADMIN_PASSWORD,
} from "@/constants";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";
import { ServiceRuntimePatcher } from "@m/core/services/ServiceRuntimePatcher";
import { UtilHash } from "@m/core/utils/UtilHash";

import { TbUserPermission } from "../orm/TbUserPermission";

export const PatchSysOrgAndUser = ServiceRuntimePatcher.create(
  "SYS_ORG_AND_USER",
  async (c) => {
    await c.db.transaction(async (tx) => {
      const [recOrg] = await tx
        .insert(TbOrganization)
        .values({
          id: ROOT_ORG_ID,
          displayName: "System",
          fullName: "System",
          address: "System Address",
          phones: ["+1234567890"],
          email: "system@system.com",
          config: {
            energyResources: [],
          },
          workspace: "localhost",
          plan: {
            features: ["SYSTEM"],
            maxUserCount: 2,
          },
          createdAt: c.nowDatetime,
          createdByOrgId: null,
          createdBy: null,
        })
        .returning({ id: TbOrganization.id });

      await tx
        .update(TbOrganization)
        .set({ createdByOrgId: recOrg.id })
        .where(eq(TbOrganization.id, recOrg.id));

      const passwordHash = await UtilHash.sha256(SYSADMIN_PASSWORD);
      const [recUser] = await tx
        .insert(TbUser)
        .values({
          id: ROOT_ORG_USER_ID,
          orgId: recOrg.id,
          name: SYSADMIN_NAME,
          email: SYSADMIN_EMAIL,
          passwordHash,
          createdAt: c.nowDatetime,
        })
        .returning({ id: TbUser.id });

      await tx.insert(TbUserPermission).values({
        orgId: recOrg.id,
        userId: recUser.id,
        permission: "/",
      });
    });
  },
);
