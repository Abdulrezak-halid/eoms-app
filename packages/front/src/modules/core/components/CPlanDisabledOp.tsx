/**
 * @file: CPlanDisabledOp.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 17.11.2024
 * Last Modified Date: 26.03.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
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
