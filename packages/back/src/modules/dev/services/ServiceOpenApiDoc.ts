/**
 * @file: ServiceOpenApiDoc.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 18.05.2025
 * Last Modified Date: 18.05.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono, z } from "@hono/zod-openapi";

import { APP_NAME, VERSION } from "@/constants";

import { IHonoContextCore } from "@m/core/interfaces/IContext";

export namespace ServiceOpenApiDoc {
  const extraSchemas: Record<string, z.ZodType> = {};

  export function registerSchema(name: string, schema: z.ZodType) {
    extraSchemas[name] = schema;
  }

  export function assignRoutes(router: OpenAPIHono<IHonoContextCore>) {
    for (const name in extraSchemas) {
      router.openAPIRegistry.register(name, extraSchemas[name]);
    }

    router.doc31("/doc", (c) => {
      let servers;
      const referer = c.req.header("Referer");
      if (referer) {
        const urlReferer = new URL(referer);
        if (urlReferer.pathname.startsWith("/api/")) {
          servers = [{ url: "/api/" }];
        }
      }
      return {
        openapi: "3.1.0",
        info: {
          version: VERSION,
          title: `${APP_NAME} [${c.var.env.ENV_NAME}]`,
        },
        servers,
      };
    });

    router.get(
      "/ui",
      swaggerUI({
        title: `${APP_NAME} - API Doc`,
        url: "doc",
        docExpansion: "none",
        tagsSorter: "'alpha'",
        operationsSorter: "'alpha'",
        // syntaxHighlight: {
        //   activated: true,
        //   theme: ["tomorrow-night"],
        // },
      }),
    );
  }
}
