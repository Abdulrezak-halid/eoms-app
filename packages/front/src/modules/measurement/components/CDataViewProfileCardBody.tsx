import { CircleGauge } from "lucide-react";
import { ReactElement, useCallback, useMemo } from "react";

import { CBadgeSeu } from "@m/base/components/CBadgeSeu";
import { CButtonPopup } from "@m/core/components/CButtonPopup";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CLine } from "@m/core/components/CLine";
import { CMutedText } from "@m/core/components/CMutedText";
import { CPopupPanel } from "@m/core/components/CPopupPanel";
import { usePopupState } from "@m/core/hooks/usePopupState";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoDataViewProfileResponse } from "../interfaces/IDtoDataViewProfile";
import { CBadgeMeterSlice } from "./CBadgeMeterSlice";
import { CBadgeMetric } from "./CBadgeMetric";

export function CDataViewProfileCardBody({
  data,
}: {
  data: IDtoDataViewProfileResponse;
}) {
  const { t } = useTranslation();
  const popupState = usePopupState();

  // useDataViewMap is not used because these labels are plural
  const labelMap = useMemo(
    () => ({
      ["METRIC"]: t("metrics"),
      ["METER_SLICE"]: t("meterSlices"),
      ["SEU"]: t("significantEnergyUsers"),
    }),
    [t],
  );

  const typeLabel = labelMap[data.options.type];

  const hasItems = useMemo(() => {
    switch (data.options.type) {
      case "METRIC":
        return (data.options.metrics?.length ?? 0) > 0;
      case "METER_SLICE":
        return (data.options.meterSlices?.length ?? 0) > 0;
      case "SEU":
        return (data.options.seus?.length ?? 0) > 0;
      default:
        return false;
    }
  }, [data.options]);

  const popupComponent = useCallback(
    (): ReactElement => (
      <CPopupPanel className="p-3 space-y-3 overflow-y-auto">
        <CMutedText>{typeLabel}</CMutedText>
        <CGridBadge>
          {(() => {
            switch (data.options.type) {
              case "METRIC":
                return data.options.metrics?.map((d) => (
                  <CBadgeMetric key={d.id} value={d.name} />
                ));
              case "METER_SLICE":
                return data.options.meterSlices?.map((meterSlice) => (
                  <CBadgeMeterSlice
                    key={meterSlice.id}
                    value={meterSlice.name}
                  />
                ));
              case "SEU":
                return data.options.seus?.map((seu) => (
                  <CBadgeSeu key={seu.id} value={seu.name} />
                ));
              default:
                return;
            }
          })()}
        </CGridBadge>
      </CPopupPanel>
    ),
    [data.options, typeLabel],
  );

  return (
    <div className="flex justify-between flex-col @sm:flex-row grow gap-x-4 gap-y-2 min-w-0">
      <div className="flex items-center gap-2 min-w-0 grow justify-between">
        <div className="font-bold truncate" title={data.name}>
          {data.name}
        </div>
        <CMutedText className="truncate grow">
          {data.description || "-"}
        </CMutedText>

        {hasItems && (
          <CButtonPopup
            icon={CircleGauge}
            label={typeLabel}
            popupState={popupState}
            popupComponent={popupComponent}
            tertiary
            hideLabelMd
          />
        )}
      </div>

      {!hasItems && (
        <CLine>
          <CMutedText>{typeLabel}</CMutedText>
        </CLine>
      )}
    </div>
  );
}
