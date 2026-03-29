/**
 * @file: DbUtils.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 09.02.2025
 * Last Modified Date: 09.02.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { EApiFailCode } from "common";
import {
  AnyColumn,
  ColumnBaseConfig,
  SQL,
  and,
  eq,
  gt,
  gte,
  lt,
  lte,
  max,
  ne,
  sql,
} from "drizzle-orm";
import { PgColumn, PgTable } from "drizzle-orm/pg-core";
import { QueryResult } from "pg";

import { ApiException } from "../exceptions/ApiException";
import { IContextUser } from "../interfaces/IContext";

type SQLExpression<T = unknown> =
  | SQL<T>
  | SQL.Aliased<T>
  | AnyColumn<{ data: T }>;

export class SQLCaseWhen<T = never> {
  cases: SQL<T>;
  constructor(init?: SQL<T> | SQLCaseWhen<T>) {
    // Clone the initial cases to enable re-use.
    this.cases = init
      ? sql`${init instanceof SQLCaseWhen ? init.cases : init}`
      : sql<T>`CASE`;
  }

  /**
   * Add a case to the case expression.
   */
  when<Then>(whenExpr: SQLExpression, thenExpr: SQLExpression<Then>) {
    this.cases.append(sql` WHEN ${whenExpr} THEN ${thenExpr}`);
    return this as SQLCaseWhen<T | Then>;
  }

  /**
   * Add the else clause to the case expression.
   */
  else<Else>(elseExpr: SQLExpression<Else>) {
    return sql`${this.cases} ELSE ${elseExpr} END` as SQL<T | Else>;
  }

  /**
   * Finish the case expression without an else clause, which will
   * return `null` if no case matches.
   */
  elseNull() {
    return sql`${this.cases} END` as SQL<T | null>;
  }
}

export namespace UtilDb {
  // Depending on db driver, meta query result type is different
  //   (real postgres and test memory postgres drivers)
  //   This tool provides consistency.
  export function getAffectedRows(queryResult: QueryResult) {
    return queryResult.rowCount === undefined
      ? (queryResult as unknown as { affectedRows: number }).affectedRows
      : queryResult.rowCount || 0;
  }

  export function jsonAgg<
    T extends Record<string, PgColumn | SQL<unknown> | SQL.Aliased<unknown>>,
  >(
    obj: T,
    options?: {
      excludeNull?: boolean | PgColumn;
      distinct?: boolean;
      // orderBy?: T[keyof T] & PgColumn;
      orderBy?:
        | PgColumn
        | SQL.Aliased<unknown>
        | (PgColumn | SQL.Aliased<unknown>)[];
    },
  ): SQL<
    {
      [K in keyof T]: T[K] extends { _: { data: unknown } }
        ? T[K]["_"]["data"]
        : T[K] extends SQL<infer U>
          ? U
          : T[K] extends SQL.Aliased<infer U>
            ? U
            : never;
    }[]
  > {
    const strings = [];
    const args = [];
    let i = 0;

    // If excludeNull is enabled, null records are excluded from agregated values.
    //   It is designed to use aggregation with "leftJoin" tables.
    // Query for excluding nulls is like this;
    // COALESCE(json_agg(t) FILTER (WHERE t.id IS NOT NULL), '[]')
    // Use first field as null check field.
    // If excludeNull is true, pick first column from the list for the check.
    // If excludeNull is a column, use the column for the check.
    const nullCheckField =
      options?.excludeNull &&
      (options.excludeNull === true
        ? Object.values(obj)[0]
        : options.excludeNull);

    // Distinct option removes dupplicated records.
    //   It is designed to use with double unrelated table joins.
    const distinctQueryPart = options?.distinct ? "DISTINCT " : "";

    for (const key in obj) {
      if (i === 0) {
        if (nullCheckField) {
          strings.push(
            `COALESCE(json_agg(${
              distinctQueryPart
            }jsonb_build_object('${key}', `,
          );
        } else {
          strings.push(
            `json_agg(${distinctQueryPart}jsonb_build_object('${key}', `,
          );
        }
      } else {
        strings.push(`, '${key}', `);
      }
      args.push(obj[key]);
      ++i;
    }

    function processOrderByParams(
      cols:
        | PgColumn
        | SQL.Aliased<unknown>
        | (PgColumn | SQL.Aliased<unknown>)[],
    ) {
      if (!Array.isArray(cols)) {
        return args.push(cols);
      }
      if (!cols.length) {
        throw new Error(
          "Json aggregation order by column array length cannot be zero.",
        );
      }
      args.push(cols[0]);
      for (let iCol = 1; iCol < cols.length; ++iCol) {
        strings.push(", ");
        args.push(cols[iCol]);
      }
    }

    if (nullCheckField) {
      if (options?.orderBy) {
        strings.push(") ORDER BY ");
        processOrderByParams(options.orderBy);
        strings.push(") FILTER (WHERE ");
      } else {
        strings.push(")) FILTER (WHERE ");
      }
      args.push(nullCheckField);
      strings.push(" IS NOT NULL), '[]')");
    } else {
      if (options?.orderBy) {
        strings.push(") ORDER BY ");
        processOrderByParams(options.orderBy);
        strings.push(")");
      } else {
        strings.push("))");
      }
    }

    return sql<
      {
        [K in keyof T]: T[K] extends { _: { data: unknown } }
          ? T[K]["_"]["data"]
          : T[K] extends SQL<infer U>
            ? U
            : T[K] extends SQL.Aliased<infer U>
              ? U
              : never;
      }[]
    >(
      // TODO TemplateStringsArray has "raw" field.
      // May lead errors using like here.
      strings as unknown as TemplateStringsArray,
      ...args,
    );
  }

