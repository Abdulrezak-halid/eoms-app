import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDateAgo } from "@m/base/components/CDisplayDateAgo";
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
import { CBadgeIndexSuccess } from "@m/measurement/components/CBadgeIndexSuccess";

import { IDtoOperationRecord } from "../interfaces/IDtoPipeline";

export function COperationList() {
  const { t } = useTranslation();
  const { pipelineId = "" } = useParams();
  const apiToast = useApiToast();
  const { push } = useContext(ContextAreYouSure);

  const pipelineFetcher = useCallback(
    () =>
      Api.GET("/u/supply-chain/pipeline/item/{id}", {
        params: { path: { id: pipelineId } },
      }),
    [pipelineId],
  );
  const [pipelineData, reloadPipeline] = useLoader(pipelineFetcher);

  const operationsFetcher = useCallback(
    () =>
      Api.GET("/u/supply-chain/pipeline/operation/item", {
        params: { query: { pipelineId } },
      }),
    [pipelineId],
  );
  const [operationsData, reloadOperations] = useLoader(operationsFetcher);

  const refreshAll = useCallback(async () => {
    await reloadPipeline();
    await reloadOperations();
  }, [reloadPipeline, reloadOperations]);

  const handleDelete = useCallback(
    async (record: IDtoOperationRecord) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.name }),
        async () => {
          const res = await Api.DELETE(
            "/u/supply-chain/pipeline/operation/item/{id}",
            { params: { path: { id: record.id } } },
          );
          apiToast(res);
          if (!res.error) {
            await reloadOperations();
          }
        },
      );
    },
    [apiToast, reloadOperations, push, t],
  );

  const handleMove = useCallback(
    async ({ record, dir }: { record: IDtoOperationRecord; dir: 1 | -1 }) => {
      const records = operationsData.payload?.records;
      if (!records) {
        return;
      }

      const sorted = [...records].sort((a, b) => a.index - b.index);
      const idx = sorted.findIndex((r) => r.id === record.id);
      const neighbor = sorted[idx + dir];
      if (!neighbor) {
        return;
      }

      const [res1, res2] = await Promise.all([
        Api.PUT("/u/supply-chain/pipeline/operation/item/{id}", {
          params: { path: { id: record.id } },
          body: { name: record.name, pipelineId, index: neighbor.index },
        }),
        Api.PUT("/u/supply-chain/pipeline/operation/item/{id}", {
          params: { path: { id: neighbor.id } },
          body: { name: neighbor.name, pipelineId, index: record.index },
        }),
      ]);

      if (!res1.error && !res2.error) {
        await reloadOperations();
      } else {
        apiToast(res1.error ? res1 : res2);
      }
    },
    [operationsData.payload?.records, pipelineId, apiToast, reloadOperations],
  );

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      { label: t("pipelines"), path: "/supply-chain/pipeline" },
      { label: pipelineData.payload?.name, dynamic: true },
      { label: t("operations") },
    ],
    [t, pipelineData.payload?.name],
  );

  const pipelineHeader = useMemo<ITableHeaderColumn[]>(
    () => [{ label: t("name") }],
    [t],
  );

  const operationHeader = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: "", hideSm: true },
      { label: t("name") },
      { label: t("createdAt"), right: true, hideSm: true },
      { label: "", right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={pipelineData}>
        {(pipeline) => (
          <CTable header={pipelineHeader}>{[[pipeline.name]]}</CTable>
        )}
      </CAsyncLoader>

      <CHr className="my-4" />
      <CLine className="justify-end space-x-2 grow mb-4">
        <CLinkAdd
          path={`/supply-chain/pipeline/item/${pipelineId}/operation/item-add`}
        />
        <CButtonRefresh onClick={refreshAll} />
      </CLine>

      <CAsyncLoader data={operationsData} arrayField="records">
        {(payload) => {
          const sorted = [...payload.records].sort((a, b) => a.index - b.index);
          return (
            <CTable header={operationHeader}>
              {sorted.map((d, i) => [
                <CBadgeIndexSuccess key="index" index={i} />,
                d.name,
                <CDisplayDateAgo key="createdAt" value={d.createdAt} />,

                <CLine key="actions" className="justify-end space-x-2">
                  <CButton
                    icon={ArrowUp}
                    value={{ record: d, dir: -1 }}
                    onClick={handleMove}
                    disabled={i === 0}
                    tertiary
                    hideLabelLg
                  />
                  <CButton
                    icon={ArrowDown}
                    value={{ record: d, dir: 1 }}
                    onClick={handleMove}
                    disabled={i === sorted.length - 1}
                    tertiary
                    hideLabelLg
                  />
                  <CLink
                    icon={Pencil}
                    label={t("edit")}
                    path={`/supply-chain/pipeline/item/${pipelineId}/operation/item/${d.id}`}
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
          );
        }}
      </CAsyncLoader>
    </CBody>
  );
}
