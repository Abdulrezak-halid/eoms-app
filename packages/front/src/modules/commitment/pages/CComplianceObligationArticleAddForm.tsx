import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useLoader } from "@m/core/hooks/useLoader";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CComplianceObligationeomscleForm } from "../components/CComplianceObligationeomscleForm";
import { IDtoComplianceObligationeomscleRequest } from "../interfaces/IDtoComplianceObligation";

export function CComplianceObligationeomscleAddForm() {
  const { t } = useTranslation();
  const { subjectId = "" } = useParams();
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const fetchcomplianceObligation = useCallback(
    () =>
      Api.GET("/u/commitment/compliance-obligation/item/{id}", {
        params: { path: { id: subjectId } },
      }),
    [subjectId],
  );
  const [complianceObligationData] = useLoader(fetchcomplianceObligation);

  const handleSubmit = useCallback(
    async (data: IDtoComplianceObligationeomscleRequest) => {
      const res = await Api.POST(
        "/u/commitment/compliance-obligation/item/{subjectId}/eomscle",
        {
          body: data,
          params: { path: { subjectId } },
        },
      );
      apiToast(res);
      if (!res.error) {
        navigate(`/commitment/compliance-obligation/item/${subjectId}/eomscle`);
      }
    },
    [apiToast, navigate, subjectId],
  );

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("complianceObligation"),
        path: "/commitment/compliance-obligation",
      },
      {
        label: complianceObligationData.payload?.complianceObligation,
        dynamic: true,
      },
      {
        label: t("eomscles"),
        path: `/commitment/compliance-obligation/item/${subjectId}/eomscle`,
      },
      { label: t("add") },
    ],
    [t, complianceObligationData.payload?.complianceObligation, subjectId],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CComplianceObligationeomscleForm onSubmit={handleSubmit} />
    </CBody>
  );
}