  export function arrayAgg<T extends PgColumn, TExcludeNull extends boolean>(
    column: T,
    options?: { excludeNull?: TExcludeNull; distinct?: boolean },
  ): SQL<(T["_"]["data"] | (TExcludeNull extends true ? never : null))[]> {
    // If excludeNull is enabled, null records are excluded from agregated values.
    //   It is designed to use aggregation with "leftJoin" tables.
    // Query for excluding nulls is like this;
    // COALESCE(array_agg(t) FILTER (WHERE t.id IS NOT NULL), '{}')

    // Distinct option removes dupplicated records.
    //   It is designed to use with double unrelated table joins.
    const distinctQueryPart = options?.distinct ? sql`DISTINCT ` : sql``;

    if (options?.excludeNull) {
      return sql`coalesce(array_agg(${distinctQueryPart}${column}) FILTER (WHERE ${column} IS NOT NULL),'{}')`;
    }

    return sql`coalesce(array_agg(${distinctQueryPart}${column}),'{}')`;
  }

  export function isoDatetime<T extends string | null = string | null>(
    field: SQL<T> | SQL.Aliased<T>,
  ): SQL<T>;
  export function isoDatetime<
    T extends PgColumn<ColumnBaseConfig<"string", "PgTimestampString">>,
  >(field: T): SQL<T["_"]["notNull"] extends false ? string | null : string>;
  export function isoDatetime(
    field:
      | SQL<string | null>
      | SQL.Aliased<string | null>
      | PgColumn<ColumnBaseConfig<"string", "PgTimestampString">>,
  ) {
    return sql<string>`to_char(${
      field
    }::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')`;
  }

  export function caseWhen<Then>(
    whenExpr: SQLExpression,
    thenExpr: SQLExpression<Then>,
  ) {
    return new SQLCaseWhen().when(whenExpr, thenExpr);
  }

