import { useTranslation } from "@m/core/hooks/useTranslation";

import { CCombobox, ICComboboxProps } from "@m/core/components/CCombobox";
import { useMapToComboList } from "@m/core/hooks/useMapToComboList";
import { useDataViewTypeMap } from "@m/sys/hooks/useDataViewType";

import { IDtoEDataViewType } from "../interfaces/IDtoDataViewProfile";

export function CComboboxDataViewType(
  props: Omit<ICComboboxProps<IDtoEDataViewType>, "list">,
) {
  const { t } = useTranslation();

  const dataViewTypeMap = useDataViewTypeMap();
  const dataViewTypeList = useMapToComboList(dataViewTypeMap);

  return (
    <CCombobox
      placeholder={t("selectAMetricType")}
      {...props}
      list={dataViewTypeList}
    />
  );
}
