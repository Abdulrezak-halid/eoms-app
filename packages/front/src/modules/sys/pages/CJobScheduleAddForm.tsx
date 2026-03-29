import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CJobScheduleForm } from "../components/CJobScheduleForm";
import { IDtoJobScheduleRequest } from "../interfaces/IDtoServiceJob";

export function CJobScheduleAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("jobs"),
        path: "/sys/job",
      },
      { label: t("schedule") },
    ],
    [t],
  );

  const handleSubmit = useCallback(
    async (data: IDtoJobScheduleRequest) => {
      const res = await Api.POST("/u/sys/job/schedule", {
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
      <CJobScheduleForm onSubmit={handleSubmit} />
    </CBody>
  );
}
