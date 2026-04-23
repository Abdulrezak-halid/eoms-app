import { IDtoEPlanType } from "common/build-api-schema";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CCombobox, ICComboboxProps } from "@m/core/components/CCombobox";
import { useMapToComboList } from "@m/core/hooks/useMapToComboList";

import { usePlanTypeMap } from "../hooks/usePlanTypeMap";

export function CComboboxPlanType(
  props: Omit<ICComboboxProps<IDtoEPlanType>, "list">,
) {
  const { t } = useTranslation();

  const planTypeMap = usePlanTypeMap();

  const list = useMapToComboList(planTypeMap);

  return (
    <CCombobox placeholder={t("selectAPlanType")} {...props} list={list} />
  );
}
