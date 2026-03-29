import { SQL, and, desc, eq } from "drizzle-orm";

import { TbUser } from "@m/base/orm/TbUser";

import { IContextCore, IContextUser } from "../interfaces/IContext";
import { INotificationContent } from "../interfaces/INotificationContent";
import { TbNotification } from "../orm/TbNotification";
import { UtilDb } from "../utils/UtilDb";

export namespace ServiceNotification {
  export async function notifyUser(
    c: IContextCore,
    orgId: string,
    userId: string,
    content: INotificationContent,
  ) {
    const [rec] = await c.db
      .insert(TbNotification)
      .values({
        userId,
        content,
        createdAt: c.nowDatetime,
        orgId,
      })
      .returning({ id: TbNotification.id });

    c.ws.sendMessageToUser(userId, { type: "NOTIFICATION", content });

    return rec.id;
  }

  export async function notifyOrganization(
    c: IContextCore,
    orgId: string,
    content: INotificationContent,
  ) {
    const users = await c.db
      .select({ id: TbUser.id })
      .from(TbUser)
      .where(eq(TbUser.orgId, orgId));

    for (const user of users) {
      await c.db.insert(TbNotification).values({
        userId: user.id,
        content,
        createdAt: c.nowDatetime,
        orgId,
      });
    }

    c.ws.sendMessageToOrganization(orgId, {
      type: "NOTIFICATION",
      content,
    });
  }

  export async function getAll(c: IContextUser) {
    return c.db
      .select({
        id: TbNotification.id,
        content: TbNotification.content,
        read: TbNotification.read,
        createdAt: UtilDb.isoDatetime(TbNotification.createdAt),
      })
      .from(TbNotification)
      .where(
        and(
          eq(TbNotification.orgId, c.orgId),
          eq(TbNotification.userId, c.session.userId),
        ),
      )
      .orderBy(desc(TbNotification.createdAt));
  }

  export async function setRead(c: IContextUser, id?: string) {
    const filters: (SQL | undefined)[] = [
      eq(TbNotification.orgId, c.orgId),
      eq(TbNotification.userId, c.session.userId),
    ];

    if (id) {
      filters.push(eq(TbNotification.id, id));
    }

    await c.db
      .update(TbNotification)
      .set({ read: true })
      .where(and(...filters));
  }
}
