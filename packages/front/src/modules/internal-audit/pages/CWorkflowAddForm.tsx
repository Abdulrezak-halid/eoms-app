import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CWorkflowForm } from "../components/CWorkflowForm";
import { IDtoWorkflowRequest } from "../interfaces/IDtoWorkflow";

export function CWorkflowAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoWorkflowRequest) => {
      const res = await Api.POST("/u/internal-audit/workflow/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/internal-audit/workflow");
      }
    },
    [apiToast, navigate],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("workflows"),
        path: "/internal-audit/workflow",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CWorkflowForm onSubmit={handleSubmit} />
    </CBody>
  );
}
