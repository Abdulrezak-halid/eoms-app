import { IDtoEEnergyResource } from "common/build-api-schema";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CCombobox, ICComboboxProps } from "@m/core/components/CCombobox";
import { useMapToComboList } from "@m/core/hooks/useMapToComboList";

import { useEnergyResourceMap } from "../hooks/useEnergyResourceMap";

export function CComboboxEnergyResource(
  props: Omit<ICComboboxProps<IDtoEEnergyResource>, "list">,
) {
  const { t } = useTranslation();

  const energyResourceMap = useEnergyResourceMap();

  const list = useMapToComboList(energyResourceMap);

  return (
    <CCombobox
      placeholder={t("selectAnEnergyResource")}
      {...props}
      list={list}
    />
  );
}
