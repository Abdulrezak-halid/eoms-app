import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { ContextSideMenu } from "@m/base/contexts/ContextSideMenu";
import { CSomethingWentWrong } from "@m/core/components/CSomethingWentWrong";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CBody } from "../components/CBody";
import { CQuickSearchPanel } from "../components/CQuickSearchPanel";
import { CSideMenu } from "./CSideMenu";

export function CLayout({ children }: PropsWithChildren) {
  const { t } = useTranslation();

  const [isSideMenuOpen, setSideMenuOpen] = useState(false);
  const openSideMenu = useCallback(() => {
    setSideMenuOpen(true);
  }, []);
  const closeSideMenu = useCallback(() => {
    setSideMenuOpen(false);
  }, []);
  const contextSideMenuValue = useMemo(
    () => ({
      isOpen: isSideMenuOpen,
      open: openSideMenu,
      close: closeSideMenu,
    }),
    [isSideMenuOpen, openSideMenu, closeSideMenu],
  );

  return (
    <ContextSideMenu.Provider value={contextSideMenuValue}>
      <CQuickSearchPanel />

      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-800">
        {import.meta.env.VITE_DEMO && (
          <div className="bg-accent-600 dark:bg-accent-700 text-white text-center py-2 px-4 text-sm flex-none">
            {t("msgDemoMode")}
          </div>
        )}

        <div className="grow flex overflow-hidden relative">
          <CSideMenu />
          <div className="grow flex flex-col overflow-hidden z-0">
            <div className="grow overflow-hidden">
              <ErrorBoundary FallbackComponent={CErrorBoundaryFallback}>
                {children}
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </ContextSideMenu.Provider>
  );
}

function CErrorBoundaryFallback() {
  return (
    <CBody>
      <CSomethingWentWrong className="h-full" />
    </CBody>
  );
}
