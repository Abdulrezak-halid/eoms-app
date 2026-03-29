import { z } from "@hono/zod-openapi";
import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { UtilOrganization } from "@m/base/utils/UtilOrganization";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";
import { UtilDb } from "@m/core/utils/UtilDb";

import { IDataViewTypeOptions } from "../interfaces/IDataViewTypeOptions";
import { TbDataViewProfile } from "../orm/TbDataViewProfile";
import { TbDataViewProfileMeterSlice } from "../orm/TbDataViewProfileMeterSlice";
import { TbDataViewProfileMetric } from "../orm/TbDataViewProfileMetric";
import { TbDataViewProfileSeu } from "../orm/TbDataViewProfileSeu";
import { TbMetric } from "../orm/TbMetric";
import { TbSeu } from "../orm/TbSeu";
import { VwMeterSlice } from "../orm/VwMeterSlice";
import { SchemaDataViewTypeOptionsWithDetails } from "../schemas/SchemaDataViewTypeOptions";

export namespace ServiceDataViewProfile {
  export async function checkOrgOwnership(c: IContextUser, ids: string[]) {
    await UtilOrganization.checkOwnership(c, ids, TbDataViewProfile);
  }
  export async function getAll(c: IContextUser) {
    // No need "distict" for json agg, because metrics, meterSlices and seus
    //   cannot be there at the same time.
    const rawResults = await c.db
      .select({
        id: TbDataViewProfile.id,
        name: TbDataViewProfile.name,
        description: TbDataViewProfile.description,
        viewType: TbDataViewProfile.viewType,
        metrics: UtilDb.jsonAgg(
          {
            id: TbMetric.id,
            name: TbMetric.name,
          },
          { orderBy: TbMetric.name, excludeNull: true },
        ),
        meterSlices: UtilDb.jsonAgg(
          {
            id: VwMeterSlice.id,
            name: VwMeterSlice.name,
            energyResource: VwMeterSlice.energyResource,
          },
          { orderBy: VwMeterSlice.name, excludeNull: true },
        ),
        seus: UtilDb.jsonAgg(
          {
            id: TbSeu.id,
            name: TbSeu.name,
            energyResource: TbSeu.energyResource,
          },
          { orderBy: TbSeu.name, excludeNull: true },
        ),
      })
      .from(TbDataViewProfile)
      .leftJoin(
        TbDataViewProfileMetric,
        and(
          eq(TbDataViewProfileMetric.orgId, TbDataViewProfile.orgId),
          eq(TbDataViewProfileMetric.subjectId, TbDataViewProfile.id),
        ),
      )
      .leftJoin(TbMetric, eq(TbMetric.id, TbDataViewProfileMetric.metricId))

      .leftJoin(
        TbDataViewProfileMeterSlice,
        and(
          eq(TbDataViewProfileMeterSlice.orgId, TbDataViewProfile.orgId),
          eq(TbDataViewProfileMeterSlice.subjectId, TbDataViewProfile.id),
        ),
      )
      .leftJoin(
        TbDataViewProfileSeu,
        and(
          eq(TbDataViewProfileSeu.orgId, TbDataViewProfile.orgId),
          eq(TbDataViewProfileSeu.subjectId, TbDataViewProfile.id),
        ),
      )

      .leftJoin(
        VwMeterSlice,
        eq(VwMeterSlice.id, TbDataViewProfileMeterSlice.meterSliceId),
      )
      .leftJoin(TbSeu, eq(TbSeu.id, TbDataViewProfileSeu.seuId))
      .where(eq(TbDataViewProfile.orgId, c.session.orgId))
      .groupBy(TbDataViewProfile.id)
      .orderBy(TbDataViewProfile.name);

    return rawResults.map<{
      id: string;
      name: string;
      description: string | null;
      options: z.infer<typeof SchemaDataViewTypeOptionsWithDetails>;
    }>((row) => {
      const base = {
        id: row.id,
        name: row.name,
        description: row.description,
      };

      switch (row.viewType) {
        case "METRIC": {
          return {
            ...base,
            options: {
              type: row.viewType,
              metrics: row.metrics,
            },
          };
        }
        case "METER_SLICE": {
          return {
            ...base,
            options: {
              type: row.viewType,
              meterSlices: row.meterSlices,
            },
          };
        }
        case "SEU": {
          return {
            ...base,
            options: {
              type: row.viewType,
              seus: row.seus,
            },
          };
        }
        default: {
          throw new ApiException(
            EApiFailCode.INTERNAL,
            "Unknown metric view profile type.",
          );
        }
      }
    });
  }

