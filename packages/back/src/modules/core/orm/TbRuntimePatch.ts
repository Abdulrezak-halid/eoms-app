/**
 * @file: TbRuntimePatch.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 19.11.2024
 * Last Modified Date: 27.02.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const TbRuntimePatch = pgTable("tb_runtime_patches", {
  index: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: text().notNull(),
  appliedAt: timestamp({ mode: "string" }).notNull(),
});
