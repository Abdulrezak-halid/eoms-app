/**
 * @file: CMaintenance.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 08.12.2024
 * Last Modified Date: 08.12.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useTranslation } from "@m/core/hooks/useTranslation";
import { Construction } from "lucide-react";

import { CMessageText } from "./CMessageText";

export function CMaintenance({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <CMessageText
      className={className}
      icon={Construction}
      value={t("msgServerMaintenance")}
      type="warning"
    />
  );
}
