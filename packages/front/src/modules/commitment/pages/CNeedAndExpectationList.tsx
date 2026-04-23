import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeDepartment } from "@m/base/components/CBadgeDepertment";
import { CBadgeYesNo } from "@m/base/components/CBadgeYesNo";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDate } from "@m/base/components/CDisplayDatetime";
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

import { IDtoNeedAndExpectationResponse } from "../interfaces/IDtoNeedAndExpectation";

export function CNeedAndExpectationList() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("needsAndExpectations") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/commitment/need-and-expectation/item");
  }, []);

  const [data, load] = useLoader(fetcher);

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(
    async (record: IDtoNeedAndExpectationResponse) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.interestedParty }),
        async () => {
          const res = await Api.DELETE(
            "/u/commitment/need-and-expectation/item/{id}",
            {
              params: { path: { id: record.id } },
            },
          );
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
      { label: t("interestedParty") },
      {
        label: t("interestedPartyNeedsAndExpectations"),
        hideLg: true,
      },
      { label: t("evaluationMethod"), hideSm: true },
      { label: t("departments"), hideLg: true },
      { label: t("isIncludedInEnms"), hideSm: true },
      { label: t("revisionDate"), hideSm: true, right: true },
      { right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow space-x-2 justify-end">
        <CLinkAdd path="/commitment/needs-and-expectations/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <CTable header={header}>
            {payload.records.map((d) => [
              d.interestedParty,
              <div key="needsAndExpectations" className="whitespace-pre-line">
                {d.interestedPartyNeedsAndExpectations}
              </div>,
              d.evaluationMethod,

              <div
                key="departments"
                className="gap-2 flex flex-wrap max-w-[10rem]"
              >
                {d.departments.map((dep) => (
                  <CBadgeDepartment key={dep.id} value={dep.name} />
                ))}
              </div>,
              <CBadgeYesNo key="isIncluded" value={d.isIncludedInEnms} />,
              <CDisplayDate key="revisionDate" value={d.revisionDate} />,
              <CLine key="actions" className="justify-end space-x-2">
                <CLink
                  icon={Pencil}
                  label={t("edit")}
                  path={`/commitment/needs-and-expectations/item/${d.id}`}
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
        )}
      </CAsyncLoader>
    </CBody>
  );
}
