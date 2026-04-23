import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { COutboundIntegrationForm } from "../components/COutboundIntegrationForm";
import { IDtoOutboundIntegrationRequest } from "../interfaces/IDtoOutboundIntegration";

export function COutboundIntegrationAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoOutboundIntegrationRequest) => {
      const res = await Api.POST(
        "/u/measurement/outbound-integration/item",
        {
          body: data,
        },
      );
      apiToast(res);

      if (!res.error) {
        navigate("/measurements/metric-integration/outbound");
      }
    },
    [apiToast, navigate],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      { label: t("integrations") },
      {
        label: t("outbound"),
        path: "/measurements/metric-integration/outbound",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <COutboundIntegrationForm onSubmit={handleSubmit} />
    </CBody>
  );
}
