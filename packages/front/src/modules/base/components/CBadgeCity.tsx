import { MapPin } from "lucide-react";

import { CBadge } from "@m/core/components/CBadge";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { useCityMap } from "../hooks/useCityMap";

export function CBadgeCity({ value }: { value: string }) {
  const { t } = useTranslation();
  const cityMap = useCityMap();
  return (
    <CBadge icon={MapPin} value={cityMap[value]?.label || t("unknown")} />
  );
}
