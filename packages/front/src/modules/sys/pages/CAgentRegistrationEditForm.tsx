import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { useLoader } from "@m/core/hooks/useLoader";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CAgentRegistrationForm } from "../components/CAgentRegistrationForm";
import { IDtoAgentRegistrationRequest } from "../interfaces/IDtoAgentRegistration";

export function CAgentRegistrationEditForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const id = paramId || "";

  const fetcher = useCallback(async () => {
    const res = await Api.GET("/u/sys/agent/item/{id}", {
      params: { path: { id } },
    });
    return res;
  }, [id]);
  const [data] = useLoader(fetcher);

  const handleSubmit = useCallback(
    async (body: IDtoAgentRegistrationRequest) => {
      const res = await Api.PUT("/u/sys/agent/item/{id}", {
        params: { path: { id } },
        body,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/sys/agent-registration");
      }
    },
    [apiToast, navigate, id],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("agentRegistration"),
        path: "/sys/agent-registration",
      },
      { label: data.payload?.name, dynamic: true },
      { label: t("edit") },
    ],
    [t, data.payload?.name],
  );
  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CAgentRegistrationForm
            initialData={payload}
            onSubmit={handleSubmit}
          />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
