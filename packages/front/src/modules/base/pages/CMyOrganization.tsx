import { useCallback, useContext, useMemo } from "react";

import { Api, generateRequestGetPath } from "@m/base/api/Api";
import { CBadgeEmail } from "@m/base/components/CBadgeEmail";
import { CBadgeEnergyResource } from "@m/base/components/CBadgeEnergyResource";
import { CBadgePhone } from "@m/base/components/CBadgePhone";
import { CBody } from "@m/base/components/CBody";
import { CDisplayImage } from "@m/base/components/CDisplayImage";
import { CDisplayIntegrationGrid } from "@m/base/components/CDisplayIntegrationGrid";
import { ContextSession } from "@m/base/contexts/ContextSession";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CBadge } from "@m/core/components/CBadge";
import { CCard } from "@m/core/components/CCard";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CMutedText } from "@m/core/components/CMutedText";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { usePlanFeatureMap } from "@m/sys/hooks/usePlanFeatureMap";

export function CMyOrganization() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo(() => [{ label: t("myOrganization") }], [t]);

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/organization");
  }, []);

  const [data] = useLoader(fetcher);

  const planFeatureMap = usePlanFeatureMap();

  const { session } = useContext(ContextSession);

  const bannerUrl = useMemo(
    () =>
      session.orgHasBanner
        ? generateRequestGetPath("/u/organization/banner/{id}", {
            path: { id: session.orgId },
          })
        : undefined,
    [session.orgHasBanner, session.orgId],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(organization) => (
          <CFormPanel>
            <CFormLine label={t("banner")}>
              <CCard className="p-3">
                <CDisplayImage
                  className="max-w-full max-h-16 mx-auto"
                  src={bannerUrl}
                  alt={session.orgDisplayName}
                />
              </CCard>
            </CFormLine>

            <CFormLine label={t("displayName")}>
              <CCard className="p-3">
                <div>{organization.displayName}</div>
              </CCard>
            </CFormLine>

            <CFormLine label={t("fullName")}>
              <CCard className="p-3">
                <div>{organization.fullName}</div>
              </CCard>
            </CFormLine>

            <CFormLine label={t("address")}>
              <CCard className="p-3">
                <div>{organization.address}</div>
              </CCard>
            </CFormLine>

            <CFormLine label={t("phones")}>
              <CCard className="p-3">
                <CGridBadge>
                  {organization.phones.length === 0
                    ? "-"
                    : organization.phones.map((phone) => (
                        <CBadgePhone key={phone} value={phone} />
                      ))}
                </CGridBadge>
              </CCard>
            </CFormLine>

            <CFormLine label={t("email")}>
              <CCard className="p-3">
                <CBadgeEmail value={organization.email} />
              </CCard>
            </CFormLine>

            <CFormLine label={t("workspace")}>
              <CCard className="p-3">
                <div>{organization.workspace}</div>
              </CCard>
            </CFormLine>

            <CFormLine label={t("configuration")}>
              <CCard className="p-3">
                <div>
                  <CMutedText value={t("energyResources")} />
                  <CGridBadge>
                    {organization.config.energyResources.length === 0
                      ? "-"
                      : organization.config.energyResources.map((resource) => (
                          <CBadgeEnergyResource
                            key={resource}
                            value={resource}
                          />
                        ))}
                  </CGridBadge>
                </div>
              </CCard>
            </CFormLine>

            <CFormLine label={t("plan")}>
              <CCard className="p-3">
                {organization.plan.features &&
                organization.plan.features.length > 0 ? (
                  <>
                    <div className="space-x-2">
                      <CMutedText>{t("maxUserCount")}</CMutedText>
                      <span>{organization.plan.maxUserCount || "-"}</span>
                    </div>
                    <div>
                      <CMutedText>{t("features")}</CMutedText>
                      <CGridBadge>
                        {organization.plan.features.map((feature) => (
                          <CBadge
                            key={feature}
                            value={planFeatureMap[feature].label}
                          />
                        ))}
                      </CGridBadge>
                    </div>
                  </>
                ) : (
                  <CMutedText value={t("noFeature")} />
                )}
              </CCard>
            </CFormLine>

            <CFormLine label={t("integrations")}>
              <CCard className="p-3">
                <CDisplayIntegrationGrid />
              </CCard>
            </CFormLine>
          </CFormPanel>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
