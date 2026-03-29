import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CComplianceObligationForm } from "../components/CComplianceObligationForm";
import { IDtoComplianceObligationRequest } from "../interfaces/IDtoComplianceObligation";

export function CComplianceObligationAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoComplianceObligationRequest) => {
      const res = await Api.POST("/u/commitment/compliance-obligation/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/commitment/compliance-obligation");
      }
    },
    [apiToast, navigate],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("complianceObligation"),
        path: "/commitment/compliance-obligation",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CComplianceObligationForm onSubmit={handleSubmit} />
    </CBody>
  );
}
