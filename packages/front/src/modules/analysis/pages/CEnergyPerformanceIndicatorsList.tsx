import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeSeu } from "@m/base/components/CBadgeSeu";
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

import { IDtoEnpiResponse } from "../interfaces/IDtoEnergyPerformanceIndicators";

export function CEnpitList() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("energyPerformanceIndicators") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/analysis/enpi/item");
  }, []);
  const [data, load] = useLoader(fetcher);

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(
    async (records: IDtoEnpiResponse) => {
      await push(
        t("msgRecordWillBeDeleted", {
          subject: records.equipment,
        }),
        async () => {
          const res = await Api.DELETE("/u/analysis/enpi/item/{id}", {
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
      { label: t("equipment") },
      { label: t("targetedImprovement"), hideSm: true, right: true },
      { label: t("targetedDate"), hideLg: true, right: true },
      { label: t("significantEnergyUser"), hideSm: true, right: true },
      { label: "", right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="justify-end space-x-2 grow">
        <CLinkAdd path="/analysis/enpi/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <>
            <CTable header={header}>
              {payload.records.map((d) => [
                d.equipment,
                d.targetedImprovement,
                <CDisplayDate key="targetedDate" value={d.targetedDate} />,
                <CBadgeSeu key="seu" value={d.seu.name} />,
                <CLine key="actions" className="justify-end space-x-2">
                  <CLink
                    icon={Pencil}
                    label={t("edit")}
                    path={`/analysis/enpi/item/${d.id}`}
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
