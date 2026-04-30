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

import { CComplianceObligationeomscleForm } from "../components/CComplianceObligationeomscleForm";
import { IDtoComplianceObligationeomscleRequest } from "../interfaces/IDtoComplianceObligation";

export function CComplianceObligationeomscleEditForm() {
  const { t } = useTranslation();
  const { subjectId = "", id: ideaId = "" } = useParams();
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

  const fetchIdea = useCallback(
    () =>
      Api.GET(
        "/u/commitment/compliance-obligation/item/{subjectId}/eomscle/{id}",
        {
          params: { path: { subjectId, id: ideaId } },
        },
      ),
    [subjectId, ideaId],
  );
  const [ideaData] = useLoader(fetchIdea);

  const handleSubmit = useCallback(
    async (body: IDtoComplianceObligationeomscleRequest) => {
      const res = await Api.PUT(
        "/u/commitment/compliance-obligation/item/{subjectId}/eomscle/{id}",
        {
          params: { path: { subjectId, id: ideaId } },
          body,
        },
      );
      apiToast(res);
      if (!res.error) {
        navigate(`/commitment/compliance-obligation/item/${subjectId}/eomscle`);
      }
    },
    [apiToast, navigate, subjectId, ideaId],
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
      {
        label: complianceObligationData?.payload?.complianceObligation || "",
        dynamic: true,
      },
      { label: t("edit") },
    ],
    [t, complianceObligationData.payload?.complianceObligation, subjectId],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={ideaData}>
        {(payload) => (
          <CComplianceObligationeomscleForm
            initialData={payload}
            onSubmit={handleSubmit}
          />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
