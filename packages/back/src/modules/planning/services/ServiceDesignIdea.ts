import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";

import { TbDesignIdea } from "../orm/TbDesignIdea";

export namespace ServiceDesignIdea {
  export async function getAll(c: IContextUser, designId: string) {
    return await c.db
      .select({
        id: TbDesignIdea.id,
        reduction: TbDesignIdea.reduction,
        risks: TbDesignIdea.risks,
        name: TbDesignIdea.name,
        no: TbDesignIdea.no,
      })
      .from(TbDesignIdea)
      .where(
        and(
          eq(TbDesignIdea.orgId, c.session.orgId),
          eq(TbDesignIdea.designId, designId),
        ),
      )
      .orderBy(TbDesignIdea.createdAt);
  }
  export async function get(c: IContextUser, designId: string, id: string) {
    const [record] = await c.db
      .select({
        id: TbDesignIdea.id,
        reduction: TbDesignIdea.reduction,
        risks: TbDesignIdea.risks,
        name: TbDesignIdea.name,
        no: TbDesignIdea.no,
      })
      .from(TbDesignIdea)
      .where(
        and(
          eq(TbDesignIdea.orgId, c.session.orgId),
          eq(TbDesignIdea.designId, designId),
          eq(TbDesignIdea.id, id),
        ),
      );

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
    return record;
  }

  export async function create(
    c: IContextUser,
    designId: string,
    data: {
      reduction: string;
      risks: string;
      name: string;
      no: string;
    },
  ) {
    const [record] = await c.db
      .insert(TbDesignIdea)
      .values({
        orgId: c.session.orgId,
        createdAt: c.nowDatetime,
        createdBy: c.session.userId,
        reduction: data.reduction,
        designId,
        risks: data.risks,
        name: data.name,
        no: data.no,
      })
      .returning({ id: TbDesignIdea.id });

    return record.id;
  }

  export async function update(
    c: IContextUser,
    designId: string,
    id: string,
    data: { risks: string; reduction: string; name: string; no: string },
  ) {
    const record = await c.db
      .update(TbDesignIdea)
      .set({
        reduction: data.reduction,
        risks: data.risks,
        name: data.name,
        no: data.no,
      })
      .where(
        and(
          eq(TbDesignIdea.orgId, c.session.orgId),
          eq(TbDesignIdea.designId, designId),
          eq(TbDesignIdea.id, id),
        ),
      )
      .returning({ id: TbDesignIdea.id });

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND, "Design idea not found");
    }

    return record;
  }

  export async function remove(c: IContextUser, designId: string, id: string) {
    await c.db
      .delete(TbDesignIdea)
      .where(
        and(
          eq(TbDesignIdea.orgId, c.session.orgId),
          eq(TbDesignIdea.designId, designId),
          eq(TbDesignIdea.id, id),
        ),
      );
  }
}
