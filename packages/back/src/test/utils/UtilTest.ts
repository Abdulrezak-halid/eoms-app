/**
 * @file: UtilsTest.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 09.01.2025
 * Last Modified Date: 09.01.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";
import { EXAMPLE_USER_EMAIL, EXAMPLE_USER_PASSWORD } from "common";
import type { paths } from "common/build-api-schema";
import { eq } from "drizzle-orm";
import openapiFetchCreateClient, { Client } from "openapi-fetch";
import { expect, vi } from "vitest";

import { IOrganizationPlan } from "@m/base/interfaces/IOrganizationPlan";
import { IPermission } from "@m/base/interfaces/IPermission";
import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";
import { SchemaSessionDetail } from "@m/base/schemas/SchemaSessionDetail";
import { ServiceSession } from "@m/base/services/ServiceSession";
import { ServiceUser } from "@m/base/services/ServiceUser";
import { IContextJob, IContextUser } from "@m/core/interfaces/IContext";
import { RouterRoot } from "@m/core/routers/RouterRoot";
import { UtilContext } from "@m/core/utils/UtilContext";

export type ITestClient = Client<paths, `${string}/${string}`>;

export namespace UtilTest {
  export function createTestContext() {
    return UtilContext.createContext("TEST");
  }

  export function createTestContextJob(
    orgId: string,
    jobId: string,
  ): IContextJob {
    return {
      ...UtilTest.createTestContext(),
      orgId,
      jobId,
    };
  }

  export async function createTestContextUser(): Promise<IContextUser> {
    const contextCore = UtilContext.createContext("TEST");
    const [rec] = await contextCore.db
      .select({
        userId: TbUser.id,
        orgId: TbOrganization.id,
        orgPlan: TbOrganization.plan,
      })
      .from(TbUser)
      .innerJoin(TbOrganization, eq(TbUser.orgId, TbOrganization.id))
      .where(eq(TbUser.email, EXAMPLE_USER_EMAIL));

    const permissions = await ServiceUser.getPermissionsCore(
      contextCore,
      rec.orgId,
      rec.userId,
    );

    const { token } = await ServiceSession.create(contextCore, rec.userId);

    return {
      ...contextCore,
      orgId: rec.orgId,
      session: {
        token,
        orgId: rec.orgId,
        userId: rec.userId,
        permissions,
        orgPlan: rec.orgPlan,
      },
    };
  }

  export function createClient(headers?: Headers) {
    return openapiFetchCreateClient<paths>({
      baseUrl: "http://test/",
      headers,
      fetch: async (req) => {
        return await RouterRoot.fetch(req);
      },
    });
  }

  function createClientWithCookie({ response }: { response: Response }) {
    const cookie = response.headers.getSetCookie()[0];
    expect(cookie).toBeTypeOf("string");

    const headers = new Headers();
    headers.set("cookie", cookie);

    return createClient(headers);
  }

  export async function createClientWithAccessToken(options?: {
    permMetricResourceValueMetricIds?: string[];
    canListMeters?: boolean;
    canListMetrics?: boolean;
    canListSeus?: boolean;
  }): Promise<{
    client: Client<paths>;
    token: string;
  }> {
    const { client: clientToCreateAccessToken } = await createClientLoggedIn();

    const resCreateToken = await clientToCreateAccessToken.POST(
      "/u/base/access-token/item",
      {
        body: {
          name: "Test Token",
          permissions: {
            metricResourceValueMetricIds:
              options?.permMetricResourceValueMetricIds ?? [],
            canListMeters: options?.canListMeters ?? false,
            canListMetrics: options?.canListMetrics ?? false,
            canListSeus: options?.canListSeus ?? false,
          },
        },
      },
    );
    expect(resCreateToken).toBeApiOk();

    const token = resCreateToken.data!.token;

    const headers = new Headers();
    headers.set("X-Token", token);
    const client = createClient(headers);
    return { client, token };
  }

  export async function createClientLoggedIn(options?: {
    username?: string;
    password?: string;
    overwrittenPermissions?: IPermission[];
    overwrittenOrganizationPlan?: IOrganizationPlan;
  }): Promise<{
    client: Client<paths>;
    session: z.infer<typeof SchemaSessionDetail>;
  }> {
    const loginBody = {
      email: options?.username || EXAMPLE_USER_EMAIL,
      password: options?.password || EXAMPLE_USER_PASSWORD,
      token: "DUMMY",
    };

    let res;

    if (
      options?.overwrittenPermissions ||
      options?.overwrittenOrganizationPlan
    ) {
      // Mock ServiceSession before login to overwrite permissions
      const originalCreate = ServiceSession.create;
      const mockCreate = vi.spyOn(ServiceSession, "create");

      await mockCreate.withImplementation(
        (c, userId) => {
          return originalCreate(c, userId, {
            overwrittenPermissions: options.overwrittenPermissions,
            overwrittenOrganizationPlan: options.overwrittenOrganizationPlan,
          });
        },
        async () => {
          res = await createClient().POST("/g/login", {
            body: loginBody,
          });
        },
      );
    } else {
      // Normal way to login
      res = await createClient().POST("/g/login", {
        body: loginBody,
      });
    }

    expect(res).toBeApiOk();
    const client = createClientWithCookie(res!);
    return { client, session: res!.data! };
  }

  export function sortById<T extends { id: string }[]>(list: T): T {
    return list.sort((a, b) => a.id.localeCompare(b.id));
  }

  // TODO beforeAll won't work because db is inited beforeEach
  // export function useLoggedInClientGetter() {
  //   let client: Awaited<ReturnType<(typeof UtilsTest)["createClientLoggedIn"]>>;

  //   beforeAll(async () => {
  //     client = await UtilsTest.createClientLoggedIn();
  //   });

  //   return () => {
  //     return client;
  //   };
  // }
}
