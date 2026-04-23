import { IDtoEInboundIntegrationType } from "common/build-api-schema";
import { Webhook } from "lucide-react";
import { useMemo } from "react";

import { IValueLabelMap } from "@m/base/interfaces/IValueLabelMap";
import { TranslationFunc, useTranslation } from "@m/core/hooks/useTranslation";

import logoReneryoAgent from "../assets/logo-reneryoagent.webp";

export function renderInboundIntegrationTypeMap(t: TranslationFunc) {
  return {
    AGENT: { imageSrc: logoReneryoAgent, label: t("agent") },
    WEBHOOK: { icon: Webhook, label: t("webhook") },
  };
}

export function useInboundIntegrationTypeMap() {
  const { t } = useTranslation();
  return useMemo<IValueLabelMap<IDtoEInboundIntegrationType>>(
    () => renderInboundIntegrationTypeMap(t),
    [t],
  );
}
