/**
 * @file: CTimeout.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 07.12.2024
 * Last Modified Date: 07.12.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { WifiOff } from "lucide-react";

import { useTranslation } from "@m/core/hooks/useTranslation";

import { CMessageText } from "./CMessageText";

export function CTimeout({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <CMessageText
      className={className}
      icon={WifiOff}
      value={t("msgRequestTimeout")}
      type="warning"
    />
  );
}
