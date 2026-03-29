import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CQdmsIntegrationForm } from "../components/CQdmsIntegrationForm";
import { IDtoQdmsIntegrationRequest } from "../interfaces/IDtoQdmsIntegration";

export function CQdmsIntegrationAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("qdmsShort"),
        path: "/dms/qdms-integration",
      },
      {
        label: t("add"),
      },
    ],
    [t],
  );

  const handleSubmit = useCallback(
    async (data: IDtoQdmsIntegrationRequest) => {
      const res = await Api.POST("/u/dms/qdms-integration/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/dms/qdms-integration");
      }
    },
    [apiToast, navigate],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CQdmsIntegrationForm onSubmit={handleSubmit} />
    </CBody>
  );
}
