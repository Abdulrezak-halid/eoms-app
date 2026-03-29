import { pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { TbDepartment } from "@m/base/orm/TbDepartment";

import { TbInternalExternalConsideration } from "./TbInternalExternalConsideration";

export const TbInternalExternalConsiderationDepartment = pgTable(
  "tb_commitment_internal_external_consideration_departments",
  {
    subjectId: uuid()
      .notNull()
      .references(() => TbInternalExternalConsideration.id),
    departmentId: uuid()
      .notNull()
      .references(() => TbDepartment.id),
  },
  (t) => [uniqueIndex().on(t.subjectId, t.departmentId)],
);
