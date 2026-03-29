import { Save } from "lucide-react";

import { CButton } from "@m/core/components/CButton";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CButtonSave(props: { disabled?: boolean; label?: string }) {
  const { t } = useTranslation();

  return (
    <CButton
      primary
      submit
      icon={Save}
      label={props.label || t("save")}
      disabled={props.disabled}
    />
  );
}
