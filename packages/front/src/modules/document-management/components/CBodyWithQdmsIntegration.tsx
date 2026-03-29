import { PropsWithChildren, ReactNode, useMemo, useState } from "react";

import { generateRequestGetPath } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CPdfViewer } from "@m/base/components/CPdfViewer";
import { IAsyncData } from "@m/core/components/CAsyncLoader";
import { CLine } from "@m/core/components/CLine";
import { CTab, ITabListItem } from "@m/core/components/CTab";
import { useTranslation } from "@m/core/hooks/useTranslation";

type ITabValue = "pdf" | "table";

export function CBodyWithQdmsIntegration({
  dataQdms,
  actions,
  breadcrumbs,
  children,
}: PropsWithChildren<{
  dataQdms: IAsyncData<{ qdmsIntegrationId?: string }>;
  breadcrumbs: IBreadCrumb[];
  actions?: ReactNode;
}>) {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<ITabValue>("pdf");

  const qdmsIntegrationId = dataQdms.payload?.qdmsIntegrationId;

  const pdfDownloadLink = useMemo(() => {
    if (!qdmsIntegrationId) {
      return "";
    }
    return generateRequestGetPath("/u/dms/qdms-integration/item/{id}/file", {
      path: { id: qdmsIntegrationId },
    });
  }, [qdmsIntegrationId]);

  const tabs = useMemo<ITabListItem<ITabValue>[]>(
    () => [
      {
        label: t("qdmsDocument"),
        value: "pdf",
      },
      {
        label: t("table"),
        value: "table",
      },
    ],
    [t],
  );

  if (!qdmsIntegrationId) {
    return (
      <CBody breadcrumbs={breadcrumbs}>
        <CLine className="grow justify-end">{actions}</CLine>
        {children}
      </CBody>
    );
  }

  return (
    <CBody breadcrumbs={breadcrumbs} noExtraPaddingBottom>
      <div className="h-full space-y-4 flex flex-col">
        <div className="flex items-end justify-between space-x-2">
          <CTab list={tabs} value={selectedTab} onChange={setSelectedTab} />
          {actions && <div className="flex-shrink-0">{actions}</div>}
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          {selectedTab === "pdf" ? (
            <CPdfViewer src={pdfDownloadLink} />
          ) : (
            children
          )}
        </div>
      </div>
    </CBody>
  );
}
