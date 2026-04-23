import { TriangleAlert } from "lucide-react";

import { CMessageText } from "@m/core/components/CMessageText";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CMessageSelectDateRange() {
  const { t } = useTranslation();

  return (
    <CMessageText
      className="py-12"
      icon={TriangleAlert}
      type="warning"
      value={t("pleaseSelectDateRange")}
    />
  );
}
