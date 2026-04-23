import { pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { TbDepartment } from "@m/base/orm/TbDepartment";
import { TbNeedAndExpectation } from "@m/commitment/orm/TbNeedAndExpectation";

export const TbNeedAndExpectationDepartments = pgTable(
  "tb_commitment_need_and_expectation_departments",
  {
    subjectId: uuid()
      .notNull()
      .references(() => TbNeedAndExpectation.id),
    departmentId: uuid()
      .notNull()
      .references(() => TbDepartment.id),
  },
  (t) => [uniqueIndex().on(t.subjectId, t.departmentId)],
);
