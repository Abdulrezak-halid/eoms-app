import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeYesNo } from "@m/base/components/CBadgeYesNo";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CBadge } from "@m/core/components/CBadge";
import { CButton } from "@m/core/components/CButton";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoRiskGapAnalysesResponse } from "../interfaces/IDtoRiskGapAnalyses";

export function CRisksGapAnalysesList() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("gapAnalyses"),
      },
    ],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/planning/risk-gap-analysis/item");
  }, []);

  const [data, load] = useLoader(fetcher);

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(
    async (records: IDtoRiskGapAnalysesResponse) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: records.question }),
        async () => {
          const res = await Api.DELETE(
            "/u/planning/risk-gap-analysis/item/{id}",
            {
              params: { path: { id: records.id } },
            },
          );
          apiToast(res);
          if (res?.error === undefined) {
            await load();
          }
        },
      );
    },
    [push, apiToast, load, t],
  );

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("question") },
      { label: t("score") + " / " + t("headings"), hideSm: true },
      { label: t("evidence"), hideLg: true },
      { label: t("consideration"), hideLg: true },
      { label: t("isActionRequired"), hideSm: true, right: true },
      { label: "", right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow space-x-2 justify-end">
        <CLinkAdd path="/planning/risks/gap-analyses/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <>
            <CTable header={header}>
              {payload.records.map((d) => [
                d.question,
                <CGridBadge key="scoreHeadings">
                  <CBadge key="scoreHeadings" value={d.score} />
                  {d.headings}
                </CGridBadge>,
                <div key="evidence" className="whitespace-pre-line">
                  {d.evidence}
                </div>,
                <div key="consideration" className="whitespace-pre-line">
                  {d.consideration}
                </div>,
                <CBadgeYesNo
                  key="isActionRequired"
                  value={d.isActionRequired}
                />,
                <CLine key="actions" className="justify-end space-x-2">
                  <CLink
                    icon={Pencil}
                    label={t("edit")}
                    path={`/planning/risks/gap-analyses/item/${d.id}`}
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
