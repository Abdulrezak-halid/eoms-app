import { UtilUnit } from "common";

import { CDisplayNumber } from "@m/core/components/CDisplayNumber";
import { CMutedText } from "@m/core/components/CMutedText";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { scaleEnergyValue } from "../utils/scaleEnergyValue";

type CDisplayEnergyValueProps = {
  value?: number | null;
  className?: string;
  placeholder?: string;
  maxDecimals?: number;
  minDecimals?: number;
};

export function CDisplayEnergyValue({
  value,
  className,
  placeholder = "-",
  maxDecimals = 2,
  minDecimals,
}: CDisplayEnergyValueProps) {
  const { t } = useTranslation();

  if (value === null || value === undefined || !Number.isFinite(value)) {
    return <CMutedText value={placeholder} />;
  }

  const { value: scaledValue, unit } = scaleEnergyValue(value);

  return (
    <CDisplayNumber
      value={scaledValue}
      unitStr={UtilUnit.getAbbreviation(unit, t)}
      className={className}
      maxDecimals={maxDecimals}
      minDecimals={minDecimals}
    />
  );
}
