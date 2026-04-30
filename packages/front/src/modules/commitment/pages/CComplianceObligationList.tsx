import { Newspaper, Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgePeriod } from "@m/base/components/CBadgePeriod";
import { CBadgeYesNo } from "@m/base/components/CBadgeYesNo";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDate } from "@m/base/components/CDisplayDatetime";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CDropdown, IDropdownListCallback } from "@m/core/components/CDropdown";
import { CLine } from "@m/core/components/CLine";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoComplianceObligationResponse } from "../interfaces/IDtoComplianceObligation";

export function CComplianceObligationList() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("complianceObligation"),
      },
    ],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/commitment/compliance-obligation/item");
  }, []);

  const [data, load] = useLoader(fetcher);
  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(
    async (record: IDtoComplianceObligationResponse) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.complianceObligation }),
        async () => {
          const res = await Api.DELETE(
            "/u/commitment/compliance-obligation/item/{id}",
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

  const actions = useCallback<
    IDropdownListCallback<IDtoComplianceObligationResponse>
  >(
    (d) => [
      {
        icon: Newspaper,
        label: t("eomscles"),
        path: `/commitment/compliance-obligation/item/${d.id}/eomscle`,
      },
      {
        icon: Pencil,
        label: t("edit"),
        path: `/commitment/compliance-obligation/item/${d.id}`,
      },
      {
        icon: Trash2,
        label: t("_delete"),
        onClick: handleDelete,
      },
    ],
    [t, handleDelete],
  );

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("complianceObligation") },
      { label: t("revisionNo"), hideSm: true },
      { label: t("reviewPeriod"), hideMd: true },
      {
        label:
          t("reviewDate") +
          " / " +
          t("officialNewspaperPublicationDate") +
          " / " +
          t("revisionDate"),
        hideLg: true,
        right: true,
      },
      { label: t("isLegalActive"), hideSm: true },
      { label: t("eomscleCount"), hideSm: true },
      { label: "" },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow space-x-2 justify-end">
        <CLinkAdd path="/commitment/compliance-obligation/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <>
            <CTable noOverflow header={header}>
              {payload.records.map((d) => [
                d.complianceObligation,
                d.revisionNo,

                <CBadgePeriod key="reviewPeriod" value={d.reviewPeriod} />,
                <div key="dates" className="flex flex-col gap-1">
                  <CDisplayDate value={d.reviewDate} />
                  <CDisplayDate value={d.officialNewspaperPublicationDate} />
                  <CDisplayDate value={d.revisionDate} />
                </div>,

                <CBadgeYesNo key="isLegalActive" value={d.isLegalActive} />,
                d.eomscleCount,

                <div key="actions" className="flex justify-end">
                  <CDropdown
                    list={actions}
                    value={d}
                    label={t("actions")}
                    hideLabelLg
                  />
                </div>,
              ])}
            </CTable>
          </>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
