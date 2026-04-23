import { History, Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeDepartment } from "@m/base/components/CBadgeDepertment";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDate } from "@m/base/components/CDisplayDatetime";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CDropdown, IDropdownListCallback } from "@m/core/components/CDropdown";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CLine } from "@m/core/components/CLine";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoInternalExternalConsiderationItemResponse } from "../interfaces/IDtoInternalExternalConsideration";

export function CInternalExternalConsiderationList() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("internalExternalConsiderations"),
      },
    ],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/commitment/internal-external-consideration/item");
  }, []);

  const [data, load] = useLoader(fetcher);

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(
    async (record?: IDtoInternalExternalConsiderationItemResponse) => {
      if (!record) {
        return;
      }
      await push(
        t("msgRecordWillBeDeleted", { subject: record.specific }),
        async () => {
          const res = await Api.DELETE(
            "/u/commitment/internal-external-consideration/item/{id}",
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
    IDropdownListCallback<IDtoInternalExternalConsiderationItemResponse>
  >(
    (d) => [
      {
        icon: History,
        label: t("history"),
        path: `/commitment/internal-external-considerations/item/${d.id}/history`,
      },
      {
        icon: Pencil,
        label: t("edit"),
        path: `/commitment/internal-external-considerations/item/${d.id}`,
      },
      {
        icon: Trash2,
        label: t("_delete"),
        onClick: handleDelete,
      },
    ],
    [handleDelete, t],
  );

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("specific") },
      { label: t("evaluationMethod"), hideSm: true },
      { label: t("impactPoint"), hideLg: true },
      { label: t("departments"), hideLg: true },
      { label: t("revisionDate"), hideSm: true, right: true },
      { label: "", right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow space-x-2 justify-end">
        <CLinkAdd path="/commitment/internal-external-considerations/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <>
            <CTable noOverflow header={header}>
              {payload.records.map((d) => [
                d.specific,
                d.evaluationMethod,
                d.impactPoint,
                <CGridBadge key="departments">
                  {d.departments.map((department) => (
                    <CBadgeDepartment
                      key={department.id}
                      value={department.name}
                    />
                  ))}
                </CGridBadge>,
                <CDisplayDate key="revisionDate" value={d.revisionDate} />,
                <div
                  key="actions"
                  className="flex overflow-visible justify-end"
                >
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
