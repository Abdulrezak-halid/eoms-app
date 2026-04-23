import { ChartLine, ChartPie, CircleGauge, Pencil, Trash2 } from "lucide-react";
import { ReactElement, useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeDepartment } from "@m/base/components/CBadgeDepertment";
import { CBadgeNotConfigured } from "@m/base/components/CBadgeNotConfigured";
import { CBadgeUnitGroup } from "@m/base/components/CBadgeUnitGroup";
import { CDisplayEnergyValue } from "@m/base/components/CDisplayEnergyValue";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useUnitInfo } from "@m/base/hooks/useUnitMultiplierAndAbbr";
import { CBadge } from "@m/core/components/CBadge";
import { CBadgePercentage } from "@m/core/components/CBadgePercentage";
import { CButtonPopup } from "@m/core/components/CButtonPopup";
import { CCard } from "@m/core/components/CCard";
import { CDisplayNumber } from "@m/core/components/CDisplayNumber";
import { CDropdown, IDropdownListCallback } from "@m/core/components/CDropdown";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CLine } from "@m/core/components/CLine";
import { CMutedText } from "@m/core/components/CMutedText";
import { CPopupPanel } from "@m/core/components/CPopupPanel";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { usePopupState } from "@m/core/hooks/usePopupState";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CBadgeMetric } from "../components/CBadgeMetric";
import { IDtoMeterResponse } from "../interfaces/IDtoMeter";

function CMeterCardBody({ data }: { data: IDtoMeterResponse }) {
  const { t } = useTranslation();

  const { multiplier } = useUnitInfo("ENERGY");
  const popupState = usePopupState();

  const isMain = useMemo(
    () => data.slices?.some((s) => s.isMain) ?? false,
    [data.slices],
  );

  const popupComponent = useCallback(
    (): ReactElement => (
      <CPopupPanel className="p-3 space-y-3 overflow-y-auto">
        <div>
          <CMutedText>{t("metric")}</CMutedText>
          <CGridBadge>
            <CBadgeMetric value={data.metric.name} />
          </CGridBadge>
        </div>

        {data.slices && data.slices.length > 0 ? (
          <div>
            <CMutedText>{t("slices")}</CMutedText>
            <div className="space-y-2">
              {data.slices.map((slice) => (
                <div className="flex space-x-2 items-center" key={slice.id}>
                  <CBadgeDepartment value={slice.department.name} />
                  <CBadgePercentage value={slice.rate * 100} />
                  {slice.isMain && (
                    <CBadge
                      value={t("main")}
                      className="text-sky-600 dark:text-sky-300"
                      noTruncate
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <CBadgeNotConfigured />
        )}
      </CPopupPanel>
    ),
    [data.metric, data.slices, t],
  );

  return (
    <div className="flex justify-between flex-col @sm:flex-row grow gap-x-4 gap-y-2 min-w-0">
      <div className="flex items-center gap-2 min-w-0 grow justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="font-bold truncate" title={data.name}>
            {data.name}
          </div>
          {isMain && (
            <CBadge
              value={t("main")}
              className="text-sky-600 dark:text-sky-300"
              noTruncate
            />
          )}
        </div>

        <CButtonPopup
          icon={CircleGauge}
          label={t("metrics")}
          popupState={popupState}
          popupComponent={popupComponent}
          tertiary
          hideLabelMd
        />
      </div>

      <div className="flex flex-col @sm:items-end space-y-2">
        <div className="flex flex-col @sm:flex-row @sm:items-center space-x-2">
          <CMutedText>{t("consumption")}</CMutedText>
          <CLine className="space-x-2">
            <CDisplayEnergyValue
              value={
                data.consumption === null ? null : data.consumption * multiplier
              }
            />
            {data.consumptionPercentage !== null && (
              <CBadgePercentage
                value={data.consumptionPercentage}
                description={t("consumptionRate")}
              />
            )}
          </CLine>
        </div>
        <div className="flex flex-col @sm:flex-row @sm:items-center space-x-2">
          <CMutedText>{t("energyConversionRate")}</CMutedText>
          <CDisplayNumber value={data.energyConversionRate} />
          <div>
            <CBadgeUnitGroup value={data.metric.unitGroup} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CMeterCard({
  data,
  load,
}: {
  data: IDtoMeterResponse;
  load: () => Promise<void>;
}) {
  const { t } = useTranslation();

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(async () => {
    await push(
      t("msgRecordWillBeDeleted", { subject: data.name }),
      async () => {
        const res = await Api.DELETE("/u/measurement/meter/item/{id}", {
          params: { path: { id: data.id } },
        });
        apiToast(res);
        if (res.error === undefined) {
          await load();
        }
      },
    );
  }, [apiToast, data, load, push, t]);

  const actions = useCallback<IDropdownListCallback<IDtoMeterResponse>>(
    (d) => [
      {
        icon: ChartLine,
        label: t("metricValues"),
        path: `/measurements/metric/values/graph/${d.metric.id}`,
      },
      {
        icon: ChartPie,
        label: t("slices"),
        path: `/measurements/meter/item/${d.id}/slices`,
      },
      {
        icon: Pencil,
        label: t("edit"),
        path: `/measurements/meter/item/${d.id}`,
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
      <CLine className="gap-3 items-start">
        <CMeterCardBody data={data} />

        <CDropdown
          list={actions}
          value={data}
          label={t("actions")}
          hideLabelLg
        />
      </CLine>
    </CCard>
  );
}
