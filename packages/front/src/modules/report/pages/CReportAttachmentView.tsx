import { useCallback, useMemo } from "react";
import { useParams } from "wouter";

import { Api, generateRequestGetPath } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CDisplayDateAgo } from "@m/base/components/CDisplayDateAgo";
import { CPdfViewer } from "@m/base/components/CPdfViewer";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CCard } from "@m/core/components/CCard";
import { CMutedText } from "@m/core/components/CMutedText";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CReportAttachmentView() {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();

  const fetcher = useCallback(
    () =>
      Api.GET("/u/report/attachment/item/{id}", {
        params: { path: { id } },
      }),
    [id],
  );

  const [data] = useLoader(fetcher);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      { label: t("report") },
      {
        label: t("attachments"),
        path: "/report/attachments",
      },
      {
        label: data.payload?.name,
        dynamic: true,
      },
    ],
    [data.payload?.name, t],
  );

  const fileUrl = useMemo(() => {
    return generateRequestGetPath("/u/report/attachment/file/{id}", {
      path: { id },
    });
  }, [id]);

  return (
    <CBody breadcrumbs={breadcrumbs} noExtraPaddingBottom>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CCard className="p-3 flex justify-between space-x-3">
            <div className="truncate">{payload.name}</div>
            <div className="space-x-2">
              <CMutedText value={t("createdAt")} />
              <CDisplayDateAgo value={payload.createdAt} />
            </div>
          </CCard>
        )}
      </CAsyncLoader>

      <div className="h-full space-y-4 flex flex-col">
        <CPdfViewer src={fileUrl} />
      </div>
    </CBody>
  );
}
