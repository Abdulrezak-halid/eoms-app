import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CSysOrganizationsForm } from "../components/CSysOrganizationsForm";
import { IDtoSysOrganizationsRequest } from "../interfaces/IDtoSysOrganizations";

export function CSysOrganizationsAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("sysOrganizations"),
        path: "/sys/organizations",
      },
      {
        label: t("add"),
      },
    ],
    [t],
  );

  const handleSubmit = useCallback(
    async (data: IDtoSysOrganizationsRequest) => {
      const res = await Api.POST("/u/sys/organization/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/sys/organizations");
      }
    },
    [apiToast, navigate],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CSysOrganizationsForm onSubmit={handleSubmit} showAdminFields={true} />
    </CBody>
  );
}
