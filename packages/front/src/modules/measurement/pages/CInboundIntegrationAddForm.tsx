/**
 * @file: CInboundIntegrationAddForm.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 15.07.2025
 * Last Modified Date: 15.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CInboundIntegrationForm } from "../components/CInboundIntegrationForm";
import { IDtoInboundIntegrationRequest } from "../interfaces/IDtoInboundIntegration";

export function CInboundIntegrationAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoInboundIntegrationRequest) => {
      const res = await Api.POST(
        "/u/measurement/inbound-integration/item",
        {
          body: data,
        },
      );
      apiToast(res);

      if (!res.error) {
        navigate("/measurements/metric-integration/inbound");
      }
    },
    [apiToast, navigate],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      { label: t("integrations") },
      {
        label: t("inbound"),
        path: "/measurements/metric-integration/inbound",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CInboundIntegrationForm onSubmit={handleSubmit} />
    </CBody>
  );
}
