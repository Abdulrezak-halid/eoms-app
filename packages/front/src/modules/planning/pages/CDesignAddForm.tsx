import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CDesignForm } from "../components/CDesignForm";
import { IDtoDesignRequest } from "../interfaces/IDtoDesign";

export function CDesignAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoDesignRequest) => {
      const res = await Api.POST("/u/planning/design/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/planning/design");
      }
    },
    [apiToast, navigate],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("designs"),
        path: "/planning/design",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CDesignForm onSubmit={handleSubmit} />
    </CBody>
  );
}
