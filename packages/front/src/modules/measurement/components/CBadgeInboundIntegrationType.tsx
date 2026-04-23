import { IDtoEInboundIntegrationType } from "common/build-api-schema";
import { Plug } from "lucide-react";

import { CBadge } from "@m/core/components/CBadge";

import { useInboundIntegrationTypeMap } from "../hooks/useInboundIntegrationTypeMap";

export function CBadgeInboundIntegrationType({
  value,
}: {
  value: IDtoEInboundIntegrationType;
}) {
  const map = useInboundIntegrationTypeMap();

  return <CBadge icon={Plug} value={map[value].label} />;
}
