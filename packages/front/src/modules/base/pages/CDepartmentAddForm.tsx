import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { IDtoDepartmentRequest } from "@m/base/interfaces/IDtoDepartment";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CDepartmentForm } from "../components/CDepartmentForm";

export function CDepartmentAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoDepartmentRequest) => {
      const res = await Api.POST("/u/base/department/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/configuration/departments");
      }
    },
    [apiToast, navigate],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("departments"),
        path: "/configuration/departments",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CDepartmentForm onSubmit={handleSubmit} />
    </CBody>
  );
}
