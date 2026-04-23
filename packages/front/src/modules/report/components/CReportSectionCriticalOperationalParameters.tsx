import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeEnergyResource } from "@m/base/components/CBadgeEnergyResource";
import { CBadgeSeu } from "@m/base/components/CBadgeSeu";
import { CBadgeUnit } from "@m/base/components/CBadgeUnit";
import { CBadgeUser } from "@m/base/components/CBadgeUser";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CTable } from "@m/core/components/CTable";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IDatetimeRange } from "@m/core/interfaces/IDatetimeRange";

import { IDtoReportSectionContent } from "../interfaces/IDtoReport";
import { customTableConverterCriticalOperationalParameters } from "../utils/customTableConverterCriticalOperationalParameters";
import { CButtonReportSectionCustomTableConverter } from "./CButtonReportSectionCustomTableConverter";
import { CMessageSelectDateRange } from "./CMessageSelectDateRange";

export function CReportSectionCriticalOperationalParameters({
  datetimeRange,
  onChange,
}: {
  datetimeRange?: IDatetimeRange;
  onChange: (value: IDtoReportSectionContent) => void;
}) {
  const { t } = useTranslation();

  const loader = useCallback(async () => {
    if (!datetimeRange) {
      return;
    }
    return await Api.GET("/u/support/critical-operational-parameter/item", {
      params: { query: datetimeRange },
    });
  }, [datetimeRange]);

  const [data] = useLoader(loader);

  const header = useMemo(
    () => [
      { label: t("significantEnergyUser") },
      { label: t("resource") },
      { label: t("parameter") },
      { label: t("unit") },
      { label: t("normalSettingValue"), right: true },
      { label: t("upperLimit"), right: true },
      { label: t("lowerLimit"), right: true },
      { label: t("measurementTool") },
      { label: t("accuracyCalibrationFrequency"), right: true },
      { label: t("valueResponsibleUser") },
      { label: t("deviationResponsibleUser") },
      { label: t("note") },
    ],
    [t],
  );

  if (!datetimeRange) {
    return <CMessageSelectDateRange />;
  }

  return (
    <CAsyncLoader data={data} arrayField="records" showSpinnerDuringNoFetch>
      {(payload) => (
        <div className="space-y-3">
          <CButtonReportSectionCustomTableConverter
            data={payload.records}
            converter={customTableConverterCriticalOperationalParameters}
            onChange={onChange}
          />

          <CTable header={header} bordered>
            {payload.records.map((record) => [
              <CBadgeSeu key="seu" value={record.seu.name} wrap />,
              <CBadgeEnergyResource
                key="energy-resource"
                value={record.energyResource}
              />,
              record.parameter,
              <CBadgeUnit key="unit" value={record.unit} />,
              record.normalSettingValue,
              record.upperLimit,
              record.lowerLimit,
              record.measurementTool,
              record.accuracyCalibrationFrequency,
              <CBadgeUser
                key="value-user"
                value={record.valueResponsibleUser.displayName}
                wrap
              />,
              <CBadgeUser
                key="deviation-user"
                value={record.deviationResponsibleUser.displayName}
                wrap
              />,
              record.note || "-",
            ])}
          </CTable>
        </div>
      )}
    </CAsyncLoader>
  );
}
