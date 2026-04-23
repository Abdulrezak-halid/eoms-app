import { UtilUnit } from "common";
import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeEnergyResource } from "@m/base/components/CBadgeEnergyResource";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonAddToReport } from "@m/base/components/CButtonAddToReport";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { WithId } from "@m/base/interfaces/DtoHelpers";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CBadge } from "@m/core/components/CBadge";
import { CButton } from "@m/core/components/CButton";
import { CDisplayNumber } from "@m/core/components/CDisplayNumber";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoTargetResponse } from "../interfaces/IDtoTarget";

export function CTargetList() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("targets") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/planning/target/item");
  }, []);
  const [data, load] = useLoader(fetcher);

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(
    async (record: WithId<IDtoTargetResponse>) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.year }),
        async () => {
          const res = await Api.DELETE("/u/planning/target/item/{id}", {
            params: { path: { id: record.id } },
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
      { label: t("year") },
      { label: t("percentage"), hideSm: true, right: true },
      { label: t("consumption"), hideSm: true, right: true },
      { label: t("energyResource") },
      { label: "", right: true },
    ],
    [t],
  );

  const consumptionUnitAbbr = useMemo(
    () => UtilUnit.getAbbreviation("ENERGY_MWH", t),
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="justify-end space-x-2 grow">
        <CButtonAddToReport sectionType="TARGETS" />
        <CLinkAdd path="/planning/target/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <>
            <CTable header={header}>
              {payload.records.map((d) => [
                d.year,
                <CBadge key="percentage" value={`${d.percentage}%`} />,
                <CDisplayNumber
                  key="consumption"
                  value={d.consumption}
                  unitStr={consumptionUnitAbbr}
                />,
                <CBadgeEnergyResource
                  key="energyResource"
                  value={d.energyResource}
                />,
                <CLine key="actions" className="justify-end space-x-2">
                  <CLink
                    icon={Pencil}
                    label={t("edit")}
                    path={`/planning/target/item/${d.id}`}
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
