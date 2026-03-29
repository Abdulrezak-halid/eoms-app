import { IDtoEMetricType } from "common/build-api-schema";

import { CCombobox, ICComboboxProps } from "@m/core/components/CCombobox";
import { useMapToComboList } from "@m/core/hooks/useMapToComboList";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { useMetricTypeMap } from "../hooks/useMetricTypeMap";

export function CComboboxMetricType(
  props: Omit<ICComboboxProps<IDtoEMetricType>, "list">,
) {
  const { t } = useTranslation();

  const map = useMetricTypeMap();
  const list = useMapToComboList(map);

  return (
    <CCombobox placeholder={t("selectAMetricType")} {...props} list={list} />
  );
}
