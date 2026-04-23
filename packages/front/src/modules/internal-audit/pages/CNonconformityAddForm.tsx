import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";

import { CNonconformityForm } from "../components/CNonconformityForm";
import { IDtoNonconformityRequest } from "../interfaces/IDtoNonconformity";
import { useNavigate } from "@m/core/hooks/useNavigate";

export function CNonconformityAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoNonconformityRequest) => {
      const res = await Api.POST("/u/internal-audit/nonconformity/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/internal-audit/nonconformity");
      }
    },
    [apiToast, navigate],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("nonconformities"),
        path: "/internal-audit/nonconformity",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CNonconformityForm onSubmit={handleSubmit} />
    </CBody>
  );
}
