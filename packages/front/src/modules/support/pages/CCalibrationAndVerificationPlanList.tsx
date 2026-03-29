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
import { CButton } from "@m/core/components/CButton";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CHr } from "@m/core/components/CHr";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IDtoCalibrationPlanResponse } from "@m/support/interfaces/IDtoCalibrationPlan";

export function CCalibrationAndVerificationPlanList() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("calibrationAndVerificationPlans"),
      },
    ],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/support/calibration-plan/item");
  }, []);

  const [data, load] = useLoader(fetcher);

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(
    async (record: WithId<IDtoCalibrationPlanResponse>) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.deviceType }),
        async () => {
          const res = await Api.DELETE(
            "/u/support/calibration-plan/item/{id}",
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
      { label: t("deviceType") },
      {
        label: t("deviceNo") + " / " + t("brand") + " / " + t("location"),
        hideSm: true,
        noClampLine: true,
      },
      {
        label:
          t("calibration") +
          " / " +
          t("calibrationNo") +
          " / " +
          t("evaluationResult"),
        hideMd: true,
        noClampLine: true,
      },
      { label: t("dueTo") + " / " + t("nextDate"), hideLg: true },
      { label: t("responsibleUser"), hideLg: true },
      { label: "", right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow space-x-2 justify-end">
        <CLinkAdd path="/supporting-operations/calibration-verification-plan/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <CTable header={header}>
            {payload.records.map((d) => [
              d.deviceType,

              <div key="device">
                <div className="line-clamp-2 @sm:line-clamp-3">
                  {d.deviceNo}
                </div>
                <CHr className="mt-0.5 mb-1" />
                <div className="line-clamp-2 @sm:line-clamp-3">{d.brand}</div>
                <CHr className="mt-0.5 mb-1" />
                <div className="line-clamp-2 @sm:line-clamp-3">
                  {d.location}
                </div>
              </div>,

              <div key="calibration">
                <div className="line-clamp-2 @sm:line-clamp-3">
                  {d.calibration}
                </div>
                <CHr className="mt-0.5 mb-1" />
                <div className="line-clamp-2 @sm:line-clamp-3">
                  {d.calibrationNo}
                </div>
                <CHr className="mt-0.5 mb-1" />
                <div className="line-clamp-2 @sm:line-clamp-3">
                  {d.evaluationResult}
                </div>
              </div>,

              <CGridBadge key="dates">
                <CDisplayDate value={d.dueTo} />
                <CDisplayDate value={d.nextDate} />
              </CGridBadge>,

              <CBadgeUser
                key="responsibleUser"
                value={d.responsibleUser.displayName}
              />,

              <CLine key="actions" className="justify-end space-x-2">
                <CLink
                  icon={Pencil}
                  label={t("edit")}
                  path={`/supporting-operations/calibration-verification-plan/item/${d.id}`}
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
