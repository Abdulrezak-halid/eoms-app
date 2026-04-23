import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CInternalExternalConsiderationForm } from "../components/CInternalExternalConsiderationForm";
import { IDtoInternalExternalConsiderationRequest } from "../interfaces/IDtoInternalExternalConsideration";

export function CInternalExternalConsiderationAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoInternalExternalConsiderationRequest) => {
      const res = await Api.POST(
        "/u/commitment/internal-external-consideration/item",
        {
          body: data,
        },
      );
      apiToast(res);

      if (!res.error) {
        navigate("/commitment/internal-external-considerations");
      }
    },
    [apiToast, navigate],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("internalExternalConsiderations"),
        path: "/commitment/internal-external-considerations",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CInternalExternalConsiderationForm onSubmit={handleSubmit} />
    </CBody>
  );
}
