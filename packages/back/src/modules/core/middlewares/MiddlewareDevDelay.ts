/**
 * @file: MiddlewareDevDelay.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 07.01.2025
 * Last Modified Date: 07.01.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { type Context, type Next } from "hono";

export async function MiddlewareDevDelay(_c: Context, next: Next) {
  await new Promise((res) => {
    setTimeout(res, 300);
  });
  return await next();
}
