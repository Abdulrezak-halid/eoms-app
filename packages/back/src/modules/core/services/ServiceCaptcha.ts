/**
 * @file: ServiceCaptcha.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 03.07.2025
 * Last Modified Date: 21.11.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { getConnInfo } from "@hono/node-server/conninfo";
import { EApiFailCode } from "common";
import { Context } from "hono";

import { ApiException } from "../exceptions/ApiException";
import { IHonoContextCore } from "../interfaces/IContext";

export namespace ServiceCaptcha {
  export async function verifyToken(
    c: Context<IHonoContextCore>,
    token: string,
  ) {
    if (!c.var.env.HCAPTCHA_SECRET_KEY) {
      // No log or error thrown. Because ServiceEnv already checks and throws
      //  an error on production environments.
      return;
    }

    const info = getConnInfo(c); // info is `ConnInfo`
    const ip = info.remote.address;

    if (!ip) {
      throw new ApiException(
        EApiFailCode.INTERNAL,
        "Remote IP address cannot be found.",
      );
    }

    // Validate the token by calling the
    // "/siteverify" API endpoint.
    const formData = new FormData();
    formData.append("secret", c.var.env.HCAPTCHA_SECRET_KEY);
    formData.append("remoteip", ip);
    formData.append("response", token);

    const url = "https://api.hcaptcha.com/siteverify";
    const result = await fetch(url, {
      body: formData,
      method: "POST",
    });

    const outcome = await result.json();
    if (!outcome.success) {
      throw new ApiException(
        EApiFailCode.INVALID_TOKEN,
        "Captcha token is not verified.",
      );
    }

    c.var.logger.info("Captcha token is verified.");
  }
}
