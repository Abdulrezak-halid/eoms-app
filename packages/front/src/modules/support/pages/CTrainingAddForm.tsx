import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { CTrainingForm } from "@m/support/components/CTrainingForm";
import { IDtoTrainingRequest } from "@m/support/interfaces/IDtoTraining";

export function CTrainingAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("trainings"),
        path: "/supporting-operations/training",
      },
      { label: t("add") },
    ],
    [t],
  );

  const handleSubmit = useCallback(
    async (data: IDtoTrainingRequest) => {
      const res = await Api.POST("/u/support/training/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/supporting-operations/training");
      }
    },
    [apiToast, navigate],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CTrainingForm onSubmit={handleSubmit} />
    </CBody>
  );
}
