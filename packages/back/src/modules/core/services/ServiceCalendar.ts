import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";
import { UtilDb } from "@m/core/utils/UtilDb";

import { ICalendarEntryType } from "../interfaces/ICalendarEntryType";
import { TbCalendarEntry } from "../orm/TbCalendarEntry";

export namespace ServiceCalendar {
  export async function create(
    c: IContextUser,
    data: {
      name: string;
      description: string | null;
      datetime: string;
      datetimeEnd?: string;
      type: ICalendarEntryType;
    },
  ) {
    const [record] = await c.db
      .insert(TbCalendarEntry)
      .values({
        createdBy: c.session.userId,
        createdAt: c.nowDatetime,
        orgId: c.session.orgId,
        name: data.name,
        description: data.description,
        datetime: data.datetime,
        datetimeEnd: data.datetimeEnd,
        type: data.type,
      })
      .returning({ id: TbCalendarEntry.id });
    return record.id;
  }
  export async function getAll(c: IContextUser) {
    return await c.db
      .select({
        id: TbCalendarEntry.id,
        name: TbCalendarEntry.name,
        description: TbCalendarEntry.description,
        datetime: UtilDb.isoDatetime(TbCalendarEntry.datetime),
        datetimeEnd: UtilDb.isoDatetime(TbCalendarEntry.datetimeEnd),
        type: TbCalendarEntry.type,
      })
      .from(TbCalendarEntry)
      .where(eq(TbCalendarEntry.orgId, c.session.orgId))
      .orderBy(TbCalendarEntry.datetime);
  }

  export async function get(c: IContextUser, id: string) {
    const [record] = await c.db
      .select({
        id: TbCalendarEntry.id,
        name: TbCalendarEntry.name,
        description: TbCalendarEntry.description,
        datetime: UtilDb.isoDatetime(TbCalendarEntry.datetime),
        datetimeEnd: UtilDb.isoDatetime(TbCalendarEntry.datetimeEnd),
        type: TbCalendarEntry.type,
      })
      .from(TbCalendarEntry)
      .where(
        and(
          eq(TbCalendarEntry.orgId, c.session.orgId),
          eq(TbCalendarEntry.id, id),
        ),
      );

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    return record;
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      name: string;
      description: string | null;
      datetime: string;
      datetimeEnd?: string;
      type: ICalendarEntryType;
    },
  ) {
    await c.db
      .update(TbCalendarEntry)
      .set({
        name: data.name,
        description: data.description,
        datetime: data.datetime,
        datetimeEnd: data.datetimeEnd,
        type: data.type,
      })
      .where(
        and(
          eq(TbCalendarEntry.id, id),
          eq(TbCalendarEntry.orgId, c.session.orgId),
        ),
      );
  }
  export async function remove(c: IContextUser, id: string) {
    await c.db
      .delete(TbCalendarEntry)
      .where(
        and(
          eq(TbCalendarEntry.id, id),
          eq(TbCalendarEntry.orgId, c.session.orgId),
        ),
      );
  }
}
