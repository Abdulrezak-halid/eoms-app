import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CEnergyPolicyForm } from "../components/CEnergyPolicyForm";
import { IDtoEnergyPolicyRequest } from "../interfaces/IDtoEnergyPolicy";

export function CEnergyPolicyAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoEnergyPolicyRequest) => {
      const res = await Api.POST("/u/commitment/energy-policy/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/commitment/energy-policies");
      }
    },
    [apiToast, navigate],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("energyPolicies"),
        path: "/commitment/energy-policies",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CEnergyPolicyForm onSubmit={handleSubmit} />
    </CBody>
  );
}
