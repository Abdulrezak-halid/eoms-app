import { pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { TbNonconformity } from "./TbNonconformity";
import { TbWorkflow } from "./TbWorkflow";

export const TbWorkflowNonconformity = pgTable(
  "tb_internal_audit_workflow_noncoformities",
  {
    subjectId: uuid()
      .notNull()
      .references(() => TbWorkflow.id),
    nonconformityId: uuid()
      .notNull()
      .references(() => TbNonconformity.id),
  },
  (t) => [uniqueIndex().on(t.subjectId, t.nonconformityId)],
);
