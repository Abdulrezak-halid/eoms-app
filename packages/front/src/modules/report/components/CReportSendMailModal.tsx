import { Mail } from "lucide-react";
import { useCallback, useContext, useMemo, useState } from "react";

import { Api } from "@m/base/api/Api";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { ContextSession } from "@m/base/contexts/ContextSession";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CCheckbox } from "@m/core/components/CCheckbox";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputMultiEmail } from "@m/core/components/CInputMultiEmail";
import { CModal } from "@m/core/components/CModal";
import { CMutedText } from "@m/core/components/CMutedText";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CReportSendMailForm({
  reportId,
  reportTitle,
  onClose,
  onSuccess,
}: {
  reportId: string;
  reportTitle: string;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { t } = useTranslation();
  const apiToast = useApiToast();
  const { session } = useContext(ContextSession);
  const userEmail = session.userEmail;
  const orgEmail = session.orgEmail;

  const [selectedPresets, setSelectedPresets] = useState<{
    user: boolean;
    org: boolean;
  }>({
    user: false,
    org: false,
  });
  const [customEmails, setCustomEmails] = useState<string[]>([]);

  const recipients = useMemo(() => {
    const values = [
      selectedPresets.user ? userEmail : "",
      selectedPresets.org ? orgEmail : "",
      ...customEmails,
    ].filter(Boolean);

    return Array.from(new Set(values));
  }, [
    selectedPresets.user,
    selectedPresets.org,
    userEmail,
    orgEmail,
    customEmails,
  ]);

  const handleSelectUserEmail = useCallback((selected: boolean) => {
    setSelectedPresets((prev) => ({
      ...prev,
      user: selected,
    }));
  }, []);

  const handleSelectOrgEmail = useCallback((selected: boolean) => {
    setSelectedPresets((prev) => ({
      ...prev,
      org: selected,
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    const requests = recipients.map((email) =>
      Api.POST("/u/report/send/{reportId}", {
        params: { path: { reportId } },
        body: { email },
      }),
    );

    const results = await Promise.all(requests);
    const firstError = results.find((res) => res.error);

    if (firstError) {
      apiToast(firstError);
      return;
    }

    apiToast({ error: undefined }, t("reportSent"));
    onClose();
    onSuccess?.();
  }, [recipients, reportId, apiToast, t, onClose, onSuccess]);

  return (
    <CModal onClickBg={onClose}>
      <CForm onSubmit={handleSubmit}>
        <CFormPanel>
          <CFormLine label={t("report")}>
            <CMutedText>{reportTitle}</CMutedText>
          </CFormLine>

          <CFormLine label={t("recipients")}>
            <div className="mb-4 space-y-1">
              <CCheckbox
                selected={selectedPresets.user}
                onChange={handleSelectUserEmail}
                icon={Mail}
                label={userEmail}
              />
              {orgEmail ? (
                <CCheckbox
                  selected={selectedPresets.org}
                  onChange={handleSelectOrgEmail}
                  icon={Mail}
                  label={orgEmail}
                />
              ) : null}
            </div>

            <div className="mt-4">
              <CFormLine label={t("customEmails")}>
                <CInputMultiEmail
                  value={customEmails}
                  onChange={setCustomEmails}
                  placeholder={t("customEmails")}
                />
              </CFormLine>
            </div>
          </CFormLine>

          {recipients.length > 0 && (
            <div className="space-y-1">
              {recipients.map((email) => (
                <div key={email} className="text-gray-500">
                  ✓ {email}
                </div>
              ))}
            </div>
          )}

          <CFormFooterSaveUpdate
            onCancel={onClose}
            disabled={recipients.length === 0}
          />
        </CFormPanel>
      </CForm>
    </CModal>
  );
}
