import { IDtoEQdmsIntegrationBindingPage } from "common/build-api-schema";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CCombobox, ICComboboxProps } from "@m/core/components/CCombobox";
import { useMapToComboList } from "@m/core/hooks/useMapToComboList";

import { useQdmsIntegrationBindingPageMap } from "../hooks/useQdmsIntegrationBindingPageMap";

export function CComboboxQdmsIntegrationBindingPage(
  props: Omit<ICComboboxProps<IDtoEQdmsIntegrationBindingPage>, "list">,
) {
  const { t } = useTranslation();

  const qdmsIntegrationBindingPageMap = useQdmsIntegrationBindingPageMap();

  const list = useMapToComboList(qdmsIntegrationBindingPageMap);

  return (
    <CCombobox placeholder={t("selectABindingPage")} {...props} list={list} />
  );
}
