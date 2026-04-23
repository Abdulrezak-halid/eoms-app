import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeDepartment } from "@m/base/components/CBadgeDepertment";
import { CBadgeUnitGroup } from "@m/base/components/CBadgeUnitGroup";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CTable } from "@m/core/components/CTable";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IDatetimeRange } from "@m/core/interfaces/IDatetimeRange";
import { CBadgeMetric } from "@m/measurement/components/CBadgeMetric";
import { CBadgeMetricIntegrationPeriod } from "@m/measurement/components/CBadgeMetricIntegrationPeriod";

import { IDtoReportSectionContent } from "../interfaces/IDtoReport";
import { customTableConverterPrimaryRegressionDriverList } from "../utils/customTableConverterPrimaryRegressionDriverList";
import { CButtonReportSectionCustomTableConverter } from "./CButtonReportSectionCustomTableConverter";
import { CMessageSelectDateRange } from "./CMessageSelectDateRange";

export function CReportSectionPrimaryRegressionDriverList({
  datetimeRange,
  onChange,
}: {
  datetimeRange?: IDatetimeRange;
  onChange: (value: IDtoReportSectionContent) => void;
}) {
  const { t } = useTranslation();

  const fetcher = useCallback(async () => {
    if (!datetimeRange) {
      return;
    }

    return await Api.GET(
      "/u/report/section-data/primary-regression-driver-list",
      {
        params: { query: datetimeRange },
      },
    );
  }, [datetimeRange]);

  const [data] = useLoader(fetcher);

  const header = useMemo(
    () => [
      { label: t("name") },
      { label: t("unit") },
      { label: t("period") },
      { label: t("departments") },
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
            converter={customTableConverterPrimaryRegressionDriverList}
            onChange={onChange}
          />

          <CTable header={header} bordered>
            {payload.records.map((record) => [
              <CBadgeMetric key="driver" value={record.name} wrap />,

              <CBadgeUnitGroup key="unit-group" value={record.unitGroup} />,

              record.integrationPeriod ? (
                <CBadgeMetricIntegrationPeriod
                  value={record.integrationPeriod}
                />
              ) : (
                "-"
              ),

              <CGridBadge key="departments">
                {record.departmentNames.map((d) => (
                  <CBadgeDepartment key={d} value={d} wrap />
                ))}
              </CGridBadge>,
            ])}
          </CTable>
        </div>
      )}
    </CAsyncLoader>
  );
}
