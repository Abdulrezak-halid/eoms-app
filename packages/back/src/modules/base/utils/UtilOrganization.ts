import { EApiFailCode } from "common";
import { ColumnBaseConfig, and, count, eq, inArray } from "drizzle-orm";
import { PgColumn, PgTableWithColumns } from "drizzle-orm/pg-core";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";

export namespace UtilOrganization {
  export async function checkOwnership(
    c: IContextUser,
    ids: string[],
    table: PgTableWithColumns<{
      name: string;
      schema: undefined;
      columns: {
        id: PgColumn<ColumnBaseConfig<"string", "PgUUID">>;
        orgId: PgColumn<ColumnBaseConfig<"string", "PgUUID">>;
      };
      dialect: "pg";
    }>,
  ): Promise<void> {
    if (!ids.length) {
      return;
    }

    const uniqueIds = [...new Set(ids)];

    const [row] = await c.db
      .select({ count: count() })
      .from(table)
      .where(
        and(eq(table.orgId, c.session.orgId), inArray(table.id, uniqueIds)),
      );

    if (row.count !== uniqueIds.length) {
      throw new ApiException(
        EApiFailCode.FOREIGN_KEY_NOT_FOUND,
        "Records or record do not belong to organization or do not exist.",
      );
    }
  }
}
