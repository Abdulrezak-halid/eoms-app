import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeEnergyResource } from "@m/base/components/CBadgeEnergyResource";
import { CBadgePeriod } from "@m/base/components/CBadgePeriod";
import { CBadgeSeu } from "@m/base/components/CBadgeSeu";
import { CBadgeUnit } from "@m/base/components/CBadgeUnit";
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

import { IDtoCriticalOperationalParameterResponse } from "../interfaces/IDtoCriticalOperationalParameter";

export function CCriticalOperationalParameterList() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("criticalOperationalParameters") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/support/critical-operational-parameter/item");
  }, []);
  const [data, load] = useLoader(fetcher);

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(
    async (record: IDtoCriticalOperationalParameterResponse) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.parameter }),
        async () => {
          const res = await Api.DELETE(
            "/u/support/critical-operational-parameter/item/{id}",
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
    [apiToast, load, push, t],
  );

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("parameter") },
      {
        label: t("significantEnergyUser") + " / " + t("energyResource"),
        hideSm: true,
      },
      { label: t("period") + " / " + t("unit"), hideMd: true },
      {
        label:
          t("normalSettingValue") +
          " / " +
          t("lowerLimit") +
          " / " +
          t("upperLimit"),
        hideLg: true,
      },
      {
        label: t("measurementTool") + " / " + t("accuracyCalibrationFrequency"),
        hideLg: true,
        noClampLine: true,
      },
      {
        label:
          t("valueResponsibleUser") + " / " + t("deviationResponsibleUser"),
        hideLg: true,
      },
      // {
      //   label: t("controlDate") + " / " + t("note"),
      //   hideLg: true,
      // },
      { label: "", right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow space-x-2 justify-end">
        <CLinkAdd path="/supporting-operations/critical-operational-parameter/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <CTable header={header}>
            {payload.records.map((d) => [
              d.parameter,

              <CGridBadge key="seu">
                <CBadgeSeu value={d.seu.name} />
                <CBadgeEnergyResource value={d.energyResource} />
              </CGridBadge>,

              <CGridBadge key="period">
                <CBadgePeriod value={d.period} />
                <CBadgeUnit value={d.unit} />
              </CGridBadge>,

              <div key="values">
                {d.normalSettingValue}
                <CHr className="mt-0.5 mb-1" />
                {d.lowerLimit}
                <CHr className="mt-0.5 mb-1" />
                {d.upperLimit}
              </div>,

              <div key="measurement">
                <div className="line-clamp-2 @sm:line-clamp-3">
                  {d.measurementTool}
                </div>
                <CHr className="mt-0.5 mb-1" />
                <CBadge value={d.accuracyCalibrationFrequency} />
              </div>,

              <CGridBadge key="users">
                <CBadgeUser value={d.valueResponsibleUser.displayName} />
                <CBadgeUser value={d.deviationResponsibleUser.displayName} />
              </CGridBadge>,

              // <div key="controlDateAndNote">
              //   <CDisplayDate key="controlDate" value={d.controlDate} />,
              //   <CHr className="mt-0.5 mb-1" />
              //   {d.note || "-"}
              // </div>,
              <CLine key="actions" className="justify-end space-x-2">
                <CLink
                  icon={Pencil}
                  path={`/supporting-operations/critical-operational-parameter/item/${d.id}`}
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
