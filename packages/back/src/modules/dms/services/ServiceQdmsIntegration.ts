import { EApiFailCode } from "common";
import { and, eq, isNotNull, ne } from "drizzle-orm";

import { UtilOrganization } from "@m/base/utils/UtilOrganization";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextOrg, IContextUser } from "@m/core/interfaces/IContext";
import { IStoragePath } from "@m/core/interfaces/IStoragePath";
import { UtilDb } from "@m/core/utils/UtilDb";

import { IQdmsIntegrationBindingPage } from "../interfaces/IQdmsIntegrationBindingPage";
import { TbQdmsEntry } from "../orm/TbQdmsEntry";

export namespace ServiceQdmsIntegration {
  export function generateQdmsPath(orgId: string, id: string) {
    return `/org-data/${orgId}/dms/qdms-integration/${id}.${"pdf"}` as IStoragePath;
  }

  export async function checkOrgOwnership(c: IContextUser, ids: string[]) {
    await UtilOrganization.checkOwnership(c, ids, TbQdmsEntry);
  }

  // export async function getName(c: IContextUser, id: string) {
  //   const [result] = await c.db
  //     .select({ name: TbQdmsEntry.name })
  //     .from(TbQdmsEntry)
  //     .where(
  //       and(eq(TbQdmsEntry.orgId, c.session.orgId), eq(TbQdmsEntry.id, id)),
  //     )
  //     .limit(1);

  //   if (!result) {
  //     throw new ApiException(EApiFailCode.NOT_FOUND);
  //   }

  //   return result.name;
  // }

  // export async function getFormattedName(c: IContextUser, id: string) {
  //   const [result] = await c.db
  //     .select({ name: TbQdmsEntry.name })
  //     .from(TbQdmsEntry)
  //     .where(
  //       and(eq(TbQdmsEntry.id, id), eq(TbQdmsEntry.orgId, c.session.orgId)),
  //     )
  //     .limit(1);

  //   if (!result) {
  //     throw new ApiException(EApiFailCode.NOT_FOUND);
  //   }

  //   // Convert name to lowercase and replace all spaces with underscores
  //   return result.name.toLowerCase().replace(/\s+/g, "_");
  // }

  export async function getAll(c: IContextUser) {
    return c.db
      .select({
        id: TbQdmsEntry.id,
        name: TbQdmsEntry.name,
        bindingPage: TbQdmsEntry.bindingPage,
        endpointUrl: TbQdmsEntry.endpointUrl,
        isEnabled: TbQdmsEntry.isEnabled,
        lastFetchedAt: UtilDb.isoDatetime(TbQdmsEntry.lastFetchedAt),
      })
      .from(TbQdmsEntry)
      .where(eq(TbQdmsEntry.orgId, c.session.orgId))
      .orderBy(TbQdmsEntry.bindingPage, TbQdmsEntry.name);
  }

  export async function get(c: IContextUser, id: string) {
    const [record] = await c.db
      .select({
        id: TbQdmsEntry.id,
        name: TbQdmsEntry.name,
        bindingPage: TbQdmsEntry.bindingPage,
        endpointUrl: TbQdmsEntry.endpointUrl,
        isEnabled: TbQdmsEntry.isEnabled,
        lastFetchedAt: UtilDb.isoDatetime(TbQdmsEntry.lastFetchedAt),
      })
      .from(TbQdmsEntry)
      .where(
        and(eq(TbQdmsEntry.id, id), eq(TbQdmsEntry.orgId, c.session.orgId)),
      );

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
    return record;
  }

  export async function getIdByBindingPage(
    c: IContextOrg,
    bindingPage: IQdmsIntegrationBindingPage,
  ) {
    const [record] = await c.db
      .select({
        id: TbQdmsEntry.id,
      })
      .from(TbQdmsEntry)
      .where(
        and(
          eq(TbQdmsEntry.bindingPage, bindingPage),
          eq(TbQdmsEntry.isEnabled, true),
          eq(TbQdmsEntry.orgId, c.orgId),
        ),
      );

    if (!record) {
      return undefined;
    }

    return record.id;
  }

  export async function create(
    c: IContextUser,
    data: {
      name: string;
      bindingPage: IQdmsIntegrationBindingPage;
      endpointUrl: string;
    },
  ) {
    const [record] = await c.db
      .insert(TbQdmsEntry)
      .values({
        orgId: c.session.orgId,
        name: data.name,
        bindingPage: data.bindingPage,
        endpointUrl: data.endpointUrl,
        isEnabled: false,
        createdAt: c.nowDatetime,
        createdBy: c.session.userId,
      })
      .returning({
        id: TbQdmsEntry.id,
      });
    return record.id;
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      name: string;
      bindingPage: IQdmsIntegrationBindingPage;
      endpointUrl: string;
    },
  ) {
    await c.db
      .update(TbQdmsEntry)
      .set({
        name: data.name,
        bindingPage: data.bindingPage,
        endpointUrl: data.endpointUrl,
      })
      .where(
        and(eq(TbQdmsEntry.id, id), eq(TbQdmsEntry.orgId, c.session.orgId)),
      );
  }

  export async function setEnabled(
    c: IContextUser,
    id: string,
    value: boolean,
  ) {
    await c.db.transaction(async (tx) => {
      const [bindingPage] = await tx
        .update(TbQdmsEntry)
        .set({
          isEnabled: value,
        })
        .where(
          and(
            eq(TbQdmsEntry.id, id),
            eq(TbQdmsEntry.orgId, c.orgId),
            // It won't work if nothing is fetched.
            isNotNull(TbQdmsEntry.lastFetchedAt),
          ),
        )
        .returning({ bindingPage: TbQdmsEntry.bindingPage });

      if (!bindingPage) {
        throw new ApiException(
          EApiFailCode.BAD_REQUEST,
          "There is no record or not fetched yet.",
        );
      }

      await tx
        .update(TbQdmsEntry)
        .set({ isEnabled: false })
        .where(
          and(
            ne(TbQdmsEntry.id, id),
            eq(TbQdmsEntry.orgId, c.orgId),
            eq(TbQdmsEntry.bindingPage, bindingPage.bindingPage),
          ),
        );
    });
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db
      .delete(TbQdmsEntry)
      .where(
        and(eq(TbQdmsEntry.orgId, c.session.orgId), eq(TbQdmsEntry.id, id)),
      );

    await c.storage.removeIfExists(generateQdmsPath(c.session.orgId, id));
  }

  export async function fetchEntry(c: IContextUser, id: string) {
    const [record] = await c.db
      .select({
        endpointUrl: TbQdmsEntry.endpointUrl,
      })
      .from(TbQdmsEntry)
      .where(
        and(eq(TbQdmsEntry.id, id), eq(TbQdmsEntry.orgId, c.session.orgId)),
      );

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    const response = await fetch(record.endpointUrl);
    if (!response.ok) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        `Qdms API request failed with status ${response.status}`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await c.storage.put(generateQdmsPath(c.session.orgId, id), buffer);

    await c.db
      .update(TbQdmsEntry)
      .set({ lastFetchedAt: c.nowDatetime })
      .where(eq(TbQdmsEntry.id, id));
  }

  export async function getFileContent(c: IContextUser, id: string) {
    const file = await c.storage.get(generateQdmsPath(c.session.orgId, id));

    if (!file) {
      throw new ApiException(EApiFailCode.NOT_FOUND, "Qdms file is not found.");
    }

    return file;
  }
}
