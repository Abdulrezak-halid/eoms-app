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

import { CCommunicationAndAwarenessPlanForm } from "../components/CCommunicationAndAwarenessPlanForm";
import { IDtoCommunicationAndAwarenessPlanRequest } from "../interfaces/IDtoCommunicationAndAwarenessPlan";

export function CCommunicationAndAwarenessPlanEditForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { id: paramId } = useParams();
  const id = paramId || "";

  const fetcher = useCallback(async () => {
    const res = await Api.GET(
      "/u/support/communication-awareness-plan/item/{id}",
      {
        params: { path: { id } },
      },
    );
    return res;
  }, [id]);
  const [data] = useLoader(fetcher);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("communicationAndAwarenessPlans"),
        path: "/supporting-operations/communication-awareness-plan",
      },
      { label: data.payload?.action, dynamic: true },
      { label: t("edit") },
    ],
    [t, data.payload?.action],
  );

  const handleSubmit = useCallback(
    async (body: IDtoCommunicationAndAwarenessPlanRequest) => {
      const res = await Api.PUT(
        "/u/support/communication-awareness-plan/item/{id}",
        {
          params: { path: { id } },
          body,
        },
      );
      apiToast(res);
      if (!res.error) {
        navigate("/supporting-operations/communication-awareness-plan");
      }
    },
    [apiToast, navigate, id],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CCommunicationAndAwarenessPlanForm
            initialData={payload}
            onSubmit={handleSubmit}
          />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
