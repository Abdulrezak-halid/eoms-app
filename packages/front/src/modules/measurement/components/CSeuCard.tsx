import { ChartLine, CircleGauge, Pencil, Trash2 } from "lucide-react";
import { ReactElement, useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeDepartment } from "@m/base/components/CBadgeDepertment";
import { CDisplayEnergyValue } from "@m/base/components/CDisplayEnergyValue";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useUnitInfo } from "@m/base/hooks/useUnitMultiplierAndAbbr";
import { CBadgePercentage } from "@m/core/components/CBadgePercentage";
import { CButtonPopup } from "@m/core/components/CButtonPopup";
import { CCard } from "@m/core/components/CCard";
import { CDropdown, IDropdownListCallback } from "@m/core/components/CDropdown";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CLine } from "@m/core/components/CLine";
import { CMutedText } from "@m/core/components/CMutedText";
import { CPopupPanel } from "@m/core/components/CPopupPanel";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { usePopupState } from "@m/core/hooks/usePopupState";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoSeuResponse } from "../interfaces/IDtoSeu";
import { CBadgeMeterSlice } from "./CBadgeMeterSlice";

export function CSeuCardBody({ data }: { data: IDtoSeuResponse }) {
  const { t } = useTranslation();

  const { multiplier } = useUnitInfo("ENERGY");
  const popupState = usePopupState();

  const hasDepartmentsOrMeters = useMemo(
    () => data.departments.length > 0 || data.meterSlices.length > 0,
    [data.departments.length, data.meterSlices.length],
  );

  const popupComponent = useCallback(
    (): ReactElement => (
      <CPopupPanel className="p-3 space-y-3 overflow-y-auto">
        {data.departments.length > 0 && (
          <div>
            <CMutedText>{t("departments")}</CMutedText>
            <CGridBadge>
              {data.departments.map((dept) => (
                <CBadgeDepartment key={dept.id} value={dept.name} />
              ))}
            </CGridBadge>
          </div>
        )}

        {data.meterSlices.length > 0 ? (
          <div>
            <CMutedText>{t("meters")}</CMutedText>
            <CGridBadge>
              {data.meterSlices.map((slice) => (
                <CBadgeMeterSlice key={slice.id} value={slice.name} />
              ))}
            </CGridBadge>
          </div>
        ) : (
          <CMutedText className="italic">{t("noMeters")}</CMutedText>
        )}
      </CPopupPanel>
    ),
    [data.departments, data.meterSlices, t],
  );

  return (
    <div className="flex justify-between flex-col @sm:flex-row grow gap-x-4 gap-y-2 min-w-0">
      <div className="flex items-center gap-2 min-w-0 grow justify-between">
        <div className="font-bold truncate" title={data.name}>
          {data.name}
        </div>

        {hasDepartmentsOrMeters && (
          <CButtonPopup
            icon={CircleGauge}
            label={t("meters")}
            popupState={popupState}
            popupComponent={popupComponent}
            tertiary
            hideLabelMd
          />
        )}
      </div>

      <div className="flex flex-col @sm:flex-row @sm:items-center space-x-2">
        <CMutedText>{t("consumption")}</CMutedText>
        <CLine className="space-x-2">
          <CDisplayEnergyValue
            value={
              data.consumption === null ? null : data.consumption * multiplier
            }
            minDecimals={2}
          />
          {data.percentage !== null && (
            <CBadgePercentage
              value={data.percentage}
              description={t("consumptionRate")}
            />
          )}
        </CLine>
      </div>
    </div>
  );
}

export function CSeuCard({
  data,
  load,
}: {
  data: IDtoSeuResponse & { id: string };
  load: () => Promise<void>;
}) {
  const { t } = useTranslation();

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(async () => {
    await push(
      t("msgRecordWillBeDeleted", { subject: data.name }),
      async () => {
        const res = await Api.DELETE("/u/measurement/seu/item/{id}", {
          params: { path: { id: data.id } },
        });
        apiToast(res);
        if (res.error === undefined) {
          await load();
        }
      },
    );
  }, [apiToast, data, load, push, t]);

  const actions = useCallback<IDropdownListCallback<IDtoSeuResponse>>(
    (d) => [
      {
        icon: ChartLine,
        label: t("values"),
        path: `/measurements/significant-energy-user/values/graph/${d.id}`,
      },
      {
        icon: Pencil,
        label: t("edit"),
        path: `/measurements/significant-energy-user/item/${d.id}`,
      },
      {
        icon: Trash2,
        label: t("_delete"),
        onClick: handleDelete,
      },
    ],
    [handleDelete, t],
  );

  return (
    <CCard key={data.id} className="p-3">
      <CLine className="space-x-3 items-center">
        <CSeuCardBody data={data} />

        <div className="self-start">
          <CDropdown
            value={data}
            list={actions}
            label={t("actions")}
            hideLabelLg
          />
        </div>
      </CLine>
    </CCard>
  );
}
