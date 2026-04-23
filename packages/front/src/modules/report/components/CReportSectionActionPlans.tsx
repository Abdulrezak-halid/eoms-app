/**
 * @file: CReportSectionActionPlans.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 07.01.2026
 * Last Modified Date: 07.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { UtilDate } from "common";
import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeUser } from "@m/base/components/CBadgeUser";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CTable } from "@m/core/components/CTable";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IDatetimeRange } from "@m/core/interfaces/IDatetimeRange";

import { IDtoReportSectionContent } from "../interfaces/IDtoReport";
import { customTableConverterActionPlans } from "../utils/customTableConverterActionPlans";
import { CButtonReportSectionCustomTableConverter } from "./CButtonReportSectionCustomTableConverter";
import { CMessageSelectDateRange } from "./CMessageSelectDateRange";

export function CReportSectionActionPlans({
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
    return await Api.GET("/u/planning/action-plan/item", {
      params: { query: datetimeRange },
    });
  }, [datetimeRange]);

  const [data] = useLoader(loader);

  const header = useMemo(
    () => [
      { label: t("actionPlans") },
      { label: t("reasonsForStatus") },
      { label: t("responsibleUser") },
      { label: t("startDate"), right: true },
      { label: t("targetIdentificationDate"), right: true },
      { label: t("actualIdentificationDate"), right: true },
      { label: t("actualSavingsVerifications") },
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
            converter={customTableConverterActionPlans}
            onChange={onChange}
          />

          <CTable header={header} bordered>
            {payload.records.map((record) => [
              record.name,
              record.reasonsForStatus,
              <CBadgeUser
                key="user"
                value={record.responsibleUser.displayName}
                wrap
              />,
              UtilDate.formatLocalIsoDateToLocalDate(record.startDate),
              UtilDate.formatLocalIsoDateToLocalDate(
                record.targetIdentificationDate,
              ),
              UtilDate.formatLocalIsoDateToLocalDate(
                record.actualIdentificationDate,
              ),
              record.actualSavingsVerifications,
            ])}
          </CTable>
        </div>
      )}
    </CAsyncLoader>
  );
}
