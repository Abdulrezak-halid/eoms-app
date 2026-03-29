import { IDtoEPeriod } from "common/build-api-schema";
import { CalendarDays } from "lucide-react";

import { CBadge } from "@m/core/components/CBadge";

import { usePeriodMap } from "../hooks/usePeriodMap";

export function CBadgePeriod({ value }: { value: IDtoEPeriod }) {
  const periodMap = usePeriodMap();

  return <CBadge icon={CalendarDays} value={periodMap[value].label} />;
}
