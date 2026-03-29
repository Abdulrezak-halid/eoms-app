/**
 * @file: ServiceIssue.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 07.01.2025
 * Last Modified Date: 07.01.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { desc, eq } from "drizzle-orm";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser, sqlUserDisplayName } from "@m/base/orm/TbUser";

import type { IContextUser } from "../interfaces/IContext";
import { IIssueType } from "../interfaces/IIssueType";
import { TbIssue } from "../orm/TbIssue";

export namespace ServiceIssue {
  export async function create(
    c: IContextUser,
    params: {
      type: IIssueType;
      description: string;
    },
  ) {
    await c.db.insert(TbIssue).values({
      orgId: c.session.orgId,
      type: params.type,
      description: params.description,
      createdBy: c.session.userId,
      createdAt: c.nowDatetime,
    });

    if (
      !c.env.ISSUE_REPORT_MATRIX_HOST ||
      !c.env.ISSUE_REPORT_MATRIX_ROOM_ID ||
      !c.env.ISSUE_REPORT_MATRIX_ACCESS_TOKEN
    ) {
      c.logger.warn(
        { name: "ServiceIssue" },
        "Webhook is not configured. Skipping using webhook.",
      );
      return;
    }

    const [recInfo] = await c.db
      .select({
        userDisplayName: sqlUserDisplayName(),
        orgDisplayName: TbOrganization.displayName,
      })
      .from(TbUser)
      .innerJoin(TbOrganization, eq(TbOrganization.id, TbUser.orgId))
      .where(eq(TbUser.id, c.session.userId));

    if (!recInfo) {
      // TODO log
      return;
    }

    // TODO log if errored
    const resMatrix = await fetch(
      `${c.env.ISSUE_REPORT_MATRIX_HOST}_matrix/client/r0/rooms/${
        c.env.ISSUE_REPORT_MATRIX_ROOM_ID
      }/send/m.room.message?access_token=${
        c.env.ISSUE_REPORT_MATRIX_ACCESS_TOKEN
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          msgtype: "m.text",
          body: `
${params.type === "BUG_REPORT" ? "New Bug Report 🐛" : "New Feature Request 💡"}
Environment: "${c.env.ENV_NAME}"
Organization: "${recInfo.orgDisplayName}"
User: "${recInfo.userDisplayName}"
${params.description}
`,
          format: "org.matrix.custom.html",
          formatted_body: `
<b>${
            params.type === "BUG_REPORT"
              ? "New Bug Report 🐛"
              : "New Feature Request 💡"
          }</b><br />
Environment: <code>${c.env.ENV_NAME}</code><br />
Organization: <code>${recInfo.orgDisplayName}</code><br />
User: <code>${recInfo.userDisplayName}</code><br />
<pre>
${params.description}
</pre>`,
        }),
      },
    );

    if (resMatrix.ok) {
      c.logger.info(
        { name: "ServiceIssue", matrixHost: c.env.ISSUE_REPORT_MATRIX_HOST },
        "Message is sent to matrix successfully.",
      );
      return;
    }

    const responseText = await resMatrix.text();
    c.logger.error(
      {
        name: "ServiceIssue",
        matrix: {
          host: c.env.ISSUE_REPORT_MATRIX_HOST,
          responseText,
          status: resMatrix.status,
        },
      },
      "Failed to sent message to matrix.",
    );
  }

  export async function getAll(c: IContextUser) {
    return await c.db
      .select({
        id: TbIssue.id,
        type: TbIssue.type,
        description: TbIssue.description,
        createdAt: TbIssue.createdAt,
        createdByUserDisplayName: sqlUserDisplayName(),
        orgDisplayName: TbOrganization.displayName,
      })
      .from(TbIssue)
      .innerJoin(TbOrganization, eq(TbOrganization.id, TbIssue.orgId))
      .innerJoin(TbUser, eq(TbUser.id, TbIssue.createdBy))
      .orderBy(desc(TbIssue.createdAt));
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db.delete(TbIssue).where(eq(TbIssue.id, id));
  }
}
