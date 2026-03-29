import { CCombobox, ICComboboxProps } from "@m/core/components/CCombobox";
import { useMapToComboList } from "@m/core/hooks/useMapToComboList";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { useWeatherApiOutputTypeMap } from "../hooks/useWeatherApiOutputTypeMap";
import { IWeatherApiOutputType } from "../interfaces/IWeatherApiOutputType";

export function CComboboxWeatherApiOutputType(
  props: Omit<ICComboboxProps<IWeatherApiOutputType>, "list">,
) {
  const { t } = useTranslation();

  const map = useWeatherApiOutputTypeMap();
  const list = useMapToComboList(map);

  return (
    <CCombobox
      placeholder={t("selectAWeatherApiType")}
      {...props}
      list={list}
    />
  );
}
