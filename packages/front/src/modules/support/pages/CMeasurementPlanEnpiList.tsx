import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CBadge } from "@m/core/components/CBadge";
import { CButton } from "@m/core/components/CButton";
import { CHr } from "@m/core/components/CHr";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoMeasurementPlanEnpiResponse } from "../interfaces/IDtoMeasurementPlanEnpi";

export function CMeasurementPlanEnpiList() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("measurementPlansEnpi") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/support/enpi-measurement-plan/item");
  }, []);
  const [data, load] = useLoader(fetcher);

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(
    async (records: IDtoMeasurementPlanEnpiResponse) => {
      await push(
        t("msgRecordWillBeDeleted", {
          subject: records.enpi.displayName,
        }),
        async () => {
          const res = await Api.DELETE(
            "/u/support/enpi-measurement-plan/item/{id}",
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
      { label: t("enpi") },
      {
        label: t("energyInput") + " / " + t("energyVariables"),
        hideSm: true,
        noClampLine: true,
      },
      {
        label:
          t("idealMeasurementTools") + " / " + t("availableMeasurementTools"),
        hideMd: true,
        noClampLine: true,
      },
      {
        label: t("monitoringAbsenceGap") + " / " + t("measurementPlans"),
        hideLg: true,
        noClampLine: true,
      },
      {
        label:
          t("requiredRange") +
          " / " +
          t("engineeringUnit") +
          " / " +
          t("dataCollectionMethod") +
          " / " +
          t("dataCollectionPeriod"),
        hideLg: true,
        noClampLine: true,
      },
      { label: "", right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow space-x-2 justify-end">
        <CLinkAdd path="/supporting-operations/measurement-plan-enpi/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <CTable header={header}>
            {payload.records.map((d) => [
              <CBadge key={d.enpi.id} value={d.enpi.displayName} wrap />,

              <div key="energy">
                <div className="line-clamp-2 @sm:line-clamp-3">
                  {d.energyInput}
                </div>
                <CHr className="mt-0.5 mb-1" />
                <div className="line-clamp-2 @sm:line-clamp-3">
                  {d.energyVariables}
                </div>
              </div>,

              <div key="tools">
                <div className="line-clamp-2 @sm:line-clamp-3">
                  {d.idealMeasurementTools}
                </div>
                <CHr className="mt-0.5 mb-1" />
                <div className="line-clamp-2 @sm:line-clamp-3">
                  {d.availableMeasurementTools}
                </div>
              </div>,

              <div key="monitoring">
                <div className="line-clamp-2 @sm:line-clamp-3">
                  {d.monitoringAbsenceGap}
                </div>
                <CHr className="mt-0.5 mb-1" />
                <div className="line-clamp-2 @sm:line-clamp-3">
                  {d.measurementPlan}
                </div>
              </div>,

              <div key="collection">
                <div className="line-clamp-2 @sm:line-clamp-3">
                  {d.requiredRange}
                </div>
                <CHr className="mt-0.5 mb-1" />
                <div className="line-clamp-2 @sm:line-clamp-3">
                  {d.engineeringUnit}
                </div>
                <CHr className="mt-0.5 mb-1" />
                <div className="line-clamp-2 @sm:line-clamp-3">
                  {d.dataCollectionMethod}
                </div>
                <CHr className="mt-0.5 mb-1" />
                <div className="line-clamp-2 @sm:line-clamp-3">
                  {d.dataCollectionPeriod}
                </div>
              </div>,

              <CLine key="actions" className="justify-end space-x-2">
                <CLink
                  icon={Pencil}
                  label={t("edit")}
                  path={`/supporting-operations/measurement-plan-enpi/item/${d.id}`}
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
