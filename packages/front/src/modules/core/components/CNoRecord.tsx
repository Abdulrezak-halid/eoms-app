import { StickyNote } from "lucide-react";

import { useTranslation } from "@m/core/hooks/useTranslation";

import { CMessageText } from "./CMessageText";

export function CNoRecord({ className }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <CMessageText
      className={className}
      icon={StickyNote}
      value={t("noRecord")}
      type="mute"
    />
  );
}
