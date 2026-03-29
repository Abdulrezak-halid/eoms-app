import { Image, Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api, generateRequestGetPath } from "@m/base/api/Api";
import { CBadgeEnergyResource } from "@m/base/components/CBadgeEnergyResource";
import { CBadgeNotConfigured } from "@m/base/components/CBadgeNotConfigured";
import { CBadgePhone } from "@m/base/components/CBadgePhone";
import { CDisplayDateAgo } from "@m/base/components/CDisplayDateAgo";
import { CDisplayImage } from "@m/base/components/CDisplayImage";
import { ContextSession } from "@m/base/contexts/ContextSession";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CBadge } from "@m/core/components/CBadge";
import { CButton } from "@m/core/components/CButton";
import { CCard } from "@m/core/components/CCard";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CHr } from "@m/core/components/CHr";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CMutedText } from "@m/core/components/CMutedText";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { usePlanFeatureMap } from "../hooks/usePlanFeatureMap";
import { IDtoSysOrganizationsGetAllItem } from "../interfaces/IDtoSysOrganizations";

interface IProps {
  data: IDtoSysOrganizationsGetAllItem;
  load: () => Promise<void>;
}

export function COrganizationCard({ data, load }: IProps) {
  const { t } = useTranslation();
  const { session } = useContext(ContextSession);
  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(async () => {
    await push(
      t("msgRecordWillBeDeleted", { subject: data.displayName }),
      async () => {
        const res = await Api.DELETE("/u/sys/organization/item/{id}", {
          params: { path: { id: data.id } },
        });
        apiToast(res);
        if (res.error === undefined) {
          await load();
        }
      },
    );
  }, [apiToast, load, push, t, data]);

  const planFeatureMap = usePlanFeatureMap();

  const bannerUrl = useMemo(
    () =>
      data.hasBanner
        ? generateRequestGetPath("/u/sys/organization/item/{id}/banner", {
            path: { id: data.id },
          })
        : undefined,
    [data],
  );

  return (
    <CCard className="p-3 flex flex-col space-y-4">
      <div className="flex flex-col @md:flex-row items-start @md:items-center space-y-2 @md:space-y-0 @md:space-x-4 w-full">
        <CDisplayImage
          src={bannerUrl}
          alt={t("banner")}
          className="max-w-36 max-h-12"
        />

        <div className="flex-1 flex flex-col w-full">
          <div className="flex items-center justify-between w-full">
            <div className="font-bold text-lg truncate">{data.displayName}</div>
            <div className="flex space-x-2">
              <CLink
                icon={Image}
                label={t("changeBanner")}
                path={`/sys/organizations/item/${data.id}/banner`}
                hideLabelLg
              />
              <CLink
                icon={Pencil}
                label={t("edit")}
                path={`/sys/organizations/item/${data.id}`}
                hideLabelLg
              />
              <CButton
                icon={Trash2}
                label={t("_delete")}
                onClick={handleDelete}
                disabled={data.id === session.orgId}
                hideLabelLg
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-4 gap-4">
        <div className="space-y-3">
          <div>
            <CMutedText className="block mb-1" value={t("informations")} />
            <CHr />
          </div>

          <div>
            <CMutedText>{t("fullName")}</CMutedText>
            <div className="break-words">{data.fullName}</div>
          </div>

          <div>
            <CMutedText>{t("workspace")}</CMutedText>
            <div className="break-words">{data.workspace}</div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <CMutedText className="block mb-1" value={t("contactInfo")} />
            <CHr />
          </div>

          {data.phones?.length > 0 && (
            <div>
              <CMutedText>{t("phones")}</CMutedText>
              <CGridBadge>
                {data.phones.map((phone) => (
                  <CBadgePhone key={phone} value={phone.trim()} />
                ))}
              </CGridBadge>
            </div>
          )}

          <div>
            <CMutedText>{t("email")}</CMutedText>
            <div className="break-words">{data.email}</div>
          </div>

          <div>
            <CMutedText>{t("address")}</CMutedText>
            <div className="break-words line-clamp-3">{data.address}</div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <CMutedText className="block mb-1" value={t("sessionAndUsers")} />
            <CHr />
          </div>

          {data.lastSessionAt && (
            <div>
              <div>
                <CMutedText>{t("lastSession")}</CMutedText>
              </div>
              <div>
                <CDisplayDateAgo value={data.lastSessionAt} />
              </div>
            </div>
          )}

          <div>
            <CMutedText className="block">{t("createdAt")}</CMutedText>
            <CDisplayDateAgo value={data.createdAt} />
          </div>
          <div className="space-x-2">
            <CMutedText>{t("users")}</CMutedText>
            <span>{data.userCount || 0}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <CMutedText className="block mb-1" value={t("resourcesAndPlan")} />
            <CHr />
          </div>

          <div className="space-x-2">
            <CMutedText>{t("maxUserCount")}</CMutedText>
            <span>{data.plan?.maxUserCount || "-"}</span>
          </div>

          <div>
            <CMutedText value={t("energyResources")} />
            <CGridBadge>
              {data.config.energyResources.length === 0 ? (
                <CBadgeNotConfigured />
              ) : (
                data.config.energyResources.map((resource) => (
                  <CBadgeEnergyResource key={resource} value={resource} />
                ))
              )}
            </CGridBadge>
          </div>

          <div>
            <CMutedText>{t("features")}</CMutedText>
            <CLine className="space-x-2">
              {data.plan.features && data.plan.features.length > 0 ? (
                <>
                  <CGridBadge>
                    {data.plan.features.map((feature) => (
                      <CBadge
                        key={feature}
                        value={planFeatureMap[feature].label}
                      />
                    ))}
                  </CGridBadge>
                </>
              ) : (
                <CBadgeNotConfigured />
              )}
            </CLine>
          </div>
        </div>
      </div>
    </CCard>
  );
}
