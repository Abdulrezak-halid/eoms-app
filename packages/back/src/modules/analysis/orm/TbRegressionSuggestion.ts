import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";
import { DataMessageQueueTaskStatus } from "@m/core/interfaces/IMessageQueueTaskStatus";
import { TbSeu } from "@m/measurement/orm/TbSeu";

import { DataAdvancedRegressionSuggestionFail } from "../interfaces/IAdvancedRegressionSuggestionFail";

export const TbRegressionSuggestion = pgTable(
  "tb_regression_suggestions",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdBy: uuid().references(() => TbUser.id), // nullable
    createdAt: timestamp({ mode: "string" }).notNull(),
    datetimeStart: timestamp({ mode: "string" }).notNull(),
    datetimeEnd: timestamp({ mode: "string" }).notNull(),
    status: text({ enum: DataMessageQueueTaskStatus }).notNull(),
    seuId: uuid()
      .notNull()
      .references(() => TbSeu.id)
      .notNull(),
    failInfo: text({ enum: DataAdvancedRegressionSuggestionFail }), // nullable
  },
  (t) => [
    // orgId, seuId, createdAt: ServiceAdvancedRegression.getSuggestions
    index().on(t.orgId, t.seuId, t.createdAt),
  ],
);
