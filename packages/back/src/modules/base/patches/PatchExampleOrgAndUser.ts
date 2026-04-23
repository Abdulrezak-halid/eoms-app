/**
 * @file: PatchExampleOrgAndUser.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 27.02.2025
 * Last Modified Date: 27.02.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { EXAMPLE_USER_EMAIL, EXAMPLE_USER_NAME } from "common";

import { ROOT_ORG_ID, ROOT_ORG_USER_ID } from "@/constants";

import { IContextUser } from "@m/core/interfaces/IContext";
import { ServiceRuntimePatcher } from "@m/core/services/ServiceRuntimePatcher";

import { ServiceOrganization } from "../services/ServiceOrganization";

export const PatchExampleOrgAndUser = ServiceRuntimePatcher.create(
  "EXAMPLE_ORG_AND_USER",
  async (c) => {
    await c.db.transaction(async (tx) => {
      const cSys: IContextUser = {
        ...c,
        orgId: ROOT_ORG_ID,
        db: tx,
        session: {
          orgId: ROOT_ORG_ID,
          userId: ROOT_ORG_USER_ID,
          token: "Example",
          permissions: ["/"],
          orgPlan: { features: ["SYSTEM"] },
        },
      };

      await ServiceOrganization.create(cSys, {
        displayName: "Example Org.",
        fullName: "Example Organization",
        address: "Example Address",
        phones: ["+1234567890"],
        email: "example@example.com",
        config: {
          energyResources: ["ELECTRIC", "GAS", "DIESEL", "WATER", "SOLID_FUEL"],
        },
        workspace: "example",
        plan: {
          features: [
            "ACCESS_TOKEN",
            "ANALYSES",
            "ISO50001",
            "MEASUREMENT",
            "ORGANIZATION_PARTNER",
            "PRODUCT",
            "QDMS",
            "RENERYO_AGENT",
            "REPORT",
            "SUPPLY_CHAIN",
            "UNCATEGORIZED",
            "USER_MANAGEMENT",
            "USER_TOKEN",
          ],
          maxUserCount: 10,
        },
        adminEmail: EXAMPLE_USER_EMAIL,
        adminName: EXAMPLE_USER_NAME,
      });

      await ServiceOrganization.create(cSys, {
        displayName: "Example Org 2",
        fullName: "Example Organization 2",
        address: "Example Address",
        phones: ["+1234567890"],
        email: "example2@example.com",
        config: {
          energyResources: ["ELECTRIC", "GAS", "DIESEL", "WATER", "SOLID_FUEL"],
        },
        workspace: "example2",
        plan: {
          features: [
            "ACCESS_TOKEN",
            "ANALYSES",
            "ISO50001",
            "MEASUREMENT",
            "ORGANIZATION_PARTNER",
            "PRODUCT",
            "QDMS",
            "RENERYO_AGENT",
            "REPORT",
            "SUPPLY_CHAIN",
            "UNCATEGORIZED",
            "USER_MANAGEMENT",
            "USER_TOKEN",
          ],
          maxUserCount: 10,
        },
        adminEmail: "admin@example2.com",
        adminName: "exampleadmin",
      });
    });
  },
);
