import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { UtilOrganization } from "@m/base/utils/UtilOrganization";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextOrg, IContextUser } from "@m/core/interfaces/IContext";

import { TbReportAttachment } from "../orm/TbReportAttachment";
import { UtilReportFile } from "../utils/UtilReportFile";

export namespace ServiceReportAttachment {
  export async function checkOrgOwnership(c: IContextUser, ids: string[]) {
    await UtilOrganization.checkOwnership(c, ids, TbReportAttachment);
  }

  export async function save(
    c: IContextUser,
    name: string,
    buffer: Buffer,
    contentType: string,
  ) {
    const [record] = await c.db
      .insert(TbReportAttachment)
      .values({
        orgId: c.orgId,
        createdBy: c.session.userId,
        createdAt: c.nowDatetime,
        name,
      })
      .returning({ id: TbReportAttachment.id });

    const path = UtilReportFile.generateReportFilePath(c.orgId, record.id);

    await c.storage.put(path, buffer, contentType);

    return record.id;
  }

  export async function getAll(c: IContextUser) {
    const records = await c.db
      .select({
        id: TbReportAttachment.id,
        name: TbReportAttachment.name,
        createdBy: TbReportAttachment.createdBy,
        createdAt: TbReportAttachment.createdAt,
      })
      .from(TbReportAttachment)
      .where(eq(TbReportAttachment.orgId, c.orgId));

    return records;
  }

  export async function get(c: IContextUser, id: string) {
    const [record] = await c.db
      .select({
        id: TbReportAttachment.id,
        name: TbReportAttachment.name,
        createdBy: TbReportAttachment.createdBy,
        createdAt: TbReportAttachment.createdAt,
      })
      .from(TbReportAttachment)
      .where(
        and(
          eq(TbReportAttachment.orgId, c.orgId),
          eq(TbReportAttachment.id, id),
        ),
      );

    if (!record) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Attachment is not found.",
      );
    }

    return record;
  }

  export async function getFile(c: IContextOrg, id: string) {
    const path = UtilReportFile.generateReportFilePath(c.orgId, id);
    const buffer = await c.storage.get(path);
    if (!buffer) {
      throw new ApiException(EApiFailCode.NOT_FOUND, "Report not found.");
    }
    return buffer;
  }

  export async function remove(c: IContextOrg, id: string) {
    await c.db
      .delete(TbReportAttachment)
      .where(
        and(
          eq(TbReportAttachment.orgId, c.orgId),
          eq(TbReportAttachment.id, id),
        ),
      );
    const path = UtilReportFile.generateReportFilePath(c.orgId, id);
    await c.storage.remove(path);
  }
}
