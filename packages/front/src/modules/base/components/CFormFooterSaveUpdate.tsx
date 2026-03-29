import { PropsWithChildren } from "react";

import { CButton } from "@m/core/components/CButton";
import { CFormFooter } from "@m/core/components/CFormPanel";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CButtonSave } from "./CButtonSave";
import { CButtonUpdate } from "./CButtonUpdate";

export function CFormFooterSaveUpdate({
  labelSave,
  isUpdate,
  disabled,
  onCancel,
  children,
}: PropsWithChildren<{
  labelSave?: string;
  isUpdate?: boolean;
  disabled?: boolean;
  onCancel?: () => void;
}>) {
  const { t } = useTranslation();

  return (
    <CFormFooter>
      {children}
      {onCancel && <CButton onClick={onCancel} label={t("cancel")} />}
      {isUpdate ? (
        <CButtonUpdate disabled={disabled} />
      ) : (
        <CButtonSave label={labelSave} disabled={disabled} />
      )}
    </CFormFooter>
  );
}
