import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { useLoader } from "@m/core/hooks/useLoader";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CDesignIdeaForm } from "../components/CDesignIdeaForm";
import { IDtoDesignIdeaRequest } from "../interfaces/IDtoDesign";

export function CDesignIdeaEditForm() {
  const { t } = useTranslation();
  const { designId = "", id: ideaId = "" } = useParams();
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

  const fetchIdea = useCallback(
    () =>
      Api.GET("/u/planning/design/item/{designId}/idea/{id}", {
        params: { path: { designId, id: ideaId } },
      }),
    [designId, ideaId],
  );
  const [ideaData] = useLoader(fetchIdea);

  const handleSubmit = useCallback(
    async (body: IDtoDesignIdeaRequest) => {
      const res = await Api.PUT(
        "/u/planning/design/item/{designId}/idea/{id}",
        {
          params: { path: { designId, id: ideaId } },
          body,
        },
      );
      apiToast(res);
      if (!res.error) {
        navigate(`/planning/design/item/${designId}/idea`);
      }
    },
    [apiToast, navigate, designId, ideaId],
  );

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      { label: t("designs"), path: "/planning/design" },
      { label: designData.payload?.name, dynamic: true },
      { label: t("ideas"), path: `/planning/design/item/${designId}/idea` },
      { label: ideaData?.payload?.name || "", dynamic: true },
      { label: t("edit") },
    ],
    [t, designData.payload?.name, designId, ideaData?.payload?.name],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={ideaData}>
        {(payload) => (
          <CDesignIdeaForm initialData={payload} onSubmit={handleSubmit} />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
