import { index, pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { TbDepartment } from "@m/base/orm/TbDepartment";
import { TbOrganization } from "@m/base/orm/TbOrganization";

import { TbSeu } from "./TbSeu";

export const TbSeuDepartment = pgTable(
  "tb_measurement_seu_departments",
  {
    subjectId: uuid()
      .notNull()
      .references(() => TbSeu.id),
    departmentId: uuid()
      .notNull()
      .references(() => TbDepartment.id),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
  },
  (t) => [
    // A department can only assigned to a single seu with the same energy
    //   resource. This unique index does not cover this case and it is
    //   manually checked in ServiceSeu .create and .update methods.

    // orgId: ServiceSeu.getDepartmentsInUse
    // orgId, departmentId: ServiceSeu record in use check
    uniqueIndex().on(t.orgId, t.departmentId, t.subjectId),

    // subjectId: ServiceSeu
    index().on(t.subjectId),
  ],
);
