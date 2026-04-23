/**
 * @file: CButtonRefresh.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 29.12.2024
 * Last Modified Date: 29.12.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { RefreshCcw } from "lucide-react";

import { CButton } from "@m/core/components/CButton";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CButtonRefresh({
  onClick,
  noHideLabel,
}: {
  onClick?: () => Promise<void>;
  noHideLabel?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <CButton
      icon={RefreshCcw}
      label={t("refresh")}
      onClick={onClick}
      disabled={!onClick}
      hideLabelSm={!noHideLabel}
    />
  );
}
