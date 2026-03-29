import { IDtoEEnergyResource } from "common/build-api-schema";

import { CBadge } from "@m/core/components/CBadge";

import { useEnergyResourceMap } from "../hooks/useEnergyResourceMap";

const energyResourceConfig: Record<IDtoEEnergyResource, { className: string }> =
  {
    ELECTRIC: {
      className: "text-yellow-700 dark:text-yellow-300",
    },
    GAS: {
      className: "text-cyan-700 dark:text-cyan-300",
    },
    DIESEL: {
      className: "",
    },
    WATER: {
      className: "text-blue-700 dark:text-blue-300",
    },
    SOLID_FUEL: {
      className: "text-orange-700 dark:text-orange-300",
    },
  };

export function CBadgeEnergyResource({
  value,
}: {
  value: IDtoEEnergyResource;
}) {
  const resourceMap = useEnergyResourceMap();

  const { className } = energyResourceConfig[value];
  const info = resourceMap[value];

  return <CBadge className={className} icon={info.icon} value={info.label} />;
}
