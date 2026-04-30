import {
  IUnit,
  IUnitGroup,
  MAX_API_STRING_LONG_LENGTH,
  UtilUnit,
} from "common";
import { Trash2 } from "lucide-react";
import { useCallback, useMemo } from "react";

import { CBadgeUnit } from "@m/base/components/CBadgeUnit";
import { CComboboxUnit } from "@m/base/components/CComboboxUnit";
import { CButton } from "@m/core/components/CButton";
import { CCard } from "@m/core/components/CCard";
import { CInputString } from "@m/core/components/CInputString";
import { CMutedText } from "@m/core/components/CMutedText";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { classNames } from "@m/core/utils/classNames";

import { CBadgeIndexSuccess } from "./CBadgeIndexSuccess";
import { CComboboxMetric } from "./CComboboxMetric";

export interface IIntegrationOutput {
  id: string;
  label?: string;
  outputKey: string;
  metricId: string | undefined;
  unit?: IUnit;
  isFixedUnit?: boolean;
  metricUnitGroup?: IUnitGroup;
}

export function CMetricIntegrationOutputFormLine({
  output,
  index,
  isSuccess,
  onUpdate,
  onRemove,
  selectedMetricIds,
  keyPlaceholder,
  isKeyDuplicate,
}: {
  output: IIntegrationOutput;
  index: number;
  isSuccess: boolean | undefined;
  onUpdate: (id: string, updates: Peomsal<IIntegrationOutput>) => void;
  onRemove: (id: string) => void;
  selectedMetricIds: string[];
  keyPlaceholder?: string;
  isKeyDuplicate?: boolean;
}) {
  const { t } = useTranslation();

  const handleOutputKeyChange = useCallback(
    (value: string) => {
      onUpdate(output.id, { outputKey: value });
    },
    [onUpdate, output.id],
  );

  const handleMetricIdChange = useCallback(
    (
      value: string | undefined,
      details: { unitGroup?: IUnitGroup } | undefined,
    ) => {
      if (value && details?.unitGroup) {
        if (output.unit) {
          // If selected unit and metric unit does not match, clear unit input
          const currentUnitGroup = UtilUnit.getGroup(output.unit);
          if (currentUnitGroup !== details.unitGroup) {
            onUpdate(output.id, {
              metricId: value,
              metricUnitGroup: details.unitGroup,
              unit: undefined,
            });
            return;
          }
        }

        onUpdate(output.id, {
          metricId: value,
          metricUnitGroup: details.unitGroup,
        });
      } else {
        onUpdate(output.id, {
          metricId: undefined,
          metricUnitGroup: undefined,
        });
      }
    },
    [onUpdate, output.id, output.unit],
  );

  const handleUnitChange = useCallback(
    (value: IUnit | undefined) => {
      if (value) {
        const newUnitGroup = UtilUnit.getGroup(value);

        if (output.metricUnitGroup && output.metricUnitGroup !== newUnitGroup) {
          onUpdate(output.id, {
            unit: value,
            metricId: undefined,
            metricUnitGroup: undefined,
          });
          return;
        }

        onUpdate(output.id, { unit: value });
        return;
      }

      onUpdate(output.id, {
        unit: undefined,
        metricUnitGroup:
          output.metricId && output.unit
            ? UtilUnit.getGroup(output.unit)
            : undefined,
      });
    },
    [onUpdate, output.id, output.metricId, output.metricUnitGroup, output.unit],
  );

  const handleRemove = useCallback(() => {
    if (output.isFixedUnit) {
      onUpdate(output.id, {
        metricId: undefined,
        metricUnitGroup: undefined,
      });
      return;
    }
    onRemove(output.id);
  }, [onRemove, onUpdate, output.id, output.isFixedUnit]);

  const unitGroupForMetricFilter = useMemo(() => {
    return output.unit ? UtilUnit.getGroup(output.unit) : undefined;
  }, [output.unit]);

  const unitGroupForUnitFilter = useMemo(() => {
    return output.metricUnitGroup
      ? output.metricUnitGroup
      : // If metric unit group is not set initially,
        //   but metric and unit is set, auto find unit group using unit
        output.metricId && output.unit
        ? UtilUnit.getGroup(output.unit)
        : undefined;
  }, [output.metricId, output.metricUnitGroup, output.unit]);

  const keyPlaceholderFinal = keyPlaceholder || t("key");

  return (
    <CCard
      className={classNames(
        "grow p-3 space-y-3",
        "@sm:flex @sm:space-y-0 @sm:space-x-2 @sm:items-center @sm:p-0 @sm:shadow-none @sm:bg-transparent @sm:dark:bg-transparent",
      )}
    >
      <div
        className={classNames(
          "@sm:flex-none flex items-center gap-2",
          output.label && "@sm:w-1/4",
        )}
      >
        <CBadgeIndexSuccess index={index} isSuccess={isSuccess} />

        {output.label && <div>{output.label}</div>}
      </div>

      {!output.label && (
        <div className="@sm:min-w-0 @sm:flex-none @sm:w-1/4">
          <CMutedText className="@sm:hidden">{keyPlaceholderFinal}</CMutedText>
          <CInputString
            placeholder={keyPlaceholderFinal}
            value={output.outputKey}
            onChange={handleOutputKeyChange}
            max={MAX_API_STRING_LONG_LENGTH} // For AvevaPi Web ID
            required
            invalid={isKeyDuplicate}
          />
        </div>
      )}

      {output.isFixedUnit && (
        <div
          className={classNames(
            "@sm:min-w-0 @sm:flex-none @sm:w-1/4",
            output.isFixedUnit && "space-x-2 @sm:space-x-0",
          )}
        >
          <CMutedText className="font-bold @sm:hidden">{t("unit")}</CMutedText>
          {output.unit ? <CBadgeUnit value={output.unit} /> : <span>-</span>}
        </div>
      )}

      <div className="@sm:min-w-0 @sm:grow">
        <CMutedText className="font-bold @sm:hidden">{t("metric")}</CMutedText>
        <CComboboxMetric
          value={output.metricId}
          onChangeWithDetails={handleMetricIdChange}
          disabledValues={selectedMetricIds}
          unitGroup={unitGroupForMetricFilter}
          required={!output.isFixedUnit}
        />
      </div>

      {!output.isFixedUnit && (
        <div
          className={classNames(
            "@sm:min-w-0 @sm:flex-none @sm:w-1/4",
            output.isFixedUnit && "space-x-2 @sm:space-x-0",
          )}
        >
          <CMutedText className="font-bold @sm:hidden">{t("unit")}</CMutedText>
          <CComboboxUnit
            value={output.unit}
            onChange={handleUnitChange}
            unitGroup={unitGroupForUnitFilter}
            required
          />
        </div>
      )}

      {!output.isFixedUnit && (
        <div className="@sm:w-auto">
          <CButton
            icon={Trash2}
            onClick={handleRemove}
            className="w-full @sm:w-auto"
          />
        </div>
      )}
    </CCard>
  );
}
