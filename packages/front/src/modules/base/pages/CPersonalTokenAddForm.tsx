import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CPersonalTokenForm } from "../components/CPersonalTokenForm";
import { IDtoPersonalTokenRequest } from "../interfaces/IDtoPersonalToken";

export function CPersonalTokenAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      { label: t("personalTokens"), path: "/my-profile/personal-tokens" },
      { label: t("add") },
    ],
    [t],
  );

  const handleSubmit = useCallback(
    async (formData: IDtoPersonalTokenRequest) => {
      const res = await Api.POST("/u/base/user-token/item", {
        body: formData,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/my-profile/personal-tokens");
      }
    },
    [apiToast, navigate],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CPersonalTokenForm onSubmit={handleSubmit} />
    </CBody>
  );
}
