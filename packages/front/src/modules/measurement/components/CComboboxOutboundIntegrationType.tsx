import { IDtoEOutboundIntegrationType } from "common/build-api-schema";
import { Plug } from "lucide-react";

import { CCombobox, ICComboboxProps } from "@m/core/components/CCombobox";
import { useMapToComboList } from "@m/core/hooks/useMapToComboList";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { useOutboundIntegrationTypeMap } from "../hooks/useOutboundIntegrationTypeMap";

export function CComboboxOutboundIntegrationType(
  props: Omit<ICComboboxProps<IDtoEOutboundIntegrationType>, "list">,
) {
  const { t } = useTranslation();

  const map = useOutboundIntegrationTypeMap();
  const list = useMapToComboList(map);

  return (
    <CCombobox
      icon={Plug}
      placeholder={t("selectAnIntegration")}
      {...props}
      list={list}
    />
  );
}
