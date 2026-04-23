import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CTargetForm } from "../components/CTargetForm";
import { IDtoTargetRequest } from "../interfaces/IDtoTarget";

export function CTargetAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("targets"),
        path: "/planning/target",
      },
      {
        label: t("add"),
      },
    ],
    [t],
  );

  const handleSubmit = useCallback(
    async (data: IDtoTargetRequest) => {
      const res = await Api.POST("/u/planning/target/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/planning/target");
      }
    },
    [apiToast, navigate],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CTargetForm onSubmit={handleSubmit} />
    </CBody>
  );
}
