import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeSeu } from "@m/base/components/CBadgeSeu";
import { CBadgeUser } from "@m/base/components/CBadgeUser";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CTable } from "@m/core/components/CTable";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IDatetimeRange } from "@m/core/interfaces/IDatetimeRange";

import { IDtoReportSectionContent } from "../interfaces/IDtoReport";
import { customTableConverterEnergySavingOpportunities } from "../utils/customTableConverterEnergySavingOpportunities";
import { CButtonReportSectionCustomTableConverter } from "./CButtonReportSectionCustomTableConverter";
import { CMessageSelectDateRange } from "./CMessageSelectDateRange";

export function CReportSectionEnergySavingOpportunities({
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
    return await Api.GET("/u/planning/energy-saving-opportunity/item", {
      params: { query: datetimeRange },
    });
  }, [datetimeRange]);

  const [data] = useLoader(loader);

  const header = useMemo(
    () => [
      { label: t("definition") },
      { label: t("significantEnergyUsers") },
      { label: t("investmentBudget"), right: true },
      { label: t("investmentApplicationPeriod"), right: true },
      { label: t("paybackMonth"), right: true },
      { label: t("responsibleUser") },
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
            converter={customTableConverterEnergySavingOpportunities}
            onChange={onChange}
          />

          <CTable header={header} bordered>
            {payload.records.map((record) => [
              record.name,

              <CGridBadge key="seus">
                {record.seus.map((seu) => (
                  <CBadgeSeu key={seu.id} value={seu.name} wrap />
                ))}
              </CGridBadge>,

              record.investmentBudget,

              <div key="period-month" className="text-nowrap">
                {t("dynamicMonths", {
                  month: record.investmentApplicationPeriodMonth,
                })}
              </div>,

              <div key="payback-month" className="text-nowrap">
                {t("dynamicMonths", {
                  month: record.paybackMonth,
                })}
              </div>,

              <CBadgeUser
                key="user"
                value={record.responsibleUser.displayName}
                wrap
              />,
            ])}
          </CTable>
        </div>
      )}
    </CAsyncLoader>
  );
}
