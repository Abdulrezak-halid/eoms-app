import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IBreadCrumb } from "../components/CBreadCrumbs";
import { CUserForm } from "../components/CUserForm";
import { IDtoUserRequest } from "../interfaces/IDtoUser";

export function CUserAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("users"),
        path: "/conf/user",
      },
      {
        label: t("add"),
      },
    ],
    [t],
  );

  const handleSubmit = useCallback(
    async (data: IDtoUserRequest) => {
      const res = await Api.POST("/u/base/user/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/conf/user");
      }
    },
    [apiToast, navigate],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CUserForm onSubmit={handleSubmit} />
    </CBody>
  );
}
