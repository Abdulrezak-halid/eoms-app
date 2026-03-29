import { RefreshCw } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { ContextGlobalFilter } from "@m/base/contexts/ContextGlobalFilter";
import { CLine } from "@m/core/components/CLine";
import {
  CQuickRangeSelect,
  ICQuickRangeValue,
} from "@m/core/components/CQuickRangeSelect";

import { CButton } from "./CButton";

export function CDatetimeRangeButton() {
  const {
    getDatetimeRange,
    selectedQuickRange,
    setCustomDatetimeMax,
    setCustomDatetimeMin,
    setSelectedQuickRange,
    triggerDatetimeRefresh,
  } = useContext(ContextGlobalFilter);

  const quickRangeValue = useMemo<ICQuickRangeValue>(() => {
    if (selectedQuickRange) {
      return { quickRange: selectedQuickRange };
    }

    const { datetimeMin, datetimeMax } = getDatetimeRange();

    return {
      customMin: datetimeMin,
      customMax: datetimeMax,
    };
  }, [getDatetimeRange, selectedQuickRange]);

  const handleQuickRangeChange = useCallback(
    (value: ICQuickRangeValue) => {
      if (value.quickRange) {
        setCustomDatetimeMin(undefined);
        setCustomDatetimeMax(undefined);
        setSelectedQuickRange(value.quickRange);
        return;
      }

      setCustomDatetimeMin(value.customMin);
      setCustomDatetimeMax(value.customMax);
      setSelectedQuickRange(undefined);
    },
    [setCustomDatetimeMax, setCustomDatetimeMin, setSelectedQuickRange],
  );

  return (
    <CLine className="space-x-2">
      <CQuickRangeSelect
        value={quickRangeValue}
        onChange={handleQuickRangeChange}
      />

      <CButton icon={RefreshCw} onClick={triggerDatetimeRefresh} />
    </CLine>
  );
}
