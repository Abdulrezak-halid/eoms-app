import { IUnit } from "common";

import { CBadge } from "@m/core/components/CBadge";

import { useUnitMap } from "../hooks/useUnitMap";

export function CBadgeUnit({ value }: { value: IUnit }) {
  const unitMap = useUnitMap();
  const info = unitMap[value];

  return <CBadge icon={info?.icon} value={info?.label} noTruncate />;
}
