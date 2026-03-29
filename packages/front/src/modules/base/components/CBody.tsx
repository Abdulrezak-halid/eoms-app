import { useTolgee } from "@tolgee/react";
import {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ErrorBoundary } from "react-error-boundary";

import { CLoading } from "@m/core/components/CLoading";
import { CMarkdown } from "@m/core/components/CMarkdown";
import { CNotificationBalloonPanel } from "@m/core/components/CNotificationBalloonPanel";
import { CSomethingWentWrong } from "@m/core/components/CSomethingWentWrong";
import { classNames } from "@m/core/utils/classNames";

import { ContextRouteData } from "../contexts/ContextRouteData";
import { CBodyGlobalFilterHeader } from "./CBodyGlobalFilterHeader";
import { CBodyHeader } from "./CBodyHeader";
import { IBreadCrumb } from "./CBreadCrumbs";

export function CBody({
  breadcrumbs,
  title,
  children,
  markdownPanelContent,
  noFixedWidth,
  showGlobalFilter,
  noExtraPaddingBottom,
}: PropsWithChildren<{
  breadcrumbs?: IBreadCrumb[];
  title?: string;
  markdownPanelContent?: string;
  noFixedWidth?: boolean;
  showGlobalFilter?: boolean;
  noExtraPaddingBottom?: boolean;
}>) {
  const [isMarkdownPanelVisible, setMarkdownPanelVisibility] = useState(false);
  const toggleMarkdownPanel = useCallback(() => {
    setMarkdownPanelVisibility((d) => !d);
  }, []);

  const [markdownPanelContentInternal, setMarkdownPanelContentInternal] =
    useState(markdownPanelContent);

  const routeData = useContext(ContextRouteData);
  const tolgee = useTolgee(["language"]);
  const selectedLanguage = tolgee.getLanguage();

  const hasMarkdownPanelContent = useMemo(() => {
    return Boolean(
      markdownPanelContent ||
        (selectedLanguage && routeData.manuals?.[selectedLanguage]),
    );
  }, [markdownPanelContent, routeData.manuals, selectedLanguage]);

  useEffect(() => {
    void (async () => {
      if (markdownPanelContent) {
        return;
      }
      if (!selectedLanguage) {
        return;
      }
      const url = routeData.manuals?.[selectedLanguage];
      if (!url) {
        return;
      }
      const res = await fetch(url);
      setMarkdownPanelContentInternal(await res.text());
    })();
  }, [markdownPanelContent, routeData.manuals, selectedLanguage]);

  return (
    <div className="flex flex-col h-full">
      <CBodyHeader
        title={title}
        breadcrumbs={breadcrumbs}
        hasMarkdownPanelContent={hasMarkdownPanelContent}
        isMarkdownPanelVisible={isMarkdownPanelVisible}
        toggleMarkdownPanel={toggleMarkdownPanel}
      />

      {showGlobalFilter && <CBodyGlobalFilterHeader />}

      {/* overflow-hidden is to clip rounded corners of help panel backdrop */}
      <div className="overflow-hidden grow bg-gray-100 dark:bg-gray-900 lg:rounded-tl-xl flex relative">
        {/* z-10 fixes a chrome bug, text position were shifted during scroll */}
        {/* You can test bug on user permission list page */}
        {/* z-10 is also for the ensure it is above the cbody content */}
        <div className="absolute top-0 bottom-0 z-10 left-0 lg:rounded-tl-xl right-0 border-t lg:border-l border-gray-200 dark:border-gray-900 shadow-inner pointer-events-none opacity-95" />

        <CNotificationBalloonPanel />

        <div
          className={classNames(
            "overflow-auto grow flex flex-col",
            !noFixedWidth && "items-center",
          )}
        >
          <div
            className={classNames(
              // z-0 is for the absolute shadow at the top,
              //   to make everthing in cbody is below the shadow
              "space-y-4 p-4 @container grow z-0",
              !noFixedWidth && "max-w-full w-xl",
              !noExtraPaddingBottom && "pb-16",
            )}
          >
            <ErrorBoundary FallbackComponent={CErrorBoundaryFallback}>
              {children}
            </ErrorBoundary>
          </div>
        </div>

        {hasMarkdownPanelContent && (
          <>
            {isMarkdownPanelVisible && (
              <button
                type="button"
                tabIndex={-1}
                className="absolute 2xl:hidden w-full h-full bg-gray-400/50 dark:bg-gray-900/50"
                onClick={toggleMarkdownPanel}
              />
            )}

            <div
              className={classNames(
                "w-full sm:w-112 max-w-full overflow-auto sm:border-l border-gray-200 dark:border-gray-950 p-4 absolute right-0 top-0 bottom-0 bg-gray-50 dark:bg-gray-900 2xl:flex-none 2xl:static",
                !isMarkdownPanelVisible && "hidden 2xl:block",
              )}
            >
              {!markdownPanelContentInternal ? (
                <CLoading className="h-full" />
              ) : (
                <CMarkdown value={markdownPanelContentInternal} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CErrorBoundaryFallback() {
  return <CSomethingWentWrong className="h-full" />;
}
