import { Plus } from "lucide-react";

import { CLink } from "@m/core/components/CLink";
import { useTranslation } from "@m/core/hooks/useTranslation";

interface CLinkAddProps {
  path: React.ComponentProps<typeof CLink>["path"];
  noHideLabel?: boolean;
  disabled?: boolean;
}

export function CLinkAdd({ path, noHideLabel, disabled }: CLinkAddProps) {
  const { t } = useTranslation();

  return (
    <CLink
      icon={Plus}
      label={t("add")}
      path={path}
      hideLabelSm={!noHideLabel}
      disabled={disabled}
    />
  );
}
