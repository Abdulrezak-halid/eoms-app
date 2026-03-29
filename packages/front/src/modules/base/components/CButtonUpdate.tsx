import { SaveAll } from "lucide-react";

import { CButton } from "@m/core/components/CButton";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CButtonUpdate(props: { disabled?: boolean }) {
  const { t } = useTranslation();

  return (
    <CButton
      primary
      submit
      icon={SaveAll}
      label={t("update")}
      disabled={props.disabled}
    />
  );
}
