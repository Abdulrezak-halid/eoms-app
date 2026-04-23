/**
 * @file: CReportSection.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.01.2026
 * Last Modified Date: 06.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { UtilDate } from "common";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleHelp,
  Trash2,
} from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  IDateQuickRange,
  getDateRangeFromQuickRange,
} from "@m/base/hooks/useQuickDateRanges";
import { CBadge } from "@m/core/components/CBadge";
import { CButton } from "@m/core/components/CButton";
import { CCard } from "@m/core/components/CCard";
import { CDropdown, IDropdownListCallback } from "@m/core/components/CDropdown";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CLine } from "@m/core/components/CLine";
import { CMessageText } from "@m/core/components/CMessageText";
import {
  CQuickRangeSelect,
  ICQuickDateRangeValue,
} from "@m/core/components/CQuickRangeSelect";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IDatetimeRange } from "@m/core/interfaces/IDatetimeRange";
import { quickRangeToDateRange } from "@m/core/utils/UtilQuickRange";

import { useReportSectionDefaultTitleMap } from "../hooks/useReportSectionDefaultTitleMap";
import {
  IDtoReportSectionData,
  IDtoReportSectionType,
} from "../interfaces/IDtoReport";
import { IReportSection } from "../interfaces/IReportSection";
import { UtilReportSectionControl } from "../utils/UtilReportSectionControl";
import { CComboboxReportSectionType } from "./CComboboxReportSectionType";
import { CInputStringPlainOrTranslatable } from "./CInputStringPlainOrTranslatable";
import { CReportSectionActionPlans } from "./CReportSectionActionPlans";
import { CReportSectionCompanyInfo } from "./CReportSectionCompanyInfo";
import { CReportSectionCriticalOperationalParameters } from "./CReportSectionCriticalOperationalParameters";
import { CReportSectionEnergyConsumptionPieChart } from "./CReportSectionEnergyConsumptionPieChart";
import { CReportSectionEnergyConsumptionTable } from "./CReportSectionEnergyConsumptionTable";
import { CReportSectionEnergyPolicies } from "./CReportSectionEnergyPolicies";
import { CReportSectionEnergySavingOpportunities } from "./CReportSectionEnergySavingOpportunities";
import { CReportSectionHorizontalTable } from "./CReportSectionHorizontalTable";
import { CReportSectionMeterSliceGraph } from "./CReportSectionMeterSliceGraph";
import { CReportSectionMonthlyEnergyConsumptionTable } from "./CReportSectionMonthlyTotalConsumptionCostTable";
import { CReportSectionPrimaryRegressionDriverList } from "./CReportSectionPrimaryRegressionDriverList";
import { CReportSectionRegressionAnalysisTable } from "./CReportSectionRegressionAnalysisTable";
import { CReportSectionRegressionResult } from "./CReportSectionRegressionResult";
import { CReportSectionScopeAndLimits } from "./CReportSectionScopeAndLimits";
import { CReportSectionSeuConsumptionPieChart } from "./CReportSectionSeuConsumptionPieChart";
import { CReportSectionSeuConsumptionTable } from "./CReportSectionSeuConsumptionTable";
import { CReportSectionSeuGraph } from "./CReportSectionSeuGraph";
import { CReportSectionTargets } from "./CReportSectionTargets";
import { CReportSectionText } from "./CReportSectionText";
import { CReportSectionVerticalTable } from "./CReportSectionVerticalTable";

export const CReportSection = memo(function CReportSection({
  index,
  sections,
  data,
  sectionNumber,
  template,
  onRemove,
  onDataChange,
  onInvalidChange,
  datetimeRange, // Typed as ICQuickRangeValue
  onSectionPositionChange,
}: {
  index: number;
  // For position control abilities
  sections: IReportSection[];
  data: IDtoReportSectionData;
  sectionNumber?: string;
  template?: boolean;
  onRemove: (index: number) => void;
  onDataChange: (index: number, value: IDtoReportSectionData) => void;
  onInvalidChange: (index: number, value: boolean) => void;
  datetimeRange?: ICQuickDateRangeValue;
  onSectionPositionChange: (
    index: number,
    event: "moveUp" | "moveDown" | "increaseDepth" | "decreaseDepth",
  ) => void;
}) {
  const { t } = useTranslation();

  const inputType = useInput(
    // IDtoReportSectionData excludes some dev purposes types, that's why it is casted
    data.content?.type as IDtoReportSectionType | undefined,
  );

  const inputTitle = useInput(
    data.title || {
      type: "PLAIN",
      value: "",
    },
  );

  const [content, setContent] = useState(data.content);
  const [invalidContent, setInvalidContent] = useState(false);
  const [isCustomDateEnabled, setIsCustomDateEnabled] = useState(
    Boolean(data.customDate),
  );

  const initialCustomDateRange = useMemo<
    ICQuickDateRangeValue | undefined
  >(() => {
    if (!data.customDate?.start) {
      return undefined;
    }

    if (!data.customDate.end) {
      return { quickRange: data.customDate.start as IDateQuickRange };
    }

    return {
      customMin: data.customDate.start,
      customMax: data.customDate.end,
    };
  }, [data.customDate]);

  const inputCustomDateRange = useInput(initialCustomDateRange);
  const customDateValidation = useMemo(
    () =>
      quickRangeToDateRange(inputCustomDateRange.value, {
        required: isCustomDateEnabled,
      }),
    [inputCustomDateRange.value, isCustomDateEnabled],
  );
  const lastCustomDateRef = useRef<ICQuickDateRangeValue | undefined>(
    initialCustomDateRange,
  );

  const invalidForm = useInputInvalid(inputType, inputTitle);
  const invalidCustomDate = Boolean(customDateValidation.invalidMsg);

  const invalid = invalidForm || invalidContent || invalidCustomDate;

  useEffect(() => {
    onInvalidChange(index, invalid);
  }, [index, invalid, onInvalidChange]);

  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  const defaultTitleMap = useReportSectionDefaultTitleMap();
  const defaultTitle = inputType.value
    ? defaultTitleMap[inputType.value]
    : undefined;

  useEffect(() => {
    if (!inputType.value) {
      setContent(undefined);
      return;
    }
    if (inputType.value !== content?.type) {
      setContent({ type: inputType.value });
      if (defaultTitle) {
        const setTitle = inputTitle.onChange;
        setTitle(defaultTitle);
      }
    }
  }, [content?.type, defaultTitle, inputTitle.onChange, inputType.value]);

  useEffect(() => {
    onDataChange(index, {
      depth: data.depth,
      customDate: (() => {
        if (!isCustomDateEnabled || !inputCustomDateRange.value) {
          return undefined;
        }

        const val = inputCustomDateRange.value;
        if (val.quickRange) {
          return { start: val.quickRange, end: "" };
        }
        if (val.customMin && val.customMax) {
          return { start: val.customMin, end: val.customMax };
        }

        return undefined;
      })(),
      title: inputTitle.value,
      content,
    });
  }, [
    content,
    data.depth,
    index,
    inputCustomDateRange.value,
    inputTitle.value,
    isCustomDateEnabled,
    onDataChange,
  ]);

  const handleEnableCustomDate = useCallback(() => {
    setIsCustomDateEnabled(true);
    inputCustomDateRange.onChange(lastCustomDateRef.current);
  }, [inputCustomDateRange]);

  const handleDisableCustomDate = useCallback(() => {
    lastCustomDateRef.current = inputCustomDateRange.value;
    setIsCustomDateEnabled(false);
  }, [inputCustomDateRange.value]);

  const dateRangeActionList = useCallback<IDropdownListCallback<boolean>>(
    (enabled) =>
      enabled
        ? [
            {
              icon: CalendarDays,
              label: t("usereportDaterange"),
              onClick: handleDisableCustomDate,
            },
          ]
        : [
            {
              icon: CalendarDays,
              label: t("setCustomDaterange"),
              onClick: handleEnableCustomDate,
            },
          ],
    [handleDisableCustomDate, handleEnableCustomDate, t],
  );

  const effectiveDatetimeRange = useMemo((): IDatetimeRange | undefined => {
    if (isCustomDateEnabled && inputCustomDateRange.value) {
      const val = inputCustomDateRange.value;

      if (val.quickRange) {
        const range = getDateRangeFromQuickRange(val.quickRange);
        const endDate = UtilDate.localIsoDateToObj(range.dateMax);
        endDate.setHours(23, 59, 59, 999);

        return {
          datetimeMin: UtilDate.localIsoDateToIsoDatetime(range.dateMin),
          datetimeMax: UtilDate.objToIsoDatetime(endDate),
        };
      }

      if (val.customMin && val.customMax) {
        const endDate = UtilDate.localIsoDateToObj(val.customMax);
        endDate.setHours(23, 59, 59, 999);

        return {
          datetimeMin: UtilDate.localIsoDateToIsoDatetime(val.customMin),
          datetimeMax: UtilDate.objToIsoDatetime(endDate),
        };
      }
    }

    if (datetimeRange) {
      if (datetimeRange.quickRange) {
        const range = getDateRangeFromQuickRange(datetimeRange.quickRange);
        const endDate = UtilDate.localIsoDateToObj(range.dateMax);
        endDate.setHours(23, 59, 59, 999);

        return {
          datetimeMin: UtilDate.localIsoDateToIsoDatetime(range.dateMin),
          datetimeMax: UtilDate.objToIsoDatetime(endDate),
        };
      }

      if (datetimeRange.customMin && datetimeRange.customMax) {
        const endDate = UtilDate.localIsoDateToObj(datetimeRange.customMax);
        endDate.setHours(23, 59, 59, 999);

        return {
          datetimeMin: UtilDate.localIsoDateToIsoDatetime(
            datetimeRange.customMin,
          ),
          datetimeMax: UtilDate.objToIsoDatetime(endDate),
        };
      }
    }

    return undefined;
  }, [datetimeRange, inputCustomDateRange.value, isCustomDateEnabled]);

  const handleSectionPositionChange = useCallback(
    (event: "moveUp" | "moveDown" | "increaseDepth" | "decreaseDepth") => {
      onSectionPositionChange(index, event);
    },
    [index, onSectionPositionChange],
  );

  const positionAbilities = useMemo(
    () => ({
      canDecreaseDepth: UtilReportSectionControl.canDecreaseDepth(
        sections,
        index,
      ),
      canIncreaseDepth: UtilReportSectionControl.canIncreaseDepth(
        sections,
        index,
      ),
      canMoveUp: index !== 0,
      canMoveDown: index !== sections.length - 1,
    }),
    [index, sections],
  );

  return (
    <CCard className="p-4">
      <CLine className="mb-4">
        {sectionNumber && (
          <CBadge
            value={`${t("section")} ${sectionNumber}`}
            className="text-accent-700 dark:text-accent-300"
          />
        )}

        <CLine className="space-x-2 grow justify-end">
          <CButton
            icon={ChevronLeft}
            value="decreaseDepth"
            onClick={handleSectionPositionChange}
            disabled={!positionAbilities.canDecreaseDepth}
            tertiary
            hideLabelLg
            label={t("decreaseDepth")}
          />
          <CButton
            icon={ChevronRight}
            value="increaseDepth"
            onClick={handleSectionPositionChange}
            disabled={!positionAbilities.canIncreaseDepth}
            tertiary
            hideLabelLg
            label={t("increaseDepth")}
          />
          <CButton
            icon={ChevronUp}
            value="moveUp"
            onClick={handleSectionPositionChange}
            disabled={!positionAbilities.canMoveUp}
            tertiary
            hideLabelLg
            label={t("moveUp")}
          />
          <CButton
            icon={ChevronDown}
            value="moveDown"
            onClick={handleSectionPositionChange}
            disabled={!positionAbilities.canMoveDown}
            tertiary
            hideLabelLg
            label={t("moveDown")}
          />

          <CButton
            icon={Trash2}
            label={t("remove")}
            onClick={handleRemove}
            hideLabelLg
          />

          <CDropdown
            icon={CalendarDays}
            list={dateRangeActionList}
            value={isCustomDateEnabled}
            noIconRight
            hideLabelLg
          />
        </CLine>
      </CLine>

      <CFormPanel>
        <CFormLine label={t("type")} invalidMsg={inputType.invalidMsg}>
          <CComboboxReportSectionType {...inputType} required={!template} />
        </CFormLine>

        <CFormLine label={t("title")} invalidMsg={inputTitle.invalidMsg}>
          <CInputStringPlainOrTranslatable
            {...inputTitle}
            defaultValue={defaultTitle}
            placeholder={t("title")}
            required={!template}
          />
        </CFormLine>

        {isCustomDateEnabled && (
          <CFormLine
            label={t("dateRange")}
            invalidMsg={customDateValidation.invalidMsg}
          >
            <CQuickRangeSelect
              mode="dateOnly"
              value={inputCustomDateRange.value}
              onChange={inputCustomDateRange.onChange}
              invalid={invalidCustomDate}
              required
            />
          </CFormLine>
        )}
      </CFormPanel>

      {content && (
        <div className="mt-3">
          {content.type === "HEADER" ? (
            <div />
          ) : content.type === "TEXT" ? (
            <CReportSectionText
              key={content.type}
              content={content}
              template={template}
              onChange={setContent}
              onInvalidChange={setInvalidContent}
            />
          ) : content.type === "TABLE_VERTICAL" ? (
            <CReportSectionVerticalTable
              key={content.type}
              content={content}
              onChange={setContent}
              onInvalidChange={setInvalidContent}
            />
          ) : content.type === "TABLE_HORIZONTAL" ? (
            <CReportSectionHorizontalTable
              key={content.type}
              content={content}
              onChange={setContent}
              onInvalidChange={setInvalidContent}
            />
          ) : content.type === "COMPANY_INFO" ? (
            <CReportSectionCompanyInfo key={content.type} />
          ) : content.type === "ENERGY_POLICIES" ? (
            <CReportSectionEnergyPolicies key={content.type} />
          ) : content.type === "SCOPE_AND_LIMITS" ? (
            <CReportSectionScopeAndLimits
              key={content.type}
              datetimeRange={effectiveDatetimeRange}
              onChange={setContent}
            />
          ) : content.type === "ENERGY_SAVING_OPPORTUNITIES" ? (
            <CReportSectionEnergySavingOpportunities
              key={content.type}
              datetimeRange={effectiveDatetimeRange}
              onChange={setContent}
            />
          ) : content.type === "ACTION_PLANS" ? (
            <CReportSectionActionPlans
              key={content.type}
              datetimeRange={effectiveDatetimeRange}
              onChange={setContent}
            />
          ) : content.type === "TARGETS" ? (
            <CReportSectionTargets
              key={content.type}
              onChange={setContent}
              datetimeRange={effectiveDatetimeRange}
            />
          ) : content.type === "CRITICAL_OPERATIONAL_PARAMETERS" ? (
            <CReportSectionCriticalOperationalParameters
              key={content.type}
              datetimeRange={effectiveDatetimeRange}
              onChange={setContent}
            />
          ) : content.type === "METER_SLICE_GRAPH" ? (
            <CReportSectionMeterSliceGraph
              key={content.type}
              content={content}
              onChange={setContent}
              onInvalidChange={setInvalidContent}
              datetimeRange={effectiveDatetimeRange}
            />
          ) : content.type === "SEU_GRAPH" ? (
            <CReportSectionSeuGraph
              key={content.type}
              content={content}
              onChange={setContent}
              onInvalidChange={setInvalidContent}
              datetimeRange={effectiveDatetimeRange}
            />
          ) : content.type === "REGRESSION_RESULT" ? (
            <CReportSectionRegressionResult
              key={content.type}
              resultId={content.resultId}
              onChange={setContent}
              onInvalidChange={setInvalidContent}
            />
          ) : content.type === "SEU_TOTAL_CONSUMPTION_PIE_CHART" ? (
            <CReportSectionSeuConsumptionPieChart
              key={content.type}
              content={content}
              onChange={setContent}
              onInvalidChange={setInvalidContent}
              datetimeRange={effectiveDatetimeRange}
            />
          ) : content.type === "ENERGY_CONSUMPTION_PIE_CHART" ? (
            <CReportSectionEnergyConsumptionPieChart
              key={content.type}
              datetimeRange={effectiveDatetimeRange}
            />
          ) : content.type === "SEU_CONSUMPTION_TABLE" ? (
            <CReportSectionSeuConsumptionTable
              key={content.type}
              content={content}
              onChange={setContent}
              onInvalidChange={setInvalidContent}
              datetimeRange={effectiveDatetimeRange}
            />
          ) : content.type === "REGRESSION_ANALYSIS_TABLE" ? (
            <CReportSectionRegressionAnalysisTable
              key={content.type}
              content={content}
              onChange={setContent}
              datetimeRange={effectiveDatetimeRange}
            />
          ) : content.type === "PRIMARY_REGRESSION_DRIVER_LIST" ? (
            <CReportSectionPrimaryRegressionDriverList
              key={content.type}
              onChange={setContent}
              datetimeRange={effectiveDatetimeRange}
            />
          ) : content.type === "TOTAL_ENERGY_CONSUMPTION_COST_TABLE" ? (
            <CReportSectionEnergyConsumptionTable
              key={content.type}
              datetimeRange={effectiveDatetimeRange}
              onChange={setContent}
            />
          ) : content.type === "TOTAL_MONTHLY_ENERGY_CONSUMPTION_COST_TABLE" ? (
            <CReportSectionMonthlyEnergyConsumptionTable
              key={content.type}
              onChange={setContent}
              datetimeRange={effectiveDatetimeRange}
            />
          ) : (
            <div className="py-6">
              <CMessageText
                type="warning"
                icon={CircleHelp}
                value={t("unknown")}
              />
            </div>
          )}
        </div>
      )}
    </CCard>
  );
});