  export async function reorderRecords<
    TColumnField extends string,
    TColumnValue extends number | string,
    TTable extends {
      id: PgColumn<ColumnBaseConfig<"string", "PgUUID">>;
      index: PgColumn<ColumnBaseConfig<"number", "PgInteger">>;
      orgId: PgColumn<ColumnBaseConfig<"string", "PgUUID">>;
    } & {
      [K in TColumnField]: TColumnValue extends number
        ? PgColumn<ColumnBaseConfig<"number", "PgInteger">>
        : PgColumn<ColumnBaseConfig<"string", "PgUUID">>;
    },
  >(
    c: IContextUser,
    table: TTable,
    options: {
      columnField: TColumnField;
      columnValue: TColumnValue;

      updatedId?: string;
      index: number;
    },
  ) {
    // Column column is optional, and it was not possible to infer using types,
    //   that's why it is casted explicitly.
    const _table = table as unknown as PgTable;
    const tableColumnColumn = options.columnField && table[options.columnField];

    await c.db.transaction(async (tx) => {
      // Make a filter
      const filter: SQL[] = [];
      if (tableColumnColumn && options.columnValue !== undefined) {
        filter.push(eq(tableColumnColumn, options.columnValue));
      }

      // Select the maximum index
      const [maximum] = await tx
        .select({
          index: max(table.index),
        })
        .from(_table)
        .where(and(...filter, eq(table.orgId, c.session.orgId)));

      if (typeof maximum.index === "number") {
        if (options.index > maximum.index + 1) {
          throw new ApiException(EApiFailCode.BAD_REQUEST, "Invalid index");
        }
      } else {
        if (options.index !== 0) {
          throw new ApiException(EApiFailCode.BAD_REQUEST, "Invalid index");
        }
      }

      // For update method
      if (options.updatedId) {
        const oldRow = (
          await tx
            .select({ index: table.index })
            .from(_table)
            .where(
              and(
                eq(table.orgId, c.session.orgId),
                eq(table.id, options.updatedId),
              ),
            )
        )[0] as { index: number };

        if (!oldRow) {
          throw new ApiException(EApiFailCode.NOT_FOUND, "Record not found");
        }

        const oldIndex = oldRow.index;

        if (options.columnValue !== undefined && tableColumnColumn) {
          // We are taking old column
          const [oldColumn] = await tx
            .select({ column: tableColumnColumn })
            .from(_table)
            .where(
              and(
                eq(table.orgId, c.session.orgId),
                eq(table.id, options.updatedId),
              ),
            );

          // Update all the index from old one except the current one
          await tx
            .update(_table)
            .set({ index: sql`${table.index}-1` })
            .where(
              and(
                eq(table.orgId, c.session.orgId),
                eq(tableColumnColumn, oldColumn.column),
                gte(table.index, oldIndex),
                ne(table.id, options.updatedId),
              ),
            );

          // Now we are in the new column
          await tx
            .update(_table)
            .set({ [options.columnField]: options.columnValue })
            .where(
              and(
                eq(table.orgId, c.session.orgId),
                eq(table.id, options.updatedId),
              ),
            );

          await tx
            .update(_table)
            .set({ index: sql`${table.index}+1` })
            .where(
              and(
                eq(table.orgId, c.session.orgId),
                eq(tableColumnColumn, options.columnValue),
                gte(table.index, options.index),
                ne(table.id, options.updatedId),
              ),
            );

          await tx
            .update(_table)
            .set({ index: options.index })
            .where(
              and(
                eq(table.orgId, c.session.orgId),
                eq(table.id, options.updatedId),
              ),
            );

          return;
        }

        // If old and new index are the same, no need to update
        if (oldIndex === options.index) {
          return;
        }

        // if new index greater than old we need to decrement all rows between old and new index
        // example => 1,2,3,4,5 we change the index of 2 to 5 =>  old 3,4,5 is became 2,3,4
        if (oldIndex < options.index) {
          await tx
            .update(_table)
            .set({ index: sql`${table.index} - 1` })
            .where(
              and(
                ...filter,
                gt(table.index, oldIndex),
                lte(table.index, options.index),
                eq(table.orgId, c.session.orgId),
              ),
            );
        }

        // if new index lower than old index we need to increase all rows between old and new index
        // example => 1,2,3,4,5 we change the index of 5 to 2 =>  old 2,3,4 is became 3,4,5
        else {
          await tx
            .update(_table)
            .set({ index: sql`${table.index} + 1` })
            .where(
              and(
                ...filter,
                gte(table.index, options.index),
                lt(table.index, oldIndex),
                eq(table.orgId, c.session.orgId),
              ),
            );
        }

        // Update the index of the item being moved
        await tx
          .update(_table)
          .set({ index: options.index })
          .where(
            and(
              ...filter,
              eq(table.id, options.updatedId),
              eq(table.orgId, c.session.orgId),
            ),
          );
      } else {
        // Increases everything greater than or equal to the new index by 1
        await tx
          .update(_table)
          .set({ index: sql`${table.index} + 1` })
          .where(
            and(
              ...filter,
              gte(table.index, options.index),
              eq(table.orgId, c.session.orgId),
            ),
          );
      }
    });
  }
}
