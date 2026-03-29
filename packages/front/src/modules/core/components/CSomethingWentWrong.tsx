import { useTranslation } from "@m/core/hooks/useTranslation";
import { OctagonAlert } from "lucide-react";

import { CMessageText } from "./CMessageText";

export function CSomethingWentWrong({ className }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <CMessageText
      className={className}
      icon={OctagonAlert}
      value={t("somethingWentWrong")}
      type="error"
    />
  );
}
