import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { ApiException } from "@m/core/exceptions/ApiException";
import type {
  IContextAccessToken,
  IContextCore,
  IContextUser,
} from "@m/core/interfaces/IContext";
import { UtilDb } from "@m/core/utils/UtilDb";
import { TbMetric } from "@m/measurement/orm/TbMetric";

import { ISessionAccessToken } from "../interfaces/ISessionAccessToken";
import { TbAccessToken } from "../orm/TbAccessToken";
import { TbAccessTokenPermissionMetricResourceValue } from "../orm/TbAccessTokenPermissionMetricResourceValue";
import { TbOrganization } from "../orm/TbOrganization";
import { UtilOrganization } from "../utils/UtilOrganization";
import { UtilToken } from "../utils/UtilToken";

export namespace ServiceAccessToken {
  export async function checkOrgOwnership(c: IContextUser, ids: string[]) {
    await UtilOrganization.checkOwnership(c, ids, TbAccessToken);
  }

  export function checkPermMetricResourceValueMetricId(
    c: IContextAccessToken,
    id: string,
  ) {
    if (!c.session.permissions.metricResourceValueMetricIds.includes(id)) {
      throw new ApiException(
        EApiFailCode.FORBIDDEN,
        "Metric id is missing in token permissions.",
      );
    }
  }

  export async function getSession(
    c: IContextCore,
    token: string,
  ): Promise<ISessionAccessToken> {
    const [record] = await c.db
      .select({
        orgId: TbAccessToken.orgId,
        orgPlan: TbOrganization.plan,
        permissions: {
          metricResourceValueMetricIds: UtilDb.arrayAgg(
            TbAccessTokenPermissionMetricResourceValue.metricId,
            {
              excludeNull: true,
              distinct: true,
            },
          ),
          canListMetrics: TbAccessToken.canListMetrics,
          canListMeters: TbAccessToken.canListMeters,
          canListSeus: TbAccessToken.canListSeus,
        },
      })
      .from(TbAccessToken)
      .where(eq(TbAccessToken.token, token))
      .leftJoin(
        TbAccessTokenPermissionMetricResourceValue,
        eq(
          TbAccessTokenPermissionMetricResourceValue.subjectId,
          TbAccessToken.id,
        ),
      )
      .innerJoin(TbOrganization, eq(TbOrganization.id, TbAccessToken.orgId))
      .groupBy(TbAccessToken.id, TbOrganization.plan, TbAccessToken.orgId);

    if (!record) {
      throw new ApiException(EApiFailCode.UNAUTHORIZED, "Token is not found.");
    }

    return {
      orgId: record.orgId,
      orgPlan: record.orgPlan,
      permissions: record.permissions,
    };
  }

  export async function getAll(c: IContextUser) {
    return await c.db
      .select({
        id: TbAccessToken.id,
        name: TbAccessToken.name,
        token: TbAccessToken.token,
        permissions: {
          metricResourceValueMetrics: UtilDb.jsonAgg(
            {
              id: TbMetric.id,
              name: TbMetric.name,
              type: TbMetric.type,
            },
            { excludeNull: true, distinct: true },
          ),
          canListMetrics: TbAccessToken.canListMetrics,
          canListMeters: TbAccessToken.canListMeters,
          canListSeus: TbAccessToken.canListSeus,
        },
      })
      .from(TbAccessToken)

      .leftJoin(
        TbAccessTokenPermissionMetricResourceValue,
        eq(
          TbAccessTokenPermissionMetricResourceValue.subjectId,
          TbAccessToken.id,
        ),
      )

      .leftJoin(
        TbMetric,
        eq(TbMetric.id, TbAccessTokenPermissionMetricResourceValue.metricId),
      )

      .where(eq(TbAccessToken.orgId, c.session.orgId))
      .groupBy(TbAccessToken.id, TbAccessToken.token)
      .orderBy(TbAccessToken.createdAt);
  }

