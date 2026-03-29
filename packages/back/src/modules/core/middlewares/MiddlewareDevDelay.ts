import { type Context, type Next } from "hono";

export async function MiddlewareDevDelay(_c: Context, next: Next) {
  await new Promise((res) => {
    setTimeout(res, 300);
  });
  return await next();
}
