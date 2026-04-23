import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CAccessTokenForm } from "../components/CAccessTokenForm";
import { IDtoAccessTokenRequest } from "../interfaces/IDtoAccessToken";

export function CAccessTokenAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("accessTokens"),
        path: "/configuration/access-token",
      },
      {
        label: t("add"),
      },
    ],
    [t],
  );

  const handleSubmit = useCallback(
    async (formData: IDtoAccessTokenRequest) => {
      const res = await Api.POST("/u/base/access-token/item", {
        body: formData,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/configuration/access-token");
      }
    },
    [apiToast, navigate],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAccessTokenForm onSubmit={handleSubmit} />
    </CBody>
  );
}
