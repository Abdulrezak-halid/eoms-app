import { OpenAPIHono, z } from "@hono/zod-openapi";
import type { Env } from "hono";

export namespace UtilOpenApi {
  export function createRouter<TContext extends Env>() {
    return new OpenAPIHono<TContext>({
      defaultHook: UtilOpenApi.validationHookHandler,
    });
  }

  export function tag<TContext extends Env>(
    router: OpenAPIHono<TContext>,
    name: string,
  ) {
    // if (process.env.NODE_ENV !== "development") {
    //   return;
    // }

    router.openAPIRegistry.definitions.forEach((d) => {
      if (d.type === "route" && !d.route.tags) {
        d.route.tags = [name];
      }
    });
  }

  export function genResponseJson<T extends z.ZodType>(schema: T) {
    return {
      200: {
        content: { "application/json": { schema } },
        description: "Success",
      },
    };
  }

  export function genResponseNull() {
    return { 204: { description: "Success" } };
  }
  export function genResponseFile() {
    return {
      200: {
        content: {
          "application/octet-stream": {
            schema: z.string().openapi({
              description: "Binary data",
              format: "binary",
            }),
          },
        },
        description: "Success",
      },
    };
  }

  export function genResponseHtml() {
    return {
      200: {
        content: {
          "text/html": {
            schema: z.string().openapi({
              description: "Html content",
            }),
          },
        },
        description: "Success",
      },
    };
  }

  export function genRequestJsonSub<T extends z.ZodType>(schema: T) {
    return { content: { "application/json": { schema } }, required: true };
  }

  export function genRequestJson<T extends z.ZodType>(schema: T) {
    return { body: genRequestJsonSub(schema) };
  }

  export function genRequestFormSub<T extends z.ZodType>(schema: T) {
    return { content: { "multipart/form-data": { schema } }, required: true };
  }

  export function genRequestForm<T extends z.ZodType>(schema: T) {
    return { body: genRequestFormSub(schema) };
  }

  export function genRequestParamSub<T extends { [K: string]: z.ZodType }>(
    schemas: T,
  ) {
    const fields = {} as T;
    for (const k in schemas) {
      fields[k] = schemas[k].openapi({
        param: { name: k, in: "path" },
      });
    }
    return z.object(fields);
  }

  export function genRequestParam<T extends { [K: string]: z.ZodType }>(
    schemas: T,
  ) {
    return { params: genRequestParamSub(schemas) };
  }

  export function genRequestQuerySub<T extends { [K: string]: z.ZodType }>(
    schemas: T,
  ) {
    const fields = {} as T;
    for (const k in schemas) {
      fields[k] = schemas[k].openapi({
        param: { name: k, in: "query" },
      });
    }
    return z.object(fields);
  }

  export function genRequestQuery<T extends { [K: string]: z.ZodType }>(
    schemas: T,
  ) {
    return { query: genRequestQuerySub(schemas) };
  }

  export function validationHookHandler({
    error,
  }: {
    success: boolean;
    error?: z.ZodError;
  }) {
    if (error) {
      throw error;
    }
  }
}
