import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeUser } from "@m/base/components/CBadgeUser";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDate } from "@m/base/components/CDisplayDatetime";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { WithId } from "@m/base/interfaces/DtoHelpers";
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

import { IDtoNonconformityResponse } from "../interfaces/IDtoNonconformity";

export function CNonconformityList() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("nonconformities") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/internal-audit/nonconformity/item");
  }, []);
  const [data, load] = useLoader(fetcher);

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(
    async (records: WithId<IDtoNonconformityResponse>) => {
      await push(
        t("msgRecordWillBeDeleted", {
          subject: records.definition,
        }),
        async () => {
          const res = await Api.DELETE(
            "/u/internal-audit/nonconformity/item/{id}",
            {
              params: { path: { id: records.id } },
            },
          );
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
      { label: t("definition") },
      {
        label: t("numberShort") + " / " + t("action"),
        hideSm: true,
      },
      {
        label: t("requirement") + " / " + t("source"),
        hideMd: true,
        noClampLine: true,
      },
      {
        label: t("potentialResult") + " / " + t("rootCause"),
        hideLg: true,
        noClampLine: true,
      },
      {
        label:
          t("identifiedAt") +
          " / " +
          t("targetIdentificationDate") +
          " / " +
          t("actualIdentificationDate"),
        hideLg: true,
        noClampLine: true,
      },
      {
        label: t("responsibleUser") + " / " + t("reviewerUser"),
        hideLg: true,
      },
      { label: t("statusOfCorrectiveAction"), hideLg: true, right: true },
      { label: "", right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow space-x-2 justify-end">
        <CLinkAdd path="/internal-audit/nonconformity/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>
      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <CTable header={header}>
            {payload.records.map((d) => [
              d.definition,

              <>
                <CBadge value={d.no} /> {d.action}
              </>,

              <div key="analysis">
                <div className="line-clamp-2 @sm:line-clamp-3">
                  {d.requirement}
                </div>
                <CHr className="mt-0.5 mb-1" />
                <div className="line-clamp-2 @sm:line-clamp-3">{d.source}</div>
              </div>,

              <div key="impact">
                <div className="line-clamp-2 @sm:line-clamp-3">
                  {d.potentialResult}
                </div>
                <CHr className="mt-0.5 mb-1" />
                <div className="line-clamp-2 @sm:line-clamp-3">
                  {d.rootCause}
                </div>
              </div>,

              <CGridBadge key="actionPlan">
                <CDisplayDate value={d.identifiedAt} />
                <CDisplayDate value={d.targetIdentificationDate} />
                <CDisplayDate value={d.actualIdentificationDate} />
              </CGridBadge>,

              <CGridBadge key="people">
                <CBadgeUser value={d.responsibleUser.displayName} />
                <CBadgeUser value={d.reviewerUser.displayName} />
              </CGridBadge>,

              <CBadge
                key={"status"}
                value={d.isCorrectiveActionOpen ? t("open") : t("close")}
              />,

              <CLine key="actions" className="justify-end space-x-2">
                <CLink
                  icon={Pencil}
                  path={`/internal-audit/nonconformity/item/${d.id}`}
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
        )}
      </CAsyncLoader>
    </CBody>
  );
}
