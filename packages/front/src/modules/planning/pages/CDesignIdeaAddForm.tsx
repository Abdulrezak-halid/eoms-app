import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useLoader } from "@m/core/hooks/useLoader";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CDesignIdeaForm } from "../components/CDesignIdeaForm";
import { IDtoDesignIdeaRequest } from "../interfaces/IDtoDesign";

export function CDesignIdeaAddForm() {
  const { t } = useTranslation();
  const { designId = "" } = useParams();
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const fetchDesign = useCallback(
    () =>
      Api.GET("/u/planning/design/item/{id}", {
        params: { path: { id: designId } },
      }),
    [designId],
  );
  const [designData] = useLoader(fetchDesign);

  const handleSubmit = useCallback(
    async (data: IDtoDesignIdeaRequest) => {
      const res = await Api.POST("/u/planning/design/item/{designId}/idea", {
        body: data,
        params: { path: { designId } },
      });
      apiToast(res);
      if (!res.error) {
        navigate(`/planning/design/item/${designId}/idea`);
      }
    },
    [apiToast, navigate, designId],
  );

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      { label: t("designs"), path: "/planning/design" },
      { label: designData.payload?.name, dynamic: true },
      { label: t("ideas"), path: `/planning/design/item/${designId}/idea` },
      { label: t("add") },
    ],
    [t, designData.payload?.name, designId],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CDesignIdeaForm onSubmit={handleSubmit} />
    </CBody>
  );
}