  export async function get(c: IContextUser, id: string) {
    // No need "distict" for json agg, because metrics, meterSlices and seus
    //   cannot be there at the same time.
    const [profile] = await c.db
      .select({
        id: TbDataViewProfile.id,
        name: TbDataViewProfile.name,
        description: TbDataViewProfile.description,
        viewType: TbDataViewProfile.viewType,
        metrics: UtilDb.jsonAgg(
          {
            id: TbMetric.id,
            name: TbMetric.name,
          },
          { orderBy: TbMetric.name, excludeNull: true },
        ),
        meterSlices: UtilDb.jsonAgg(
          {
            id: VwMeterSlice.id,
            name: VwMeterSlice.name,
            energyResource: VwMeterSlice.energyResource,
          },
          { orderBy: VwMeterSlice.name, excludeNull: true },
        ),
        seus: UtilDb.jsonAgg(
          {
            id: TbSeu.id,
            name: TbSeu.name,
            energyResource: TbSeu.energyResource,
          },
          { orderBy: TbSeu.name, excludeNull: true },
        ),
      })
      .from(TbDataViewProfile)

      .leftJoin(
        TbDataViewProfileMetric,
        and(
          eq(TbDataViewProfileMetric.orgId, TbDataViewProfile.orgId),
          eq(TbDataViewProfileMetric.subjectId, TbDataViewProfile.id),
        ),
      )
      .leftJoin(TbMetric, eq(TbMetric.id, TbDataViewProfileMetric.metricId))

      .leftJoin(
        TbDataViewProfileMeterSlice,
        and(
          eq(TbDataViewProfileMeterSlice.orgId, TbDataViewProfile.orgId),
          eq(TbDataViewProfileMeterSlice.subjectId, TbDataViewProfile.id),
        ),
      )
      .leftJoin(
        TbDataViewProfileSeu,
        and(
          eq(TbDataViewProfileSeu.orgId, TbDataViewProfile.orgId),
          eq(TbDataViewProfileSeu.subjectId, TbDataViewProfile.id),
        ),
      )
      .leftJoin(
        VwMeterSlice,
        eq(VwMeterSlice.id, TbDataViewProfileMeterSlice.meterSliceId),
      )
      .leftJoin(TbSeu, eq(TbSeu.id, TbDataViewProfileSeu.seuId))
      .where(
        and(
          eq(TbDataViewProfile.orgId, c.session.orgId),
          eq(TbDataViewProfile.id, id),
        ),
      )
      .groupBy(TbDataViewProfile.id);

    if (!profile) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    const base = {
      id: profile.id,
      name: profile.name,
      description: profile.description,
    };

    switch (profile.viewType) {
      case "METRIC": {
        return {
          ...base,
          options: {
            type: profile.viewType,
            metrics: profile.metrics,
          },
        };
      }
      case "METER_SLICE": {
        return {
          ...base,
          options: {
            type: profile.viewType,
            meterSlices: profile.meterSlices,
          },
        };
      }
      case "SEU": {
        return {
          ...base,
          options: {
            type: profile.viewType,
            seus: profile.seus,
          },
        };
      }
      default: {
        throw new ApiException(
          EApiFailCode.INTERNAL,
          "Unknown metric view profile type.",
        );
      }
    }
  }

