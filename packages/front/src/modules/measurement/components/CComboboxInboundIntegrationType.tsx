import { IDtoEInboundIntegrationType } from "common/build-api-schema";
import { Plug2 } from "lucide-react";

import { CCombobox, ICComboboxProps } from "@m/core/components/CCombobox";
import { useMapToComboList } from "@m/core/hooks/useMapToComboList";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { useInboundIntegrationTypeMap } from "../hooks/useInboundIntegrationTypeMap";

export function CComboboxInboundIntegrationType(
  props: Omit<ICComboboxProps<IDtoEInboundIntegrationType>, "list">,
) {
  const { t } = useTranslation();

  const map = useInboundIntegrationTypeMap();
  const list = useMapToComboList(map);

  return (
    <CCombobox
      icon={Plug2}
      placeholder={t("selectAMetricIntegrationInboundType")}
      {...props}
      list={list}
    />
  );
}
