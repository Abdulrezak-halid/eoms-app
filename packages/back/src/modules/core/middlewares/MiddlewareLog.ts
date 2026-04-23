import { type Context, type Next } from "hono";

import { IHonoContextCore } from "@m/core/interfaces/IContext";

export async function MiddlewareLog(c: Context<IHonoContextCore>, next: Next) {
  await next();

  if (c.var.env.ENV_NAME === "test") {
    return;
  }
  c.var.logger.info(
    { name: "MiddlewareLog", status: c.res.status },
    "Http response.",
  );
}
