import { EApiFailCode, IP_REGEX } from "common";
import { eq } from "drizzle-orm";

import { TbOrganization } from "@m/base/orm/TbOrganization";

import { ApiException } from "../exceptions/ApiException";
import { IContextCore } from "../interfaces/IContext";

export namespace UtilWorkspace {
  export function getWorkspaceFromUrl(c: IContextCore, urlStr: string) {
    // ref = https://subdomain.domain.com/
    const url = new URL(urlStr);

    const domain = url.hostname;

    if (c.env.WORKSPACE_ROOT_DOMAINS.includes(domain)) {
      return null;
    }

    if (IP_REGEX.test(domain)) {
      return null;
    }

    const subdomain = domain.split(".")[0]; //subdomain

    if (!subdomain) {
      throw new ApiException(EApiFailCode.INTERNAL, "Cannot parse subdomain.");
    }

    return subdomain;
  }

  // Returns null if there is no subdomain, and throws error if there is
  //   subdomain but no organization that matches.
  export async function getOrgIdFromUrl(c: IContextCore, url: string) {
    const subdomain = getWorkspaceFromUrl(c, url);

    if (!subdomain) {
      return null;
    }

    const [org] = await c.db
      .select({ id: TbOrganization.id })
      .from(TbOrganization)
      .where(eq(TbOrganization.workspace, subdomain));

    if (!org) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Organization is not found using workspace for getting organization id.",
      );
    }

    return org.id;
  }

  // Returns null if there is no subdomain, and throws error if there is
  //   subdomain but no organization that matches.
  export async function getPublicOrgInfoFromUrl(c: IContextCore, url: string) {
    const subdomain = getWorkspaceFromUrl(c, url);

    if (!subdomain) {
      return null;
    }

    const [org] = await c.db
      .select({
        displayName: TbOrganization.displayName,
        hasBanner: TbOrganization.hasBanner,
      })
      .from(TbOrganization)
      .where(eq(TbOrganization.workspace, subdomain));

    if (!org) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Organization is not found using workspace for getting public organization info.",
      );
    }

    return org;
  }
}
