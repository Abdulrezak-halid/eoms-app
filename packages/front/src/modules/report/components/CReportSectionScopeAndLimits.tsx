import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeDepartment } from "@m/base/components/CBadgeDepertment";
import { CBadgeEnergyResource } from "@m/base/components/CBadgeEnergyResource";
import { IDtoScopeAndLimitsResponse } from "@m/commitment/interfaces/IDtoScopeAndLimits";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CTable } from "@m/core/components/CTable";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IDatetimeRange } from "@m/core/interfaces/IDatetimeRange";

import { IDtoReportSectionContent } from "../interfaces/IDtoReport";
import { customTableConverterScopeAndLimits } from "../utils/customTableConverterScopeAndLimits";
import { CButtonReportSectionCustomTableConverter } from "./CButtonReportSectionCustomTableConverter";
import { CMessageSelectDateRange } from "./CMessageSelectDateRange";

export function CReportSectionScopeAndLimits({
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
    return await Api.GET("/u/commitment/scope-and-limit/item", {
      params: { query: datetimeRange },
    });
  }, [datetimeRange]);

  const [data] = useLoader(loader);

  const header = useMemo(
    () => [
      { label: t("departments") },
      { label: t("excludedResources") },
      { label: t("excludedResourceReason") },
    ],
    [t],
  );

  const convertScopeAndLimitsToVerticalTable = useCallback(
    (records: IDtoScopeAndLimitsResponse[]) =>
      customTableConverterScopeAndLimits(records, t),
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
            converter={convertScopeAndLimitsToVerticalTable}
            onChange={onChange}
          />

          <CTable header={header} bordered>
            {payload.records.map((record) => [
              <CGridBadge key="departments">
                {record.departments.map((dept) => (
                  <CBadgeDepartment key={dept.id} value={dept.name} wrap />
                ))}
              </CGridBadge>,

              <CGridBadge key="energy-resource">
                {record.excludedResources.map((d) => (
                  <CBadgeEnergyResource key={d} value={d} />
                ))}
              </CGridBadge>,

              record.excludedResourceReason,
            ])}
          </CTable>
        </div>
      )}
    </CAsyncLoader>
  );
}
