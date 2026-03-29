import { z } from "@hono/zod-openapi";
import { URL_REGEX } from "common";

export const SchemaUrl = z.string().regex(URL_REGEX);
