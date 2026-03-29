/**
 * @file: OutboundIntegrationHandlerAvevaPi.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 20.08.2025
 * Last Modified Date: 20.08.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";
import { EApiFailCode, UtilDate } from "common";
import { and, eq } from "drizzle-orm";
import { ProxyAgent } from "undici";

import { ApiException } from "@m/core/exceptions/ApiException";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";

import {
  IOutboundIntegrationHandler,
  IOutboundIntegrationRunResultItem,
} from "../interfaces/IOutboundIntegrationHandler";
import { TbOutboundIntegrationParamAvevaPi } from "../orm/TbOutboundIntegrationParamAvevaPi";

export const OutboundIntegrationHandlerAvevaPi: IOutboundIntegrationHandler<{
  baseUrl: string;
  username: string;
  password: string;
}> = {
  async get(c, orgId, id) {
    const [record] = await c.db
      .select({
        baseUrl: TbOutboundIntegrationParamAvevaPi.baseUrl,
        username: TbOutboundIntegrationParamAvevaPi.username,
        password: TbOutboundIntegrationParamAvevaPi.password,
      })
      .from(TbOutboundIntegrationParamAvevaPi)
      .where(
        and(
          eq(TbOutboundIntegrationParamAvevaPi.orgId, orgId),
          eq(TbOutboundIntegrationParamAvevaPi.subjectId, id),
        ),
      );

    if (!record) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Pi Vision integration param is not found.",
      );
    }

    return record;
  },

  async create(c, orgId, id, param) {
    await c.db.insert(TbOutboundIntegrationParamAvevaPi).values({
      orgId,
      subjectId: id,
      baseUrl: param.baseUrl,
      username: param.username,
      password: param.password,
    });
  },

  async remove(c, orgId, id) {
    await c.db
      .delete(TbOutboundIntegrationParamAvevaPi)
      .where(
        and(
          eq(TbOutboundIntegrationParamAvevaPi.orgId, orgId),
          eq(TbOutboundIntegrationParamAvevaPi.subjectId, id),
        ),
      );
  },

  async run(c, o, p) {
    if (!o.outputKeys?.length) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "Pi Vision integration cannot work without output keys.",
      );
    }

    const headers = new Headers();
    headers.set(
      "Authorization",
      `Basic ${Buffer.from(`${p.username}:${p.password}`).toString("base64")}`,
    );

    const proxyToken =
      c.env.PRIVATE_INTEGRATION_PROXY_USER &&
      c.env.PRIVATE_INTEGRATION_PROXY_PASSWORD
        ? `Basic ${Buffer.from(
            `${c.env.PRIVATE_INTEGRATION_PROXY_USER}:${c.env.PRIVATE_INTEGRATION_PROXY_PASSWORD}`,
          ).toString("base64")}`
        : undefined;
    const proxyAgent = c.env.PRIVATE_INTEGRATION_PROXY_URL
      ? new ProxyAgent({
          uri: c.env.PRIVATE_INTEGRATION_PROXY_URL,
          token: proxyToken,
        })
      : undefined;

    const fetchOptions = {
      headers,
      dispatcher: proxyAgent,
    };

    const result: IOutboundIntegrationRunResultItem[] = [];

    let baseUrl = p.baseUrl;
    if (!baseUrl.endsWith("/")) {
      baseUrl += "/";
    }
    for (const outputKey of o.outputKeys) {
      const url = `${baseUrl}streams/${outputKey}/value`;
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const responseBody = await response.text();
        c.logger.error(
          {
            outputKey,
            piVisionRequest: {
              url,
              responseStatus: response.status,
              responseBody,
            },
          },
          "Pi Vision server response is not ok. Skipped output.",
        );
        result.push({
          outputKey,
          info: {
            error: "Pi Vision server response is not ok.",
            responseStatus: response.status,
            responseBody,
          },
        });
        continue;
      }

      const json = await response.json();

      // See below link for the API;
      // https://docs.aveva.com/bundle/pi-web-api-reference/page/help/controllers/stream/actions/getvalue.html
      const parsedValue = z
        .object({
          Timestamp: SchemaDatetime,
          UnitsAbbreviation: z.string(),
          Good: z.boolean(),
          // Questionable: false,
          // Substituted: false,
          // Annotated: false,
          Value: z.number(),
        })
        .safeParse(json);

      if (!parsedValue.success) {
        c.logger.error(
          {
            outputKey,
            piVisionResponseBody: json,
          },
          "Pi Vision responded with unexpected value structure. Skipped output.",
        );
        result.push({
          outputKey,
          info: {
            error: "Pi Vision responded with unexpected value structure.",
            rawValue: json,
          },
        });
        continue;
      }

      if (!parsedValue.data.Good) {
        c.logger.error(
          {
            outputKey,
            piVisionResponseBody: json,
          },
          "Pi Vision value record Good field is not true. Skipped output.",
        );
        result.push({
          outputKey,
          info: {
            error: "Pi Vision value record Good field is not true.",
            rawValue: json,
          },
        });
        continue;
      }

      result.push({
        outputKey,
        data: {
          value: parsedValue.data.Value,
          datetime: UtilDate.objToIsoDatetime(
            new Date(parsedValue.data.Timestamp),
          ),
        },
        info: parsedValue.data,
      });
    }

    c.logger.info({ result }, "Pi Vision value is read successfully.");

    return result;
  },
};
