import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CJobRunForm } from "../components/CJobRunForm";
import { IDtoJobRunRequest } from "../interfaces/IDtoServiceJob";

export function CJobRunAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("jobs"),
        path: "/sys/job",
      },
      { label: t("run") },
    ],
    [t],
  );

  const handleSubmit = useCallback(
    async (data: IDtoJobRunRequest) => {
      const res = await Api.POST("/u/sys/job/run", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/sys/job");
      }
    },
    [apiToast, navigate],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CJobRunForm onSubmit={handleSubmit} />
    </CBody>
  );
}
