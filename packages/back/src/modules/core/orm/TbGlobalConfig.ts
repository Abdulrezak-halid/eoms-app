import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const TbGlobalConfig = pgTable("tb_global_config", {
  key: text().primaryKey().$type<"MAINTENANCE">(),
  value: jsonb().notNull(),
});
