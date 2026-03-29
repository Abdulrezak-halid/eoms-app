/**
 * @file: CNoPermission.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 17.11.2024
 * Last Modified Date: 17.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useTranslation } from "@m/core/hooks/useTranslation";
import { Ban } from "lucide-react";

import { CMessageText } from "./CMessageText";

export function CNoPermission({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <CMessageText
      className={className}
      icon={Ban}
      value={t("youDontHavePermissionToSeeThisPage")}
      type="warning"
    />
  );
}
