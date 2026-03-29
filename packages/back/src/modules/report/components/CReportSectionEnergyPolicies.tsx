import { FC } from "hono/jsx";

import { ServiceEnergyPolicy } from "@m/commitment/services/ServiceEnergyPolicy";

import { IContextReport } from "../interfaces/IContextReport";

export const CReportSectionEnergyPolicies: FC<{ c: IContextReport }> = async ({
  c,
}) => {
  const policies = await ServiceEnergyPolicy.getAll(c, c.orgId);

  return (
    <ul>
      {policies.map((p, i) => (
        <li key={i}>{p.content}</li>
      ))}
    </ul>
  );
};