  export async function create(
    c: IContextUser,
    data: {
      name: string;
      description: string | null;
      options: IDataViewTypeOptions;
    },
  ) {
    return await c.db.transaction(async (tx) => {
      const [record] = await tx
        .insert(TbDataViewProfile)
        .values({
          name: data.name,
          description: data.description,
          viewType: data.options.type,
          orgId: c.session.orgId,
          createdAt: c.nowDatetime,
          createdBy: c.session.userId,
        })
        .returning({ id: TbDataViewProfile.id });

      switch (data.options.type) {
        case "METRIC":
          await tx.insert(TbDataViewProfileMetric).values(
            data.options.metricIds.map((id) => ({
              orgId: c.session.orgId,
              subjectId: record.id,
              metricId: id,
            })),
          );
          break;

        case "METER_SLICE":
          await tx.insert(TbDataViewProfileMeterSlice).values(
            data.options.meterSliceIds.map((id) => ({
              orgId: c.session.orgId,
              meterSliceId: id,
              subjectId: record.id,
            })),
          );
          break;

        case "SEU":
          await tx.insert(TbDataViewProfileSeu).values(
            data.options.seuIds.map((id) => ({
              orgId: c.session.orgId,
              seuId: id,
              subjectId: record.id,
            })),
          );
          break;
      }

      return record.id;
    });
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      name: string;
      description: string | null;
      options: IDataViewTypeOptions;
    },
  ) {
    await c.db.transaction(async (tx) => {
      await tx
        .update(TbDataViewProfile)
        .set({
          name: data.name,
          description: data.description,
          viewType: data.options.type,
        })
        .where(
          and(
            eq(TbDataViewProfile.id, id),
            eq(TbDataViewProfile.orgId, c.session.orgId),
          ),
        );
      await tx
        .delete(TbDataViewProfileMetric)
        .where(
          and(
            eq(TbDataViewProfileMetric.orgId, c.session.orgId),
            eq(TbDataViewProfileMetric.subjectId, id),
          ),
        );
      await tx
        .delete(TbDataViewProfileMeterSlice)
        .where(
          and(
            eq(TbDataViewProfileMeterSlice.subjectId, id),
            eq(TbDataViewProfileMeterSlice.orgId, c.session.orgId),
          ),
        );
      await tx
        .delete(TbDataViewProfileSeu)
        .where(
          and(
            eq(TbDataViewProfileSeu.subjectId, id),
            eq(TbDataViewProfileSeu.orgId, c.session.orgId),
          ),
        );

      switch (data.options.type) {
        case "METRIC":
          await tx.insert(TbDataViewProfileMetric).values(
            data.options.metricIds.map((metricId) => ({
              orgId: c.session.orgId,
              subjectId: id,
              metricId,
            })),
          );
          break;
        case "METER_SLICE":
          await tx.insert(TbDataViewProfileMeterSlice).values(
            data.options.meterSliceIds.map((meterSliceId) => ({
              orgId: c.session.orgId,
              meterSliceId,
              subjectId: id,
            })),
          );
          break;
        case "SEU":
          await tx.insert(TbDataViewProfileSeu).values(
            data.options.seuIds.map((seuId) => ({
              orgId: c.session.orgId,
              seuId,
              subjectId: id,
            })),
          );
          break;
      }
    });
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db.transaction(async (tx) => {
      await tx
        .delete(TbDataViewProfileMetric)
        .where(
          and(
            eq(TbDataViewProfileMetric.orgId, c.session.orgId),
            eq(TbDataViewProfileMetric.subjectId, id),
          ),
        );

      await tx
        .delete(TbDataViewProfileMeterSlice)
        .where(
          and(
            eq(TbDataViewProfileMeterSlice.orgId, c.session.orgId),
            eq(TbDataViewProfileMeterSlice.subjectId, id),
          ),
        );

      await tx
        .delete(TbDataViewProfileSeu)
        .where(
          and(
            eq(TbDataViewProfileSeu.orgId, c.session.orgId),
            eq(TbDataViewProfileSeu.subjectId, id),
          ),
        );

      await tx
        .delete(TbDataViewProfile)
        .where(
          and(
            eq(TbDataViewProfile.orgId, c.session.orgId),
            eq(TbDataViewProfile.id, id),
          ),
        );
    });
  }
}
