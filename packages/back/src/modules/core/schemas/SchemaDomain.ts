import { z } from "@hono/zod-openapi";
import { DOMAIN_REGEX } from "common";

export const SchemaDomain = z.string().regex(DOMAIN_REGEX);
