import { CAccessTokenAddForm } from "@m/base/pages/CAccessTokenAddForm";
import { CAccessTokenEditForm } from "@m/base/pages/CAccessTokenEditForm";
import { CAccessTokenList } from "@m/base/pages/CAccessTokenList";
import { CChangelog } from "@m/base/pages/CChangelog";
import { CDepartmentAddForm } from "@m/base/pages/CDepartmentAddForm";
import { CDepartmentEditForm } from "@m/base/pages/CDepartmentEditForm";
import { CDepartmentList } from "@m/base/pages/CDepartmentList";
import { CIssueReportRequest } from "@m/base/pages/CIssueReportRequest";
import { CMyOrganization } from "@m/base/pages/CMyOrganization";
import { CMyProfile } from "@m/base/pages/CMyProfile";
import CNotificationPage from "@m/base/pages/CNotificationPage";
import { COrganizationPartnerList } from "@m/base/pages/COrganizationPartnerList";
import { CPersonalTokenAddForm } from "@m/base/pages/CPersonalTokenAddForm";
import { CPersonalTokenEditForm } from "@m/base/pages/CPersonalTokenEditForm";
import { CPersonalTokenList } from "@m/base/pages/CPersonalTokenList";
import CQuickNavigationPage from "@m/base/pages/CQuickNavigationPage";
import { CUserAddForm } from "@m/base/pages/CUserAddForm";
import { CUserEditForm } from "@m/base/pages/CUserEditForm";
import { CUserList } from "@m/base/pages/CUserList";
import { CUserPermission } from "@m/base/pages/CUserPermission";

/**
 * Note: Dynamic routes must be defined like;
 * `/path/to/${":varName" as string}`
 */
export const routes = [
  {
    path: "/",
    component: CQuickNavigationPage,
  },
  {
    path: "/quick-navigation",
    component: CQuickNavigationPage,
  },
  {
    path: "/notifications",
    component: CNotificationPage,
  },

  // Configuration ------------------------------------------------------------------
  {
    path: "/conf/user",
    component: CUserList,
    permission: "/BASE/USER",
    orgPlanFeature: "USER_MANAGEMENT",
  },
  {
    path: "/conf/user/item-add",
    component: CUserAddForm,
    permission: "/BASE/USER",
    orgPlanFeature: "USER_MANAGEMENT",
  },
  {
    path: `/conf/user/item/${":id" as string}`,
    component: CUserEditForm,
    permission: "/BASE/USER",
    orgPlanFeature: "USER_MANAGEMENT",
  },
  {
    path: `/conf/user/permission/${":userId" as string}`,
    component: CUserPermission,
    permission: "/BASE/USER",
    orgPlanFeature: "USER_MANAGEMENT",
  },

  {
    path: "/configuration/departments",
    component: CDepartmentList,
    permission: "/BASE/DEPARTMENT",
  },
  {
    path: "/configuration/departments/item-add",
    component: CDepartmentAddForm,
    permission: "/BASE/DEPARTMENT",
  },
  {
    path: `/configuration/departments/item/${":id" as string}`,
    component: CDepartmentEditForm,
    permission: "/BASE/DEPARTMENT",
  },

  {
    path: "/configuration/my-organization",
    component: CMyOrganization,
  },

  {
    path: "/configuration/organization-partners",
    component: COrganizationPartnerList,
    permission: "/BASE/ORGANIZATION_PARTNER",
    orgPlanFeature: "ORGANIZATION_PARTNER",
  },

  {
    path: "/configuration/access-token",
    component: CAccessTokenList,
    permission: "/BASE/ACCESS_TOKEN",
    orgPlanFeature: "ACCESS_TOKEN",
  },
  {
    path: "/configuration/access-token/item-add",
    component: CAccessTokenAddForm,
    permission: "/BASE/ACCESS_TOKEN",
    orgPlanFeature: "ACCESS_TOKEN",
  },
  {
    path: `/configuration/access-token/item/${":id" as string}`,
    component: CAccessTokenEditForm,
    permission: "/BASE/ACCESS_TOKEN",
    orgPlanFeature: "ACCESS_TOKEN",
  },

  {
    path: "/my-profile",
    component: CMyProfile,
  },
  {
    path: "/my-profile/personal-tokens",
    component: CPersonalTokenList,
    permission: "/BASE/ACCESS_TOKEN",
    orgPlanFeature: "ACCESS_TOKEN",
  },
  {
    path: "/my-profile/personal-tokens/item-add",
    component: CPersonalTokenAddForm,
    permission: "/BASE/ACCESS_TOKEN",
    orgPlanFeature: "ACCESS_TOKEN",
  },
  {
    path: `/my-profile/personal-tokens/item/${":id" as string}`,
    component: CPersonalTokenEditForm,
    permission: "/BASE/ACCESS_TOKEN",
    orgPlanFeature: "ACCESS_TOKEN",
  },

  {
    path: "/issue-report-request",
    component: CIssueReportRequest,
  },
  {
    path: "/changelog",
    component: CChangelog,
  },
] as const;
