import { Clock } from "lucide-react";

import { CCombobox, ICComboboxProps } from "@m/core/components/CCombobox";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { useTimezoneList } from "../hooks/useTimezoneList";

export function CComboboxTimezone(
  props: Omit<ICComboboxProps<string>, "list">,
) {
  const { t } = useTranslation();
  const timezoneList = useTimezoneList();

  return (
    <CCombobox
      icon={Clock}
      placeholder={t("selectATimezone")}
      searchable
      {...props}
      list={timezoneList}
    />
  );
}
