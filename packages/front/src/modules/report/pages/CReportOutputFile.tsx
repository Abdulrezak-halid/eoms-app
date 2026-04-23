import { ArrowRight } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useParams } from "wouter";

import { Api, generateRequestGetPath } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CDisplayDateAgo } from "@m/base/components/CDisplayDateAgo";
import { CDisplayDate } from "@m/base/components/CDisplayDatetime";
import { CPdfViewer } from "@m/base/components/CPdfViewer";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CBadge } from "@m/core/components/CBadge";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CIcon } from "@m/core/components/CIcon";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { renderPlainOrTranslatableText } from "../utils/renderPlainOrTranslatableText";

export function CReportOutputFile() {
  const { t } = useTranslation();

  const { id: paramId } = useParams();
  const id = paramId || "";

  const fetcher = useCallback(async () => {
    const res = await Api.GET("/u/report/item/{id}", {
      params: { path: { id } },
    });
    return res;
  }, [id]);
  const [data] = useLoader(fetcher);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("report"),
        path: "/report/item",
      },
      {
        label: data.payload?.title
          ? renderPlainOrTranslatableText(t, data.payload.title)
          : undefined,
        dynamic: true,
      },
      { label: t("file") },
    ],
    [data.payload?.title, t],
  );

  const downloadLink = useMemo(() => {
    return generateRequestGetPath("/u/report/output-file/item/{id}", {
      path: { id },
    });
  }, [id]);

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("title") },
      { label: t("attachments"), hideLg: true },
      { label: t("range"), hideSm: true },
      { label: t("createdAt"), right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs} noExtraPaddingBottom>
      <div className="h-full space-y-4 flex flex-col">
        <CAsyncLoader data={data}>
          {(payload) => (
            <CTable header={header}>
              {[
                [
                  renderPlainOrTranslatableText(t, payload.title),
                  <CGridBadge key="attachments">
                    {payload.attachments.length > 0 ? (
                      payload.attachments.map((d) => (
                        <CBadge key={d.id} value={d.name} />
                      ))
                    ) : (
                      <span>-</span>
                    )}
                  </CGridBadge>,

                  <div key="range" className="flex items-center gap-1">
                    <CDisplayDate value={payload.dateStart} />
                    <CIcon value={ArrowRight} sm />
                    <CDisplayDate value={payload.dateEnd} />
                  </div>,

                  <CDisplayDateAgo key="createdAt" value={payload.createdAt} />,
                ],
              ]}
            </CTable>
          )}
        </CAsyncLoader>
        <CPdfViewer src={downloadLink} />
      </div>
    </CBody>
  );
}