  export async function get(c: IContextUser, id: string) {
    const [rec] = await c.db
      .select({
        id: TbAccessToken.id,
        name: TbAccessToken.name,
        token: TbAccessToken.token,
        permissions: {
          metricResourceValueMetrics: UtilDb.jsonAgg(
            {
              id: TbMetric.id,
              name: TbMetric.name,
              type: TbMetric.type,
            },
            { excludeNull: true, distinct: true },
          ),
          canListMetrics: TbAccessToken.canListMetrics,
          canListMeters: TbAccessToken.canListMeters,
          canListSeus: TbAccessToken.canListSeus,
        },
      })
      .from(TbAccessToken)

      .leftJoin(
        TbAccessTokenPermissionMetricResourceValue,
        eq(
          TbAccessTokenPermissionMetricResourceValue.subjectId,
          TbAccessToken.id,
        ),
      )

      .leftJoin(
        TbMetric,
        eq(TbMetric.id, TbAccessTokenPermissionMetricResourceValue.metricId),
      )

      .where(
        and(eq(TbAccessToken.orgId, c.session.orgId), eq(TbAccessToken.id, id)),
      )
      .groupBy(TbAccessToken.id);

    if (!rec) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    return rec;
  }

  export async function create(
    c: IContextUser,
    data: {
      name: string;
      permissions: {
        metricResourceValueMetricIds: string[];
        canListMetrics: boolean;
        canListMeters: boolean;
        canListSeus: boolean;
      };
    },
  ) {
    return await c.db.transaction(async (tx) => {
      const token = UtilToken.create(16);

      const [record] = await tx
        .insert(TbAccessToken)
        .values({
          orgId: c.session.orgId,
          createdBy: c.session.userId,
          createdAt: c.nowDatetime,
          name: data.name,
          token,
          canListMetrics: data.permissions.canListMetrics,
          canListMeters: data.permissions.canListMeters,
          canListSeus: data.permissions.canListSeus,
        })
        .returning({ id: TbAccessToken.id });

      if (data.permissions.metricResourceValueMetricIds.length > 0) {
        await tx.insert(TbAccessTokenPermissionMetricResourceValue).values(
          data.permissions.metricResourceValueMetricIds.map((metricId) => ({
            orgId: c.session.orgId,
            createdAt: c.nowDatetime,
            subjectId: record.id,
            metricId,
          })),
        );
      }

      return { id: record.id, token };
    });
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      name: string;
      permissions: {
        metricResourceValueMetricIds: string[];
        canListMetrics: boolean;
        canListMeters: boolean;
        canListSeus: boolean;
      };
    },
  ) {
    return await c.db.transaction(async (tx) => {
      const [record] = await tx
        .update(TbAccessToken)
        .set({
          name: data.name,
          canListMetrics: data.permissions.canListMetrics,
          canListMeters: data.permissions.canListMeters,
          canListSeus: data.permissions.canListSeus,
        })
        .where(
          and(
            eq(TbAccessToken.id, id),
            eq(TbAccessToken.orgId, c.session.orgId),
          ),
        )
        .returning({ id: TbAccessToken.id });

      if (!record) {
        throw new ApiException(EApiFailCode.BAD_REQUEST);
      }

      await tx
        .delete(TbAccessTokenPermissionMetricResourceValue)
        .where(
          and(
            eq(TbAccessTokenPermissionMetricResourceValue.subjectId, id),
            eq(
              TbAccessTokenPermissionMetricResourceValue.orgId,
              c.session.orgId,
            ),
          ),
        );

      if (data.permissions.metricResourceValueMetricIds.length > 0) {
        await tx.insert(TbAccessTokenPermissionMetricResourceValue).values(
          data.permissions.metricResourceValueMetricIds.map((metricId) => ({
            orgId: c.session.orgId,
            createdAt: c.nowDatetime,
            subjectId: id,
            metricId,
          })),
        );
      }
    });
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db.transaction(async (tx) => {
      await tx
        .delete(TbAccessTokenPermissionMetricResourceValue)
        .where(
          and(
            eq(
              TbAccessTokenPermissionMetricResourceValue.orgId,
              c.session.orgId,
            ),
            eq(TbAccessTokenPermissionMetricResourceValue.subjectId, id),
          ),
        );

      const rec = await tx
        .delete(TbAccessToken)
        .where(
          and(
            eq(TbAccessToken.orgId, c.session.orgId),
            eq(TbAccessToken.id, id),
          ),
        );

      if (!UtilDb.getAffectedRows(rec)) {
        throw new ApiException(EApiFailCode.NOT_FOUND);
      }
    });
  }
}
