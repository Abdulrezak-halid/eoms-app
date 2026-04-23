import { useCallback } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeEmail } from "@m/base/components/CBadgeEmail";
import { CBadgePhone } from "@m/base/components/CBadgePhone";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CFormLine } from "@m/core/components/CFormPanel";
import { CFormTitle } from "@m/core/components/CFormTitle";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CReportSectionCompanyInfo() {
  const { t } = useTranslation();

  const loader = useCallback(async () => {
    return await Api.GET("/u/organization");
  }, []);

  const [organizationData] = useLoader(loader);

  return (
    <CAsyncLoader data={organizationData}>
      {(org) => (
        <div>
          <CFormTitle value={t("companyInfo")} />

          <CFormLine label={t("displayName")}>
            <div className="p-3">{org.displayName || org.fullName || "-"}</div>
          </CFormLine>

          {org.address && (
            <CFormLine label={t("address")}>
              <div className="p-3">{org.address}</div>
            </CFormLine>
          )}

          {org.phones && org.phones.length > 0 && (
            <CFormLine label={t("phones")}>
              <div className="p-2.5">
                {org.phones.map((phone, index) => (
                  <CBadgePhone key={index} value={phone} />
                ))}
              </div>
            </CFormLine>
          )}

          {org.email && (
            <CFormLine label={t("email")}>
              <div className="p-2.5">
                <CBadgeEmail value={org.email} />
              </div>
            </CFormLine>
          )}
        </div>
      )}
    </CAsyncLoader>
  );
}
