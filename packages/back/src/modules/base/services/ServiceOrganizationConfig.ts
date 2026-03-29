import { and, eq } from "drizzle-orm";

import { IContextOrg } from "@m/core/interfaces/IContext";

import { TbOrganizationConfig } from "../orm/TbOrganizationConfig";

export namespace ServiceOrganizationConfig {
  export async function get(
    c: IContextOrg,
    key: string,
  ): Promise<unknown | null> {
    const [rec] = await c.db
      .select({
        key: TbOrganizationConfig.key,
        value: TbOrganizationConfig.value,
      })
      .from(TbOrganizationConfig)
      .where(
        and(
          eq(TbOrganizationConfig.orgId, c.orgId),
          eq(TbOrganizationConfig.key, key),
        ),
      );

    return rec ? rec.value : null;
  }

  export async function set(c: IContextOrg, key: string, value: unknown) {
    await c.db
      .insert(TbOrganizationConfig)
      .values({ orgId: c.orgId, key, value })
      .onConflictDoUpdate({
        target: [TbOrganizationConfig.orgId, TbOrganizationConfig.key],
        set: { value },
      });

    c.logger.info(
      { name: "ServiceOrganizationConfig", value },
      "Organization configuration updated.",
    );
  }
}
