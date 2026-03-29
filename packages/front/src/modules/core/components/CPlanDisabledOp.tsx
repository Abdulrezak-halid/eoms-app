import { Ban } from "lucide-react";

import { useTranslation } from "@m/core/hooks/useTranslation";

import { CMessageText } from "./CMessageText";

export function CPlanDisabledOp({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <CMessageText
      className={className}
      icon={Ban}
      value={t("planDisabledOp")}
      type="warning"
    />
  );
}
