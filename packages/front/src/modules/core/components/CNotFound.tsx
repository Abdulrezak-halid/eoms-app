import { SquareX } from "lucide-react";

import { useTranslation } from "@m/core/hooks/useTranslation";

import { CMessageText } from "./CMessageText";

export function CNotFound({ className }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <CMessageText
      className={className}
      icon={SquareX}
      value={t("notFound")}
      type="mute"
    />
  );
}
