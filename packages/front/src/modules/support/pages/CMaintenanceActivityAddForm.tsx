import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CMaintenanceActivityForm } from "../components/CMaintenanceActivityForm";
import { IDtoMaintenanceActivityRequest } from "../interfaces/IDtoMaintenanceActivity";

export function CMaintenanceActivityAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoMaintenanceActivityRequest) => {
      const res = await Api.POST("/u/support/maintenance-activity/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/supporting-operations/maintenance-activity");
      }
    },
    [apiToast, navigate],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("maintenanceActivities"),
        path: "/supporting-operations/maintenance-activity",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CMaintenanceActivityForm onSubmit={handleSubmit} />
    </CBody>
  );
}
