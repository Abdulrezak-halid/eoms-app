import {
  IDtoEOrganizationPlanFeature,
  IDtoEPermission,
} from "common/build-api-schema";
import { Settings } from "lucide-react";
import { useMemo } from "react";

import { IconType } from "@m/core/components/CIcon";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IRoutePath } from "@m/core/interfaces/IRoutePath";

export function useNavData() {
  const { t } = useTranslation();

  return useMemo<
    {
      icon: IconType;
      label: string;
      list: readonly {
        label: string;
        path: IRoutePath;
        highlightPath?: string;
        permission?: IDtoEPermission;
        orgPlanFeature?: IDtoEOrganizationPlanFeature;
      }[];
    }[]
  >(
    () => [
      {
        icon: Settings,
        label: t("configuration"),
        list: [
          {
            label: t("users"),
            path: "/conf/user",
            permission: "/BASE/USER",
            orgPlanFeature: "USER_MANAGEMENT",
          },
          {
            label: t("departments"),
            path: "/configuration/departments",
            permission: "/BASE/DEPARTMENT",
          },
          {
            label: t("myOrganization"),
            path: "/configuration/my-organization",
          },
          {
            label: t("partners"),
            path: "/configuration/organization-partners",
            permission: "/BASE/ORGANIZATION_PARTNER",
            orgPlanFeature: "ORGANIZATION_PARTNER",
          },
          {
            label: t("accessTokens"),
            path: "/configuration/access-token",
            permission: "/BASE/ACCESS_TOKEN",
            orgPlanFeature: "ACCESS_TOKEN",
          },
          {
            label: t("personalTokens"),
            path: "/my-profile/personal-tokens",
            permission: "/BASE/ACCESS_TOKEN",
            orgPlanFeature: "ACCESS_TOKEN",
          },
        ],
      },
    ],
    [t],
  );
}
