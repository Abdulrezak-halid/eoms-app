import { IUnitGroup } from "common";

import { CBadge } from "@m/core/components/CBadge";

import { useUnitGroupMap } from "../hooks/useUnitGroupMap";

export function CBadgeUnitGroup({ value }: { value: IUnitGroup }) {
  const unitGroupMap = useUnitGroupMap();
  const info = unitGroupMap[value];

  return <CBadge icon={info?.icon} value={info?.label} />;
}
