import { useCallback, useMemo } from "react";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDate } from "@m/base/components/CDisplayDatetime";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CHr } from "@m/core/components/CHr";
import { CLine } from "@m/core/components/CLine";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CInternalExternalConsiderationHistoryList() {
  const { t } = useTranslation();
  const { id: paramId } = useParams();
  const id = paramId || "";

  const itemFetcher = useCallback(
    () =>
      Api.GET("/u/commitment/internal-external-consideration/item/{id}", {
        params: { path: { id } },
      }),
    [id],
  );
  const [itemData, reloadItem] = useLoader(itemFetcher);

  const historyFetcher = useCallback(
    () =>
      Api.GET(
        "/u/commitment/internal-external-consideration/item/{id}/history",
        { params: { path: { id } } },
      ),
    [id],
  );
  const [historyData, reloadHistory] = useLoader(historyFetcher);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("internalExternalConsiderations"),
        path: "/commitment/internal-external-considerations",
      },
      { label: itemData.payload?.specific, dynamic: true },
      { label: t("history") },
    ],
    [itemData.payload?.specific, t],
  );

  const refreshAll = useCallback(async () => {
    await reloadItem();
    await reloadHistory();
  }, [reloadItem, reloadHistory]);

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("specific") },
      { label: t("evaluationMethod"), hideSm: true },
      { label: t("impactPoint"), hideMd: true },
      { label: t("revisionDate"), right: true, hideLg: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow justify-end mb-4">
        <CButtonRefresh onClick={refreshAll} />
      </CLine>
      <CAsyncLoader data={itemData}>
        {(item) => (
          <>
            <CTable header={header}>
              {[
                [
                  item.specific,
                  item.evaluationMethod,
                  item.impactPoint,
                  <CDisplayDate key="revisionDate" value={item.revisionDate} />,
                ],
              ]}
            </CTable>
            <div className="mt-4 mb-4">
              <CHr />
            </div>
            <CAsyncLoader data={historyData} arrayField="records">
              {(history) => (
                <CTable header={header}>
                  {history.records.map((d) => [
                    d.specific,
                    d.evaluationMethod,
                    d.impactPoint,
                    <CDisplayDate key="revisionDate" value={d.revisionDate} />,
                  ])}
                </CTable>
              )}
            </CAsyncLoader>
          </>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
