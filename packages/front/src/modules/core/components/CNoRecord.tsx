/**
 * @file: CNoRecord.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 18.10.2024
 * Last Modified Date: 18.10.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
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
