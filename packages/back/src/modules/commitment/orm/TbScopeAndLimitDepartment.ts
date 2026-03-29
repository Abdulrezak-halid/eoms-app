import { pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { TbDepartment } from "@m/base/orm/TbDepartment";

import { TbScopeAndLimit } from "./TbScopeAndLimit";

export const TbScopeAndLimitDepartment = pgTable(
  "tb_commitment_scope_and_limit_departments",
  {
    subjectId: uuid()
      .notNull()
      .references(() => TbScopeAndLimit.id),
    departmentId: uuid()
      .notNull()
      .references(() => TbDepartment.id),
  },
  (t) => [uniqueIndex().on(t.subjectId, t.departmentId)],
);
