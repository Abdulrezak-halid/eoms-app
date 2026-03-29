import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeUser } from "@m/base/components/CBadgeUser";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CBadge } from "@m/core/components/CBadge";
import { CButton } from "@m/core/components/CButton";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CHr } from "@m/core/components/CHr";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoWorkflowResponse } from "../interfaces/IDtoWorkflow";

export function CWorkflowList() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("workflows") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/internal-audit/workflow/item");
  }, []);
  const [data, load] = useLoader(fetcher);

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(
    async (records: IDtoWorkflowResponse) => {
      await push(
        t("msgRecordWillBeDeleted", {
          subject: records.part,
        }),
        async () => {
          const res = await Api.DELETE("/u/internal-audit/workflow/item/{id}", {
            params: { path: { id: records.id } },
          });
          apiToast(res);
          if (res.error === undefined) {
            await load();
          }
        },
      );
    },
    [apiToast, load, push, t],
  );

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("part") },
      {
        label: t("highLevelSubject") + " / " + t("subject"),
        hideSm: true,
        noClampLine: true,
      },
      {
        label:
          t("necessaries") +
          " / " +
          t("necessaryProof") +
          " / " +
          t("obtainedProof"),
        hideLg: true,
        noClampLine: true,
      },
      {
        label: t("correctiveActionDecisions") + " / " + t("comments"),
        hideLg: true,
        noClampLine: true,
      },
      { label: t("questions"), hideMd: true },
      { label: t("reviewerUser"), hideLg: true },
      { label: t("nonconformities"), hideLg: true },
      { label: "", right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="justify-end space-x-2 grow">
        <CLinkAdd path="/internal-audit/workflow/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <>
            <CTable header={header}>
              {payload.records.map((d) => [
                d.part,
                <div key="subjects">
                  <div className="line-clamp-2 @sm:line-clamp-3">
                    {d.highLevelSubject}
                  </div>
                  <CHr className="mt-0.5 mb-1" />
                  <div className="line-clamp-2 @sm:line-clamp-3">
                    {d.subject}
                  </div>
                </div>,

                <div key="proofs">
                  <div className="line-clamp-2 @sm:line-clamp-3">
                    {d.necessaries}
                  </div>
                  <CHr className="mt-0.5 mb-1" />
                  <div className="line-clamp-2 @sm:line-clamp-3">
                    {d.necessaryProof}
                  </div>
                  <CHr className="mt-0.5 mb-1" />
                  <div className="line-clamp-2 @sm:line-clamp-3">
                    {d.obtainedProof}
                  </div>
                </div>,

                <div key="decisions">
                  <div className="line-clamp-2 @sm:line-clamp-3 whitespace-pre-line">
                    {d.correctiveActionDecisions}
                  </div>
                  <CHr className="mt-0.5 mb-1" />
                  <div className="line-clamp-2 @sm:line-clamp-3 whitespace-pre-line">
                    {d.comments}
                  </div>
                </div>,

                d.questions,

                <CBadgeUser
                  key="reviewerUser"
                  value={d.reviewerUser.displayName}
                />,

                <CGridBadge key="nonconformities">
                  {d.nonconformities.map((nonconformity) => (
                    <CBadge
                      key={nonconformity.id}
                      value={nonconformity.displayName}
                      wrap
                    />
                  ))}
                </CGridBadge>,

                <CLine key="actions" className="justify-end space-x-2">
                  <CLink
                    icon={Pencil}
                    path={`/internal-audit/workflow/item/${d.id}`}
                    hideLabelLg
                  />
                  <CButton
                    icon={Trash2}
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
