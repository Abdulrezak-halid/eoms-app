import { BookOpen, Menu, MousePointer2 } from "lucide-react";
import { useContext, useEffect, useMemo } from "react";

import { CButton } from "@m/core/components/CButton";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { useRoutePath } from "@m/core/hooks/useRoutePath";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { ContextSideMenu } from "../contexts/ContextSideMenu";
import { CBodyNotificationLink } from "./CBodyNotificationLink";
import { CBodyUserDropdown } from "./CBodyUserDropdown";
import { CBreadCrumbs, IBreadCrumb } from "./CBreadCrumbs";
import { CHeaderReportQueue } from "./CHeaderReportQueue";
import { CLanguageSelector } from "./CLanguageSelector";
import { CWsIndicator } from "./CWsIndicator";

export function CBodyHeader({
  breadcrumbs,
  title,
  hasMarkdownPanelContent,
  isMarkdownPanelVisible,
  toggleMarkdownPanel,
}: {
  breadcrumbs?: IBreadCrumb[];
  title?: string;
  hasMarkdownPanelContent: boolean;
  isMarkdownPanelVisible: boolean;
  toggleMarkdownPanel: () => void;
}) {
  const { t } = useTranslation();
  const { open } = useContext(ContextSideMenu);

  const routePath = useRoutePath();
  const isCurrentPageQuickNavigation = routePath === "/quick-navigation";

  const breadcrumbsInternal = useMemo(
    () => breadcrumbs || (title ? [{ label: title }] : undefined),
    [breadcrumbs, title],
  );

  useEffect(() => {
    const titleMain = `${import.meta.env.VITE_APP_NAME} [${import.meta.env.VITE_ENV_NAME}]`;
    if (!breadcrumbsInternal) {
      window.document.title = titleMain;
      return;
    }

    // const oldTitle = window.document.title;
    window.document.title = `${titleMain} - ${breadcrumbsInternal
      .map((d) => d.label)
      .filter(Boolean)
      .join(" > ")}`;
    // return () => {
    //   window.document.title = oldTitle;
    // };
  }, [breadcrumbsInternal]);

  return (
    <CLine className="pr-2 min-h-16 flex-none @container">
      <CLine className="grow p-2 overflow-hidden">
        <CButton icon={Menu} className="lg:hidden mr-2" onClick={open} />

        {/* padding is to not clip outlines */}
        <div className="grow p-2 -m-2 overflow-hidden">
          {breadcrumbsInternal && <CBreadCrumbs value={breadcrumbsInternal} />}
        </div>
      </CLine>

      <div className="ml-auto flex items-center">
        {import.meta.env.VITE_DEV_PAGES && <CWsIndicator />}

        {hasMarkdownPanelContent && (
          <CButton
            className="2xl:hidden"
            icon={BookOpen}
            onClick={toggleMarkdownPanel}
            primary={isMarkdownPanelVisible}
          />
        )}

        <CHeaderReportQueue />

        <CBodyNotificationLink />

        <CLink
          icon={MousePointer2}
          label={t("quickNavigation")}
          path="/quick-navigation"
          hideLabelLg
          tertiary
          primary={isCurrentPageQuickNavigation}
        />

        {import.meta.env.VITE_DEV_PAGES && <CLanguageSelector hideLabelLg />}

        <CBodyUserDropdown />
      </div>
    </CLine>
  );
}
