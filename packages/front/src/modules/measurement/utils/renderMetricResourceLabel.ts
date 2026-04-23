import { IDtoMetricResourceLabel } from "common/build-api-schema";

import { TranslationFunc } from "@m/core/hooks/useTranslation";

import { renderInboundIntegrationTypeMap } from "../hooks/useInboundIntegrationTypeMap";
import { renderOutboundIntegrationTypeMap } from "../hooks/useOutboundIntegrationTypeMap";

export function renderMetricResourceLabel(
  t: TranslationFunc,
  label: IDtoMetricResourceLabel,
) {
  if (label.type === "USER_DEFINED") {
    return `${label.key}:${label.value}`;
  }
  switch (label.key) {
    case "SOURCE": {
      switch (label.value) {
        case "EXCEL": {
          return `${t("source")}:${t("excel")}`;
        }
        case "INBOUND_INTEGRATION":
        case "OUTBOUND_INTEGRATION": {
          return `${t("source")}:${t("integration")}`;
        }
        case "API": {
          return `${t("source")}:API`;
        }
        case "DEV_SEED": {
          return `${t("source")}:DevSeed`;
        }
        default: {
          return;
        }
      }
    }
    case "OUTBOUND_INTEGRATION_TYPE": {
      return `${t("integration")}:${renderOutboundIntegrationTypeMap(t)[label.value]?.label || label.value}`;
    }
    case "INBOUND_INTEGRATION_TYPE": {
      return `${t("integration")}:${renderInboundIntegrationTypeMap(t)[label.value]?.label || label.value}`;
    }
  }
}
