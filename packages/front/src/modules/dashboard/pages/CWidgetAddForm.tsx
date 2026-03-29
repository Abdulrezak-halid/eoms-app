import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CWidgetForm } from "../components/CWidgetForm";
import { IDtoWidgetConfig } from "../interfaces/IDtoDashboard";

export function CWidgetAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("dashboard"),
        path: "/",
      },
      {
        label: t("add"),
      },
    ],
    [t],
  );

  const handleSubmit = useCallback(
    async (data: {
      index: number;
      column: number;
      config: IDtoWidgetConfig;
    }) => {
      const res = await Api.POST("/u/dashboard/widget/item", {
        body: data,
      });
      apiToast(res);
      if (!res.error) {
        navigate("/");
      }
    },
    [apiToast, navigate],
  );

  const handleCancel = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CWidgetForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </CBody>
  );
}
