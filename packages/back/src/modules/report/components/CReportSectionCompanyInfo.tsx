import { FC } from "hono/jsx";

import { ServiceOrganization } from "@m/base/services/ServiceOrganization";

import { IContextReport } from "../interfaces/IContextReport";

export const CReportSectionCompanyInfo: FC<{ c: IContextReport }> = async ({
  c,
}) => {
  const org = await ServiceOrganization.getUnsafe(c, c.orgId);
  return (
    <div>
      <b>{org.displayName}</b>
      <div>
        <div>
          <b>{c.i18n.t("address")}: </b>
          <span>{org.address}</span>
        </div>
        <div>
          <b>{c.i18n.t("phone")}: </b>
          {org.phones.map((phone, index) => (
            <span key={index}>{phone} </span>
          ))}
        </div>
        <div>
          <b>{c.i18n.t("email")}: </b>
          <span>{org.email}</span>
        </div>
      </div>
    </div>
  );
};
