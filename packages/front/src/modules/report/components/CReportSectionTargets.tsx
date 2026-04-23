import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeEnergyResource } from "@m/base/components/CBadgeEnergyResource";
import { useUnitInfo } from "@m/base/hooks/useUnitMultiplierAndAbbr";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CBadgePercentage } from "@m/core/components/CBadgePercentage";
import { CDisplayNumber } from "@m/core/components/CDisplayNumber";
import { CTable } from "@m/core/components/CTable";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IDatetimeRange } from "@m/core/interfaces/IDatetimeRange";

import { IDtoReportSectionContent } from "../interfaces/IDtoReport";
import { customTableConverterTargets } from "../utils/customTableConverterTargets";
import { CButtonReportSectionCustomTableConverter } from "./CButtonReportSectionCustomTableConverter";
import { CMessageSelectDateRange } from "./CMessageSelectDateRange";

export function CReportSectionTargets({
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
    return await Api.GET("/u/planning/target/item", {
      params: { query: datetimeRange },
    });
  }, [datetimeRange]);

  const [data] = useLoader(loader);

  const header = useMemo(
    () => [
      { label: t("year") },
      { label: t("resource") },
      { label: t("percentage"), right: true },
      { label: t("consumption"), right: true },
    ],
    [t],
  );

  const { multiplier, abbr } = useUnitInfo("ENERGY");

  if (!datetimeRange) {
    return <CMessageSelectDateRange />;
  }

  return (
    <CAsyncLoader data={data} arrayField="records" showSpinnerDuringNoFetch>
      {(payload) => (
        <div className="space-y-3">
          <CButtonReportSectionCustomTableConverter
            data={payload.records}
            converter={customTableConverterTargets}
            onChange={onChange}
          />

          <CTable header={header} bordered>
            {payload.records.map((record) => [
              record.year.toString(),
              <CBadgeEnergyResource
                key="energy-resource"
                value={record.energyResource}
              />,
              <CBadgePercentage
                key="percentage"
                value={record.percentage}
                inline
              />,
              <CDisplayNumber
                key="consumption"
                value={record.consumption * multiplier}
                unitStr={abbr}
              />,
            ])}
          </CTable>
        </div>
      )}
    </CAsyncLoader>
  );
}
