import {
  AnyPgColumn,
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { IEnergyResource } from "@m/base/interfaces/IEnergyResource";

import type { IOrganizationPlan } from "../interfaces/IOrganizationPlan";
import { TbUser } from "./TbUser";

export const TbOrganization = pgTable(
  "tb_organizations",
  {
    id: uuid().primaryKey().defaultRandom(),
    displayName: text().unique().notNull(),
    fullName: text().notNull(),
    address: text().notNull(),
    phones: jsonb().$type<string[]>().notNull(),
    email: text().notNull(),
    config: jsonb().$type<{ energyResources: IEnergyResource[] }>().notNull(),
    workspace: text().unique().notNull(),
    plan: jsonb().$type<IOrganizationPlan>().notNull(),
    hasBanner: boolean().notNull().default(false),
    createdAt: timestamp({ mode: "string" }).notNull(),
    // AnyPgColumn type is used to fix type error caused by dependency loop
    createdByOrgId: uuid().references((): AnyPgColumn => TbOrganization.id),
    createdBy: uuid().references((): AnyPgColumn => TbUser.id),
  },
  (t) => [
    index().on(t.createdByOrgId, t.createdAt),

    // workspace: ServiceOrganization.getIdFromReferer
    index().on(t.workspace),
  ],
);
