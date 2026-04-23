import { FileScan, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDateAgo } from "@m/base/components/CDisplayDateAgo";
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

export function CReportAttachmentList() {
  const { t } = useTranslation();
  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("attachments") }],
    [t],
  );

  const fetcher = useCallback(() => Api.GET("/u/report/attachment/item"), []);
  const [data, load] = useLoader(fetcher);

  const handleDelete = useCallback(
    async (file: { id: string; lastModified?: string }) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: file.id }),
        async () => {
          const res = await Api.DELETE("/u/report/attachment/item/{id}", {
            params: { path: { id: file.id } },
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
      { label: t("name") },
      { label: t("createdAt"), right: true, hideSm: true },
      { label: "", right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow space-x-2 justify-end">
        <CLinkAdd path="/report/attachments/upload" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <CTable header={header}>
            {payload.records.map((file) => [
              file.name,
              <CDisplayDateAgo key="createdAt" value={file.createdAt} />,
              <CLine key="actions" className="justify-end space-x-2">
                <CLink
                  icon={FileScan}
                  label={t("seeFile")}
                  path={`/report/attachments/item/${file.id}`}
                  hideLabelLg
                />
                <CButton
                  icon={Trash2}
                  label={t("_delete")}
                  value={file}
                  onClick={handleDelete}
                  hideLabelLg
                />
              </CLine>,
            ])}
          </CTable>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
