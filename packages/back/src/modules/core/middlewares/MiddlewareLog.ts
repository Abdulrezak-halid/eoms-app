/**
 * @file: MiddlewareLog.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 07.01.2025
 * Last Modified Date: 07.01.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
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
