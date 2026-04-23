import { IDtoEOutboundIntegrationType } from "common/build-api-schema";
import { Plug2 } from "lucide-react";

import { CBadge } from "@m/core/components/CBadge";

import { useOutboundIntegrationTypeMap } from "../hooks/useOutboundIntegrationTypeMap";

export function CBadgeOutboundIntegrationType({
  value,
}: {
  value: IDtoEOutboundIntegrationType;
}) {
  const map = useOutboundIntegrationTypeMap();

  return <CBadge icon={Plug2} value={map[value].label} />;
}
