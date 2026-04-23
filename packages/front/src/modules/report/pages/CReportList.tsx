/**
 * @file: CReportList.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.01.2026
 * Last Modified Date: 06.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IDtoWsServerMessage } from "common/build-api-schema";
import { ArrowRight, Copy, FileScan, Mail, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo, useState } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDateAgo } from "@m/base/components/CDisplayDateAgo";
import { CDisplayDate } from "@m/base/components/CDisplayDatetime";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useWsServerMessage } from "@m/base/hooks/useWsServerMessage";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CBadge } from "@m/core/components/CBadge";
import { CDropdown, IDropdownListCallback } from "@m/core/components/CDropdown";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CIcon } from "@m/core/components/CIcon";
import { CLine } from "@m/core/components/CLine";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CBadgeMessageQueueTaskStatus } from "../components/CBadgeMessageQueueTaskStatus";
import { CReportSendMailForm } from "../components/CReportSendMailModal";
import { IDtoReportListItem } from "../interfaces/IDtoReport";
import { renderPlainOrTranslatableText } from "../utils/renderPlainOrTranslatableText";

export function CReportList() {
  const { t } = useTranslation();
  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const [sendMailReport, setSendMailReport] =
    useState<IDtoReportListItem | null>(null);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("reports") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/report/item");
  }, []);

  const [data, load] = useLoader(fetcher);

  const handleDelete = useCallback(
    async (record: IDtoReportListItem) => {
      await push(
        t("msgRecordWillBeDeleted", {
          subject: renderPlainOrTranslatableText(t, record.title),
        }),
        async () => {
          const res = await Api.DELETE("/u/report/item/{id}", {
            params: { path: { id: record.id } },
          });
          apiToast(res);
          if (!res.error) {
            await load();
          }
        },
      );
    },
    [push, apiToast, load, t],
  );

  const handleSendMail = useCallback((record: IDtoReportListItem) => {
    setSendMailReport(record);
  }, []);

  const handleCloseSendMail = useCallback(() => {
    setSendMailReport(null);
  }, []);

  const actions = useCallback<IDropdownListCallback<IDtoReportListItem>>(
    (d) => [
      {
        icon: FileScan,
        label: t("seeFile"),
        path: `/report/output-file/item/${d.id}`,
        disabled: d.status !== "SUCCESS",
      },
      {
        icon: Copy,
        label: t("clone"),
        path: `/report/item-clone/${d.id}`,
      },
      {
        icon: Mail,
        label: t("sendAsEmail"),
        onClick: handleSendMail,
        disabled: d.status !== "SUCCESS",
      },
      {
        icon: Trash2,
        label: t("_delete"),
        onClick: handleDelete,
      },
    ],
    [handleDelete, handleSendMail, t],
  );

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("title") },
      { label: t("status"), hideSm: true },
      { label: t("attachments"), hideLg: true },
      { label: t("range"), hideLg: true },
      { label: t("createdAt"), hideMd: true, right: true },
      { label: "", right: true },
    ],
    [t],
  );

  const wsListener = useCallback(
    (msg: IDtoWsServerMessage) => {
      if (
        msg.type === "NOTIFICATION" &&
        msg.content.type === "REPORT_RENDER_COMPLETED"
      ) {
        void load();
      }
    },
    [load],
  );

  useWsServerMessage(wsListener);

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow space-x-2 justify-end">
        <CLinkAdd path="/report/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <CTable noOverflow header={header}>
            {payload.records.map((d) => [
              <div key="title" className="truncate max-w-48 min-w-0">
                {renderPlainOrTranslatableText(t, d.title)}
              </div>,
              <CBadgeMessageQueueTaskStatus key="status" value={d.status} />,

              <CGridBadge key="attachments">
                {d.attachments.length > 0 ? (
                  d.attachments.map((a) => <CBadge key={a.id} value={a.name} />)
                ) : (
                  <span>-</span>
                )}
              </CGridBadge>,

              <div key="range" className="flex items-center gap-1">
                <CDisplayDate value={d.dateStart} />
                <CIcon value={ArrowRight} sm />
                <CDisplayDate value={d.dateEnd} />
              </div>,

              <CDisplayDateAgo key="createdAt" value={d.createdAt} />,

              <div key="actions" className="flex overflow-visible justify-end">
                <CDropdown
                  list={actions}
                  value={d}
                  label={t("actions")}
                  hideLabelLg
                />
              </div>,
            ])}
          </CTable>
        )}
      </CAsyncLoader>

      {sendMailReport && (
        <CReportSendMailForm
          reportId={sendMailReport.id}
          reportTitle={renderPlainOrTranslatableText(t, sendMailReport.title)}
          onClose={handleCloseSendMail}
          onSuccess={handleCloseSendMail}
        />
      )}
    </CBody>
  );
}
