import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CCommunicationAndAwarenessPlanForm } from "../components/CCommunicationAndAwarenessPlanForm";
import { IDtoCommunicationAndAwarenessPlanRequest } from "../interfaces/IDtoCommunicationAndAwarenessPlan";

export function CCommunicationAndAwarenessPlanAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("communicationAndAwarenessPlans"),
        path: "/supporting-operations/communication-awareness-plan",
      },
      {
        label: t("add"),
      },
    ],
    [t],
  );

  const handleSubmit = useCallback(
    async (data: IDtoCommunicationAndAwarenessPlanRequest) => {
      const res = await Api.POST(
        "/u/support/communication-awareness-plan/item",
        {
          body: data,
        },
      );
      apiToast(res);

      if (!res.error) {
        navigate("/supporting-operations/communication-awareness-plan");
      }
    },
    [apiToast, navigate],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CCommunicationAndAwarenessPlanForm onSubmit={handleSubmit} />
    </CBody>
  );
}
