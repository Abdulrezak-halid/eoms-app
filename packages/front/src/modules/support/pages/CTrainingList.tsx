import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeUser } from "@m/base/components/CBadgeUser";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDate } from "@m/base/components/CDisplayDatetime";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CButton } from "@m/core/components/CButton";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { CBodyWithQdmsIntegration } from "@m/document-management/components/CBodyWithQdmsIntegration";

import { useTrainingMap } from "../hooks/useTrainingCategory";
import { IDtoTrainingResponse } from "../interfaces/IDtoTraining";

export function CTrainingList() {
  const { t } = useTranslation();
  const trainingMap = useTrainingMap();
  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("trainings"),
      },
    ],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/support/training/item");
  }, []);

  const [data, load] = useLoader(fetcher);

  const handleDelete = useCallback(
    async (record: IDtoTrainingResponse) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.title }),
        async () => {
          const res = await Api.DELETE("/u/support/training/item/{id}", {
            params: { path: { id: record.id } },
          });
          apiToast(res);
          if (res.error === undefined) {
            await load();
          }
        },
      );
    },
    [push, apiToast, load, t],
  );

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("title") },
      { label: t("date"), hideSm: true },
      { label: t("category"), hideMd: true },
      { label: t("trainerUser"), hideMd: true },
      { label: "", right: true },
    ],
    [t],
  );

  const actions = useMemo(
    () => (
      <CLine className="space-x-2">
        <CLinkAdd path="/supporting-operations/training/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>
    ),
    [load],
  );

  const tableContent = (
    <CAsyncLoader data={data} arrayField="records">
      {(payload) => (
        <CTable header={header}>
          {payload?.records.map((d) => [
            d.title,
            <CDisplayDate key="date" value={d.date} />,
            trainingMap[d.category].label,
            <CBadgeUser key="trainerUser" value={d.trainerUser.displayName} />,
            <CLine key="actions" className="justify-end space-x-2">
              <CLink
                icon={Pencil}
                label={t("edit")}
                path={`/supporting-operations/training/item/${d.id}`}
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
      )}
    </CAsyncLoader>
  );

  return (
    <CBodyWithQdmsIntegration
      dataQdms={data}
      breadcrumbs={breadcrumbs}
      actions={actions}
    >
      {tableContent}
    </CBodyWithQdmsIntegration>
  );
}
