import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CCriticalOperationalParameterForm } from "../components/CCriticalOperationalParameterForm";
import { IDtoCriticalOperationalParameterRequest } from "../interfaces/IDtoCriticalOperationalParameter";

export function CCriticalOperationalParameterAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("criticalOperationalParameters"),
        path: "/supporting-operations/critical-operational-parameter",
      },
      {
        label: t("add"),
      },
    ],
    [t],
  );

  const handleSubmit = useCallback(
    async (data: IDtoCriticalOperationalParameterRequest) => {
      const res = await Api.POST(
        "/u/support/critical-operational-parameter/item",
        {
          body: data,
        },
      );
      apiToast(res);

      if (!res.error) {
        navigate("/supporting-operations/critical-operational-parameter");
      }
    },
    [apiToast, navigate],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CCriticalOperationalParameterForm onSubmit={handleSubmit} />
    </CBody>
  );
}
