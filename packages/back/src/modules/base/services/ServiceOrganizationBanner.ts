import { EApiFailCode } from "common";
import { and, eq, or } from "drizzle-orm";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextCore, IContextUser } from "@m/core/interfaces/IContext";
import { IStoragePath } from "@m/core/interfaces/IStoragePath";
import { UtilImage } from "@m/core/utils/UtilImage";

export namespace ServiceOrganizationBanner {
  function generateBannerPath(orgId: string) {
    return `/org-data/${orgId}/images/banner.webp` as IStoragePath;
  }

  export async function checkAssignedOrgOwnership(c: IContextUser, id: string) {
    const [check] = await c.db
      .select({ id: TbOrganization.id })
      .from(TbOrganization)
      .where(
        and(
          eq(TbOrganization.id, id),
          or(
            eq(TbOrganization.id, c.session.orgId),
            eq(TbOrganization.createdByOrgId, c.session.orgId),
          ),
        ),
      );
    if (!check) {
      throw new ApiException(
        EApiFailCode.FOREIGN_KEY_NOT_FOUND,
        "Organization not found or not created from your organization",
      );
    }
  }

  export async function save(c: IContextUser, id: string, banner: Buffer) {
    await c.db
      .update(TbOrganization)
      .set({ hasBanner: true })
      .where(
        and(
          eq(TbOrganization.id, id),
          or(
            eq(TbOrganization.id, c.session.orgId),
            eq(TbOrganization.createdByOrgId, c.session.orgId),
          ),
        ),
      );
    const image = await UtilImage.convert(banner, { width: 512 });
    const path = generateBannerPath(id);
    await c.storage.put(path, image.buffer, image.contentType);
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db
      .update(TbOrganization)
      .set({ hasBanner: false })
      .where(
        and(
          eq(TbOrganization.id, id),
          or(
            eq(TbOrganization.id, c.session.orgId),
            eq(TbOrganization.createdByOrgId, c.session.orgId),
          ),
        ),
      );
    const path = generateBannerPath(id);
    await c.storage.removeIfExists(path);
  }

  export async function getFile(c: IContextCore, orgId: string) {
    const path = generateBannerPath(orgId);
    const orgBanner = await c.storage.get(path);

    if (!orgBanner) {
      throw new ApiException(EApiFailCode.NOT_FOUND, "Banner not found");
    }

    return { buffer: orgBanner.buffer, etag: orgBanner.etag };
  }
}
