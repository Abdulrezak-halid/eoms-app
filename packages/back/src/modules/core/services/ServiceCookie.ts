import type { Context } from "hono";
import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";

import type {
  IHonoContextCore,
  IHonoContextUser,
} from "../interfaces/IContext";

const KEY = "S";

export namespace ServiceCookie {
  export async function set(
    c: Context<IHonoContextCore> | Context<IHonoContextUser>,
    token: string,
  ) {
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    await setSignedCookie(c, KEY, token, c.var.env.COOKIE_SECRET, {
      path: "/",
      secure: c.var.env.SECURE_COOKIE,
      httpOnly: true,
      sameSite: "Strict",
      expires: date,
    });
  }

  export function clear(c: Context) {
    deleteCookie(c, KEY);
  }

  export async function get(
    c: Context<IHonoContextCore> | Context<IHonoContextUser>,
  ): Promise<string | null> {
    const token = await getSignedCookie(c, c.var.env.COOKIE_SECRET, KEY);
    if (!token) {
      return null;
    }
    return token;
  }
}
