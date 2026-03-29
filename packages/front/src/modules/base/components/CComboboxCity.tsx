import { MapPin } from "lucide-react";

import { CCombobox, ICComboboxProps } from "@m/core/components/CCombobox";
import { useMapToComboList } from "@m/core/hooks/useMapToComboList";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { useCityMap } from "../hooks/useCityMap";

export function CComboboxCity(props: Omit<ICComboboxProps<string>, "list">) {
  const { t } = useTranslation();

  const cityMap = useCityMap();

  const list = useMapToComboList(cityMap);

  return (
    <CCombobox
      icon={MapPin}
      placeholder={t("selectACity")}
      searchable
      {...props}
      list={list}
    />
  );
}
