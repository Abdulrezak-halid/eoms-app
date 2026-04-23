import { IDtoEMetricIntegrationPeriod } from "common/build-api-schema";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CCombobox, ICComboboxProps } from "@m/core/components/CCombobox";
import { useMapToComboList } from "@m/core/hooks/useMapToComboList";

import { useMetricIntegrationPeriodMap } from "../hooks/useMetricIntegrationPeriodMap";

export function CComboboxMetricIntegrationPeriod(
  props: Omit<ICComboboxProps<IDtoEMetricIntegrationPeriod>, "list">,
) {
  const { t } = useTranslation();

  const metricIntegrationPeriodMap = useMetricIntegrationPeriodMap();
  const list = useMapToComboList(metricIntegrationPeriodMap);

  return <CCombobox placeholder={t("selectAPeriod")} {...props} list={list} />;
}
