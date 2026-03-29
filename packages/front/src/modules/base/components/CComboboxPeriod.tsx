import { IDtoEPeriod } from "common/build-api-schema";
import { CalendarDays } from "lucide-react";

import { usePeriodMap } from "@m/base/hooks/usePeriodMap";
import { CCombobox, ICComboboxProps } from "@m/core/components/CCombobox";
import { useMapToComboList } from "@m/core/hooks/useMapToComboList";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CComboboxPeriod(
  props: Omit<ICComboboxProps<IDtoEPeriod>, "list">,
) {
  const { t } = useTranslation();

  const periodMap = usePeriodMap();

  const list = useMapToComboList(periodMap);

  return (
    <CCombobox
      icon={CalendarDays}
      placeholder={t("selectAPeriod")}
      {...props}
      list={list}
    />
  );
}
