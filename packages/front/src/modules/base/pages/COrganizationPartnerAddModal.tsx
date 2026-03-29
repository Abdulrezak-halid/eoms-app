import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { CButton } from "@m/core/components/CButton";
import { CForm } from "@m/core/components/CForm";
import {
  CFormFooter,
  CFormLine,
  CFormPanel,
} from "@m/core/components/CFormPanel";
import { CInputString } from "@m/core/components/CInputString";
import { CModal } from "@m/core/components/CModal";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "../api/Api";
import { CButtonSave } from "../components/CButtonSave";
import { useApiToast } from "../hooks/useApiToast";

interface IPartnerAddModalProps {
  onSuccess: () => Promise<void>;
}

export function COrganizationPartnerAddModal({
  onSuccess,
}: IPartnerAddModalProps) {
  const { t } = useTranslation();
  const apiToast = useApiToast();

  const inputToken = useInput<string>();
  const invalidForm = useInputInvalid(inputToken);
  const [visible, setVisible] = useState(false);

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);

  const handleSubmit = useCallback(async () => {
    if (invalidForm) {
      return;
    }
    const res = await Api.POST("/u/organization/partner/item", {
      body: { token: inputToken.value! },
    });
    apiToast(res);
    if (res.error === undefined) {
      inputToken.onChange(undefined);
      close();
      await onSuccess();
    }
  }, [invalidForm, inputToken, apiToast, close, onSuccess]);

  return (
    <>
      <CButton icon={Plus} label={t("addPartner")} onClick={open} hideLabelLg />

      {visible && (
        <CModal onClickBg={close}>
          <CForm onSubmit={handleSubmit}>
            <CFormPanel>
              <CFormLine label={t("token")} invalidMsg={inputToken.invalidMsg}>
                <CInputString
                  {...inputToken}
                  placeholder={t("token")}
                  required
                />
              </CFormLine>
              <CFormFooter>
                <CButton label={t("cancel")} onClick={close} />
                <CButtonSave disabled={invalidForm} />
              </CFormFooter>
            </CFormPanel>
          </CForm>
        </CModal>
      )}
    </>
  );
}
