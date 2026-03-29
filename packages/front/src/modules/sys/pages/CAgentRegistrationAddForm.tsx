import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CAgentRegistrationForm } from "../components/CAgentRegistrationForm";
import { IDtoAgentRegistrationRequest } from "../interfaces/IDtoAgentRegistration";

export function CAgentRegistrationAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("agentRegistration"),
        path: "/sys/agent-registration",
      },
      { label: t("add") },
    ],
    [t],
  );

  const handleSubmit = useCallback(
    async (data: IDtoAgentRegistrationRequest) => {
      const res = await Api.POST("/u/sys/agent/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/sys/agent-registration");
      }
    },
    [apiToast, navigate],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAgentRegistrationForm onSubmit={handleSubmit} />
    </CBody>
  );
}
