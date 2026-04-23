import { EApiFailCode, IUnit } from "common";
import { and, eq } from "drizzle-orm";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";
import { ITimedValue } from "@m/core/interfaces/ITimedValue";
import { UtilContext } from "@m/core/utils/UtilContext";
import { UtilDb } from "@m/core/utils/UtilDb";

import { IMetricResourceLabel } from "../interfaces/IMetricResourceLabel";
import { TbMetric } from "../orm/TbMetric";
import { TbMetricFileDraft } from "../orm/TbMetricFileDraft";
import { UtilMetricExcelImporter } from "../utils/UtilMetricExcelImporter";
import { UtilMetricResourceLabel } from "../utils/UtilMetricResourceLabel";
import { ServiceMetric } from "./ServiceMetric";

export namespace ServiceMetricFileDraft {
  export async function getAll(c: IContextUser) {
    return await c.db
      .select({
        content: TbMetricFileDraft.content,
        metric: {
          id: TbMetric.id,
          name: TbMetric.name,
          type: TbMetric.type,
          unitGroup: TbMetric.unitGroup,
        },
        createdAt: UtilDb.isoDatetime(TbMetricFileDraft.createdAt),
        createdBy: TbMetricFileDraft.createdBy,
      })
      .from(TbMetricFileDraft)
      .innerJoin(
        TbMetric,
        and(
          eq(TbMetricFileDraft.metricId, TbMetric.id),
          eq(TbMetric.orgId, c.orgId),
        ),
      )
      .where(eq(TbMetricFileDraft.orgId, c.orgId));
  }

  export async function get(c: IContextUser, metricId: string) {
    const [rec] = await c.db
      .select({
        content: TbMetricFileDraft.content,
        createdAt: UtilDb.isoDatetime(TbMetricFileDraft.createdAt),
        createdBy: TbMetricFileDraft.createdBy,
      })
      .from(TbMetricFileDraft)
      .where(
        and(
          eq(TbMetricFileDraft.orgId, c.orgId),
          eq(TbMetricFileDraft.metricId, metricId),
        ),
      )
      .limit(1);

    if (!rec) {
      throw new ApiException(EApiFailCode.NOT_FOUND, "There is no draft.");
    }

    return rec;
  }

  export async function upload(
    c: IContextUser,
    metricId: string,
    file: ArrayBuffer,
    tzOffset: number,
  ) {
    // TODO It must check file type before the parse.
    const values = await UtilMetricExcelImporter.importFile(
      c.logger,
      file,
      tzOffset,
    );

    await c.db
      .insert(TbMetricFileDraft)
      .values({
        metricId,
        orgId: c.orgId,
        content: values,
        createdAt: c.nowDatetime,
        createdBy: c.session.userId,
      })
      .onConflictDoUpdate({
        target: [TbMetricFileDraft.metricId, TbMetricFileDraft.orgId],
        set: {
          content: values,
          createdAt: c.nowDatetime,
          createdBy: c.session.userId,
        },
      });
  }

  export async function save(c: IContextUser, metricId: string, unit: IUnit) {
    return await c.db.transaction(async (tx) => {
      const cTx = UtilContext.overwriteDb(c, tx);

      const [draft] = await tx
        .select({ content: TbMetricFileDraft.content })
        .from(TbMetricFileDraft)
        .where(
          and(
            eq(TbMetricFileDraft.orgId, c.orgId),
            eq(TbMetricFileDraft.metricId, metricId),
          ),
        )
        .limit(1);

      if (!draft) {
        throw new ApiException(EApiFailCode.NOT_FOUND, "Draft is not found.");
      }

      const content = draft.content;
      const groups = new Map<
        // bigint keeps label hash
        bigint,
        { labels: IMetricResourceLabel[]; values: ITimedValue[] }
      >();

      for (const item of content) {
        const labelHash = await UtilMetricResourceLabel.hash(item.labels);

        let group = groups.get(labelHash);

        if (!group) {
          group = { labels: item.labels, values: [] };
          groups.set(labelHash, group);
        }

        group.values.push({
          datetime: item.datetime,
          value: item.value,
        });
      }

      const resourceIds = [];

      for (const { labels, values } of groups.values()) {
        const finalLabels: IMetricResourceLabel[] = [
          ...labels,
          {
            type: "INTERNAL",
            key: "SOURCE",
            value: "EXCEL",
          },
        ];

        const resourceId = await ServiceMetric.addValues(
          cTx,
          c.session.orgId,
          metricId,
          unit,
          values,
          finalLabels,
        );

        resourceIds.push(resourceId);
      }

      await tx
        .delete(TbMetricFileDraft)
        .where(
          and(
            eq(TbMetricFileDraft.orgId, c.orgId),
            eq(TbMetricFileDraft.metricId, metricId),
          ),
        );

      return resourceIds;
    });
  }

  export async function cancel(c: IContextUser, metricId: string) {
    await c.db
      .delete(TbMetricFileDraft)
      .where(
        and(
          eq(TbMetricFileDraft.metricId, metricId),
          eq(TbMetricFileDraft.orgId, c.orgId),
        ),
      );
  }
}
