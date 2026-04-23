import { pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { TbUser } from "@m/base/orm/TbUser";

import { TbCommunicationAwarenessPlan } from "./TbCommunicationAwarenessPlan";

export const TbCommunicationAwarenessPlanTargetUser = pgTable(
  "tb_support_communication_awareness_plan_target_users",
  {
    subjectId: uuid()
      .notNull()
      .references(() => TbCommunicationAwarenessPlan.id),
    userId: uuid()
      .notNull()
      .references(() => TbUser.id),
  },
  (t) => [uniqueIndex().on(t.subjectId, t.userId)],
);
