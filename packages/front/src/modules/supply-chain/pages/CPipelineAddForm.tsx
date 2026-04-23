import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CPipelineForm } from "../components/CPipelineForm";
import { IDtoPipelineRequest } from "../interfaces/IDtoPipeline";

export function CPipelineAddForm() {
  const { t } = useTranslation();
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoPipelineRequest) => {
      const res = await Api.POST("/u/supply-chain/pipeline/item", {
        body: data,
      });
      apiToast(res);
      if (!res.error) {
        navigate("/supply-chain/pipeline");
      }
    },
    [apiToast, navigate],
  );

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      { label: t("pipelines"), path: "/supply-chain/pipeline" },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CPipelineForm onSubmit={handleSubmit} />
    </CBody>
  );
}
