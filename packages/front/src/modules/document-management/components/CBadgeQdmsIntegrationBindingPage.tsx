import { IDtoEQdmsIntegrationBindingPage } from "common/build-api-schema";
import { File } from "lucide-react";

import { CBadge } from "@m/core/components/CBadge";

import { useQdmsIntegrationBindingPageMap } from "../hooks/useQdmsIntegrationBindingPageMap";

export function CBadgeQdmsIntegrationBindingPage({
  value,
}: {
  value: IDtoEQdmsIntegrationBindingPage;
}) {
  const QdmsIntegrationBindingPageMap = useQdmsIntegrationBindingPageMap();

  return (
    <CBadge icon={File} value={QdmsIntegrationBindingPageMap[value].label} />
  );
}
