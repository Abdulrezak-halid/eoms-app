import { useCallback, useContext } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { ContextSession } from "@m/base/contexts/ContextSession";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useNavigate } from "@m/core/hooks/useNavigate";

export function useLogout() {
  const { push } = useContext(ContextAreYouSure);
  const { clearSession } = useContext(ContextSession);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return useCallback(() => {
    // TODO void
    void push(t("msgYouAreAboutToLogout"), () => {
      clearSession();
      // TODO await
      void Api.GET("/u/logout");
      navigate("/");
    });
  }, [clearSession, navigate, push, t]);
}
