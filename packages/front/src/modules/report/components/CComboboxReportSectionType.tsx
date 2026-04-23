/**
 * @file: CComboboxReportSectionType.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.01.2026
 * Last Modified Date: 06.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import {
  Briefcase,
  Building,
  CaseSensitive,
  ChartLine,
  ChartPie,
  FileText,
  Folder,
  Handshake,
  Table,
} from "lucide-react";
import { useMemo } from "react";

import { IValueLabelMap } from "@m/base/interfaces/IValueLabelMap";
import { CCombobox, ICComboboxProps } from "@m/core/components/CCombobox";
import { useMapToComboList } from "@m/core/hooks/useMapToComboList";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoReportSectionType } from "../interfaces/IDtoReport";

export function CComboboxReportSectionType(
  props: Omit<ICComboboxProps<IDtoReportSectionType>, "list">,
) {
  const { t } = useTranslation();

  const map = useMemo(
    () =>
      ({
        HEADER: {
          label: t("title"),
          icon: CaseSensitive,
        },
        TEXT: {
          label: t("text"),
          icon: FileText,
        },
        TABLE_HORIZONTAL: {
          label: t("tableHorizontal"),
          icon: Table,
        },
        TABLE_VERTICAL: {
          label: t("tableVertical"),
          icon: Table,
        },
        COMPANY_INFO: {
          label: t("companyInfo"),
          icon: Building,
        },
        ENERGY_POLICIES: {
          label: t("energyPolicies"),
          icon: Handshake,
        },
        SCOPE_AND_LIMITS: {
          label: t("scopeAndLimits"),
          icon: Handshake,
        },
        ENERGY_SAVING_OPPORTUNITIES: {
          label: t("energySavingOpportunities"),
          icon: Handshake,
        },
        ACTION_PLANS: {
          label: t("actionPlans"),
          icon: Handshake,
        },
        TARGETS: {
          label: t("targets"),
          icon: Handshake,
        },
        CRITICAL_OPERATIONAL_PARAMETERS: {
          label: t("criticalOperationalParameters"),
          icon: Briefcase,
        },
        METER_SLICE_GRAPH: {
          label: t("meterGraph"),
          icon: ChartLine,
        },
        SEU_GRAPH: {
          label: t("seuGraph"),
          icon: ChartLine,
        },
        REGRESSION_RESULT: {
          label: t("regressionResult"),
          icon: ChartLine,
        },
        SEU_TOTAL_CONSUMPTION_PIE_CHART: {
          label: t("seuTotalConsumptionPieChart"),
          icon: ChartPie,
        },
        ENERGY_CONSUMPTION_PIE_CHART: {
          label: t("energyConsumptionPieChart"),
          icon: ChartPie,
        },
        SEU_CONSUMPTION_TABLE: {
          label: t("tableSeuConsumption"),
          icon: Table,
        },
        REGRESSION_ANALYSIS_TABLE: {
          label: t("tableRegressionAnalysis"),
          icon: Table,
        },
        PRIMARY_REGRESSION_DRIVER_LIST: {
          label: t("drivers"),
          icon: Table,
        },
        TOTAL_ENERGY_CONSUMPTION_COST_TABLE: {
          label: t("tableEnergyConsumptionCost"),
          icon: Table,
        },
        TOTAL_MONTHLY_ENERGY_CONSUMPTION_COST_TABLE: {
          label: t("monthlyTotalEnergyConsumptionCost"),
          icon: Table,
        },
      }) satisfies IValueLabelMap<IDtoReportSectionType>,
    [t],
  );

  const list = useMapToComboList(map);

  return (
    <CCombobox
      icon={Folder}
      placeholder={t("pleaseSelectSectionType")}
      {...props}
      list={list}
      searchable
    />
  );
}
