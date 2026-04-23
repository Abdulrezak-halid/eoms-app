import { useCallback, useMemo } from "react";
import { useParams } from "wouter";

import { Api, generateRequestGetPath } from "@m/base/api/Api";
import { CBadgeEnabled } from "@m/base/components/CBadgeEnabled";
import { CBadgeUrl } from "@m/base/components/CBadgeUrl";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CDisplayDateAgo } from "@m/base/components/CDisplayDateAgo";
import { CPdfViewer } from "@m/base/components/CPdfViewer";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CBadgeQdmsIntegrationBindingPage } from "../components/CBadgeQdmsIntegrationBindingPage";

export function CQdmsIntegrationFile() {
  const { t } = useTranslation();

  const { id: paramId } = useParams();
  const id = paramId || "";

  const fetcher = useCallback(async () => {
    const res = await Api.GET("/u/dms/qdms-integration/item/{id}", {
      params: { path: { id } },
    });
    return res;
  }, [id]);
  const [data] = useLoader(fetcher);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("qdmsShort"),
        path: "/dms/qdms-integration",
      },
      {
        label: data.payload?.name,
        dynamic: true,
      },
      { label: t("file") },
    ],
    [data.payload?.name, t],
  );

  const downloadLink = useMemo(() => {
    return generateRequestGetPath("/u/dms/qdms-integration/item/{id}/file", {
      path: { id },
    });
  }, [id]);

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("name") },
      { label: t("bindingPage") + " / " + t("endpointUrl"), hideLg: true },
      { label: t("lastFetchedAt"), right: true, hideSm: true },
      { label: t("status"), right: true },
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
                  payload.name,
                  <CGridBadge key="integration">
                    <CBadgeQdmsIntegrationBindingPage
                      value={payload.bindingPage}
                    />
                    <CBadgeUrl value={payload.endpointUrl} />
                  </CGridBadge>,
                  <CDisplayDateAgo
                    key="lastFetchedAt"
                    value={payload.lastFetchedAt}
                  />,
                  <CBadgeEnabled key="status" value={payload.isEnabled} />,
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
