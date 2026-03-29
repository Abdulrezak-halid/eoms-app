import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CScopeAndLimitsForm } from "../components/CScopeAndLimitsForm";
import { IDtoScopeAndLimitsRequest } from "../interfaces/IDtoScopeAndLimits";

export function CScopeAndLimitsAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("scopeAndLimits"),
        path: "/commitment/scope-and-limit",
      },
      {
        label: t("add"),
      },
    ],
    [t],
  );

  const handleSubmit = useCallback(
    async (data: IDtoScopeAndLimitsRequest) => {
      const res = await Api.POST("/u/commitment/scope-and-limit/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/commitment/scope-and-limit");
      }
    },
    [apiToast, navigate],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CScopeAndLimitsForm onSubmit={handleSubmit} />
    </CBody>
  );
}
