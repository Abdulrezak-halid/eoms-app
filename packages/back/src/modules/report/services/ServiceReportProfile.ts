import { EApiFailCode } from "common";
import { and, eq, isNotNull, isNull, or, sql } from "drizzle-orm";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextCore, IContextUser } from "@m/core/interfaces/IContext";

import { IPlainOrTranslatableText } from "../interfaces/IPlainOrTranslatableText";
import { IReport } from "../interfaces/IReport";
import { TbReportProfile } from "../orm/TbReportProfile";

export namespace ServiceReportProfile {
  export async function checkNonCommon(c: IContextCore, id: string) {
    const [rec] = await c.db
      .select({ orgId: TbReportProfile.orgId })
      .from(TbReportProfile)
      .where(and(eq(TbReportProfile.id, id), isNull(TbReportProfile.orgId)));

    if (rec) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "Report profile is common.",
      );
    }
  }

  export async function getAll(c: IContextUser) {
    return await c.db
      .select({
        id: TbReportProfile.id,
        title: TbReportProfile.title,
        commonLabel: TbReportProfile.commonLabel,
        description: TbReportProfile.description,
        isCommon: sql<boolean>`${isNull(TbReportProfile.orgId)}`.as("isCommon"),
      })
      .from(TbReportProfile)
      .where(
        and(
          or(eq(TbReportProfile.orgId, c.orgId), isNull(TbReportProfile.orgId)),
        ),
      )
      // is not null returns false for common records and true for organization ones,
      // so common records come first.
      .orderBy(isNotNull(TbReportProfile.orgId), TbReportProfile.title);
  }

  export async function get(c: IContextUser, id: string) {
    const [rec] = await c.db
      .select({
        id: TbReportProfile.id,
        title: TbReportProfile.title,
        commonLabel: TbReportProfile.commonLabel,
        description: TbReportProfile.description,
        content: TbReportProfile.content,
        isCommon: sql<boolean>`${isNull(TbReportProfile.orgId)}`.as("isCommon"),
      })
      .from(TbReportProfile)
      .where(
        and(
          or(eq(TbReportProfile.orgId, c.orgId), isNull(TbReportProfile.orgId)),
          eq(TbReportProfile.id, id),
        ),
      );

    if (!rec) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Report profile not found",
      );
    }

    return rec;
  }

  export async function create(
    c: IContextUser,
    data: {
      content: IReport;
      description: IPlainOrTranslatableText | null;
    },
  ) {
    if (
      data.content.title.type === "PLAIN" &&
      data.content.title.value === ""
    ) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "Report title is missing.",
      );
    }

    const [rec] = await c.db
      .insert(TbReportProfile)
      .values({
        createdBy: c.session.userId,
        createdAt: c.nowDatetime,
        orgId: c.orgId,
        title: data.content.title,
        description: data.description,
        content: data.content,
      })
      .returning({ id: TbReportProfile.id });

    return rec.id;
  }

  export async function clone(c: IContextUser, id: string) {
    const [rec] = await c.db
      .select({
        title: TbReportProfile.title,
        content: TbReportProfile.content,
        commonLabel: TbReportProfile.commonLabel,
        description: TbReportProfile.description,
      })
      .from(TbReportProfile)
      .where(
        and(
          eq(TbReportProfile.id, id),
          or(eq(TbReportProfile.orgId, c.orgId), isNull(TbReportProfile.orgId)),
        ),
      );

    if (!rec) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Report profile not found",
      );
    }

    const [result] = await c.db
      .insert(TbReportProfile)
      .values({
        orgId: c.orgId,
        createdBy: c.session.userId,
        createdAt: c.nowDatetime,
        title: rec.title,
        commonLabel: rec.commonLabel,
        content: rec.content,
        description: { type: "TRANSLATED", value: "clonedTemplate" },
      })
      .returning({ id: TbReportProfile.id });

    return result;
  }

  export async function createCommon(
    c: IContextCore,
    data: {
      content: IReport;
      commonLabel: IPlainOrTranslatableText;
      description: IPlainOrTranslatableText | null;
    },
  ) {
    const [rec] = await c.db
      .insert(TbReportProfile)
      .values({
        createdAt: c.nowDatetime,
        createdBy: null,
        orgId: null,
        title: data.content.title,
        commonLabel: data.commonLabel,
        description: data.description,
        content: data.content,
      })
      .returning({ id: TbReportProfile.id });

    return rec.id;
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      content: IReport;
      description: IPlainOrTranslatableText | null;
    },
  ) {
    if (
      data.content.title.type === "PLAIN" &&
      data.content.title.value === ""
    ) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "Report title is missing.",
      );
    }

    await c.db
      .update(TbReportProfile)
      .set({
        title: data.content.title,
        description: data.description,
        content: data.content,
      })
      .where(
        and(eq(TbReportProfile.orgId, c.orgId), eq(TbReportProfile.id, id)),
      )
      .returning({ orgId: TbReportProfile.orgId });
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db
      .delete(TbReportProfile)
      .where(
        and(
          eq(TbReportProfile.orgId, c.orgId),
          isNotNull(TbReportProfile.createdBy),
          eq(TbReportProfile.id, id),
        ),
      );
  }
}
