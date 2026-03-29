import { IDtoEEnergyResource } from "common/build-api-schema";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  CMultiSelect,
  ICMultiSelectProps,
} from "@m/core/components/CMultiSelect";
import { useMapToComboList } from "@m/core/hooks/useMapToComboList";

import { useEnergyResourceMap } from "../hooks/useEnergyResourceMap";

export function CMultiSelectEnergyResource(
  props: Omit<ICMultiSelectProps<IDtoEEnergyResource>, "list">,
) {
  const { t } = useTranslation();
  const energyResourceMap = useEnergyResourceMap();

  const list = useMapToComboList(energyResourceMap);

  return (
    <CMultiSelect
      placeholder={t("selectEnergyResources")}
      list={list}
      {...props}
    />
  );
}
