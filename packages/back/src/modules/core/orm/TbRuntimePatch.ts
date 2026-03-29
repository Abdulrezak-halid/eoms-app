import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const TbRuntimePatch = pgTable("tb_runtime_patches", {
  index: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: text().notNull(),
  appliedAt: timestamp({ mode: "string" }).notNull(),
});
