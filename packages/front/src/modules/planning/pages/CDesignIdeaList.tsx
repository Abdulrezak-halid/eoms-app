import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CButton } from "@m/core/components/CButton";
import { CHr } from "@m/core/components/CHr";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoDesignIdeaResponse } from "../interfaces/IDtoDesign";

export function CDesignIdeaList() {
  const { t } = useTranslation();
  const { designId = "" } = useParams();
  const apiToast = useApiToast();
  const { push } = useContext(ContextAreYouSure);

  const designFetcher = useCallback(
    () =>
      Api.GET("/u/planning/design/item/{id}", {
        params: { path: { id: designId } },
      }),
    [designId],
  );
  const [designData, reloadDesign] = useLoader(designFetcher);

  const ideasFetcher = useCallback(
    () =>
      Api.GET("/u/planning/design/item/{designId}/idea", {
        params: { path: { designId } },
      }),
    [designId],
  );
  const [ideasData, reloadIdeas] = useLoader(ideasFetcher);

  const refreshAll = useCallback(async () => {
    await reloadDesign();
    await reloadIdeas();
  }, [reloadDesign, reloadIdeas]);

  const handleDelete = useCallback(
    async (record: IDtoDesignIdeaResponse) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.name }),
        async () => {
          const res = await Api.DELETE(
            "/u/planning/design/item/{designId}/idea/{id}",
            { params: { path: { id: record.id, designId } } },
          );
          apiToast(res);
          if (!res.error) {
            await reloadIdeas();
          }
        },
      );
    },
    [apiToast, reloadIdeas, push, t, designId],
  );

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      { label: t("designs"), path: "/planning/design" },
      { label: designData.payload?.name, dynamic: true },
      { label: t("ideas") },
    ],
    [t, designData.payload?.name],
  );

  const designHeader = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("name") },
      { label: t("numberShort"), hideSm: true },
      { label: t("impact") },
      { label: t("estimatedSavings") },
    ],
    [t],
  );

  const ideaHeader = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("name") },
      { label: t("numberShort"), hideSm: true },
      { label: t("risks") },
      { label: t("reduction") },
      { label: "", right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={designData}>
        {(design) => (
          <CTable header={designHeader}>
            {[[design.name, design.no, design.impact, design.estimatedSavings]]}
          </CTable>
        )}
      </CAsyncLoader>

      <CHr className="my-4" />
      <CLine className="justify-end space-x-2 grow mb-4">
        <CLinkAdd path={`/planning/design/item/${designId}/idea/item-add`} />
        <CButtonRefresh onClick={refreshAll} />
      </CLine>

      <CAsyncLoader data={ideasData} arrayField="records">
        {(payload) => (
          <>
            <CTable header={ideaHeader}>
              {payload.records.map((d) => [
                d.name,
                d.no,
                <div key="risks">{d.risks}</div>,
                <div key="reduction">{d.reduction}</div>,
                <CLine key="actions" className="justify-end space-x-2">
                  <CLink
                    icon={Pencil}
                    label={t("edit")}
                    path={`/planning/design/item/${designId}/idea/item/${d.id}`}
                    hideLabelLg
                  />
                  <CButton
                    icon={Trash2}
                    label={t("_delete")}
                    value={d}
                    onClick={handleDelete}
                    hideLabelLg
                  />
                </CLine>,
              ])}
            </CTable>
          </>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
