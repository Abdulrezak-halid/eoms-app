import { EApiFailCode } from "common";
import {
  IDtoEOrganizationPlanFeature,
  IDtoEPermission,
} from "common/build-api-schema";
import { OctagonAlert, ShieldBan } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Route, Router, Switch } from "wouter";

import { routes } from "@/routes";

import { Api } from "@m/base/api/Api";
import { CSpinnerLayout } from "@m/base/components/CSpinnerLayout";
import {
  LOCAL_STORAGE_KEY_DARK_THEME,
  LOCAL_STORAGE_KEY_REPORT_SECTIONS,
} from "@m/base/constants/LocalStorageKeys";
import { ContextReport } from "@m/base/contexts/ContextReport";
import { ContextServerMaintenance } from "@m/base/contexts/ContextServerMaintenance";
import {
  ContextSession,
  IPublicOrganizationInfo,
  defaultContextSession,
} from "@m/base/contexts/ContextSession";
import { parseReportQueueSections } from "@m/base/hooks/useReport";
import {
  IReportQueueSection,
  IReportQueueSectionInput,
  IReportQueueSectionType,
} from "@m/base/interfaces/IReportQueueSection";
import { CLogin } from "@m/base/pages/CLogin";
import { CAreYouSure } from "@m/core/components/CAreYouSure";
import { CButton } from "@m/core/components/CButton";
import { CMaintenance } from "@m/core/components/CMaintenance";
import { CMessageText } from "@m/core/components/CMessageText";
import { CTimeout } from "@m/core/components/CTimeout";
import { CToastPanel } from "@m/core/components/CToastPanel";
import {
  ContextAreYouSure,
  IAreYouSureRecord,
} from "@m/core/contexts/ContextAreYouSure";
import {
  ContextNotificationBalloon,
  INotificationBalloonPushOptions,
  INotificationBalloonRecord,
  INotificationBalloonType,
  NOTIFICATION_BALLOON_DURATION_SEC,
} from "@m/core/contexts/ContextNotificationBalloon";
import { ContextTheme } from "@m/core/contexts/ContextTheme";
import {
  ContextToast,
  IToastPushOptions,
  IToastRecord,
  IToastType,
  TOAST_DURATION_SEC,
} from "@m/core/contexts/ContextToast";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IRoutePath } from "@m/core/interfaces/IRoutePath";

import { CProviderNotificationList } from "../components/CProviderNotificationList";
import { CProviderWs } from "../components/CProviderWs";
import { ContextGlobalFilter } from "../contexts/ContextGlobalFilter";
import { ContextRouteData } from "../contexts/ContextRouteData";
import {
  IDatetimeQuickRange,
  getDatetimeRangeFromQuickRange,
  isValidDatetimeQuickRange,
} from "../hooks/useQuickTimeRanges";
import { C404 } from "../pages/C404";
import { CGuardAllowedPage } from "../pages/CGuardAllowedPage";
import { CLayout } from "./CLayout";

const defaultGlobalFilterQuickRange: IDatetimeQuickRange = "LAST_7_DAYS";

export function CProviders() {
  const { t, isLoading: isTranslationLoading } = useTranslation();

  // Theme
  // --------------------------------------------------------------------
  const [darkTheme, setDarkThemeInternal] = useState(() => {
    const localValue = localStorage.getItem(LOCAL_STORAGE_KEY_DARK_THEME);
    if (localValue !== null) {
      return Boolean(localValue);
    }
    // Detect system preference
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  const setDarkTheme = useCallback((value: boolean) => {
    setDarkThemeInternal(value);
    if (value) {
      localStorage.setItem(LOCAL_STORAGE_KEY_DARK_THEME, "1");
      return;
    }
    localStorage.setItem(LOCAL_STORAGE_KEY_DARK_THEME, "");
  }, []);
  const contextThemeValue = useMemo(
    () => ({ dark: darkTheme, setDark: setDarkTheme }),
    [darkTheme, setDarkTheme],
  );
  useEffect(() => {
    if (darkTheme) {
      document.body.classList.add("dark");
      // document
      //   .querySelector('meta[name="color-scheme"]')
      //   ?.setAttribute("content", "dark");
      return;
    }
    document.body.classList.remove("dark");
    // document
    //   .querySelector('meta[name="color-scheme"]')
    //   ?.setAttribute("content", "light");
  }, [darkTheme]);

  // Notification Balloons
  // --------------------------------------------------------------------
  const refNotificationBalloonIndex = useRef(0);
  const [notificationBalloonItems, setNotificationBalloonItems] = useState<
    INotificationBalloonRecord[]
  >([]);
  const removeNotificationBalloon = useCallback((id: number) => {
    setNotificationBalloonItems((d) => d.filter((v) => v.id !== id));
  }, []);
  const pushNotificationBalloon = useCallback(
    (
      message: string,
      path: IRoutePath,
      type: INotificationBalloonType = "muted",
      options?: INotificationBalloonPushOptions,
    ) => {
      const id = ++refNotificationBalloonIndex.current;
      const notification: INotificationBalloonRecord = {
        id,
        type,
        icon: options?.icon,
        message,
        path,
        timer: options?.controlled
          ? null
          : window.setTimeout(() => {
              removeNotificationBalloon(id);
            }, NOTIFICATION_BALLOON_DURATION_SEC * 1000),
        creation: new Date().getTime(),
      };
      setNotificationBalloonItems((d) => [...d, notification]);
      return id;
    },
    [removeNotificationBalloon],
  );
  const contextNotificationBalloonValue = useMemo(
    () => ({
      items: notificationBalloonItems,
      push: pushNotificationBalloon,
      remove: removeNotificationBalloon,
    }),
    [
      pushNotificationBalloon,
      removeNotificationBalloon,
      notificationBalloonItems,
    ],
  );

  // Toast
  // --------------------------------------------------------------------
  const refToastIndex = useRef(0);
  const [toastItems, setToastItems] = useState<IToastRecord[]>([]);
  const removeToast = useCallback((id: number) => {
    setToastItems((d) => d.filter((v) => v.id !== id));
  }, []);
  const pushToast = useCallback(
    (
      message: string,
      type: IToastType = "success",
      options?: IToastPushOptions,
    ) => {
      const id = ++refToastIndex.current;
      const notification: IToastRecord = {
        id,
        type,
        icon: options?.icon,
        message,
        timer: options?.controlled
          ? null
          : window.setTimeout(() => {
              removeToast(id);
            }, TOAST_DURATION_SEC * 1000),
      };
      setToastItems((d) => [...d, notification]);
      return id;
    },
    [removeToast],
  );
  const contextToastValue = useMemo(
    () => ({
      items: toastItems,
      push: pushToast,
      remove: removeToast,
    }),
    [pushToast, removeToast, toastItems],
  );
  // TODO
  // useEffect(() => {
  //   return () => {
  //     for (const notification of notifications) {
  //       if (notification.timer) {
  //         window.cleeomsmeout(notification.timer);
  //       }
  //     }
  //   };
  // }, []);

  // Are You Sure
  // --------------------------------------------------------------------
  const [areYouSureItems, setAreYouSureItems] = useState<IAreYouSureRecord[]>(
    [],
  );
  const pushAreYouSureItem = useCallback(
    (message: string | null, cb: () => void) => {
      return new Promise<void>((res) => {
        setAreYouSureItems((d) => [...d, { message, cb, resolver: res }]);
      });
    },
    [],
  );
  const removeAreYouSureItem = useCallback((item: IAreYouSureRecord) => {
    setAreYouSureItems((d) => d.filter((v) => v !== item));
    item.resolver();
  }, []);
  const contextAreYouSureValue = useMemo(
    () => ({
      items: areYouSureItems,
      push: pushAreYouSureItem,
      remove: removeAreYouSureItem,
    }),
    [areYouSureItems, pushAreYouSureItem, removeAreYouSureItem],
  );

  // Session
  // --------------------------------------------------------------------
  const [session, setSession] = useState(defaultContextSession);
  const [publicOrganizationInfo, setPublicOrganizationInfo] =
    useState<IPublicOrganizationInfo | null>(null);
  const [workerBuildId, setWorkerBuildId] = useState<string>();
  const clearSession = useCallback(() => {
    setSession(defaultContextSession);
  }, []);
  const contextSessionValue = useMemo(
    () => ({
      publicOrganizationInfo,
      session,
      setSession,
      clearSession,
    }),
    [publicOrganizationInfo, session, clearSession],
  );
  // Here is to push terminate message avoiding duplicate.
  const refLastSession = useRef(session);
  useEffect(() => {
    if (
      session === defaultContextSession &&
      refLastSession.current !== defaultContextSession
    ) {
      pushToast(t("sessionTerminated"), "muted");
    }
    refLastSession.current = session;
  }, [pushToast, t, session]);

  // Global Filter
  // --------------------------------------------------------------------
  const [globalFilterSelectedQuickRange, setGlobalFilterSelectedQuickRange] =
    useState<IDatetimeQuickRange | undefined>(() => {
      // Set initial value from url if available
      const params = new URLSearchParams(window.location.search);
      const dtRange = (params.get("dtRange") || "").toUpperCase();
      if (isValidDatetimeQuickRange(dtRange)) {
        return dtRange;
      }
      const dtMin = params.get("dtMin");
      const dtMax = params.get("dtMax");
      if (
        dtMin &&
        dtMax &&
        !isNaN(new Date(dtMin).getTime()) &&
        !isNaN(new Date(dtMax).getTime())
      ) {
        return undefined;
      }
      return defaultGlobalFilterQuickRange;
    });
  const [globalFilterCustomDatetimeMin, setGlobalFilterCustomDatetimeMin] =
    useState<string | undefined>(() => {
      // Set initial value from url if available
      const params = new URLSearchParams(window.location.search);
      if (params.get("dtRange")) {
        return undefined;
      }
      const dtMin = params.get("dtMin");
      return dtMin && !isNaN(new Date(dtMin).getTime()) ? dtMin : undefined;
    });
  const [globalFilterCustomDatetimeMax, setGlobalFilterCustomDatetimeMax] =
    useState<string | undefined>(() => {
      // Set initial value from url if available
      const params = new URLSearchParams(window.location.search);
      if (params.get("dtRange")) {
        return undefined;
      }
      const dtMax = params.get("dtMax");
      return dtMax && !isNaN(new Date(dtMax).getTime()) ? dtMax : undefined;
    });
  const [
    globalFilterDatetimeRefreshTrigger,
    setGlobalFilterDatetimeRefreshTrigger,
  ] = useState(false);
  const triggerGlobalFilterDatetimeRefresh = useCallback(() => {
    setGlobalFilterDatetimeRefreshTrigger((d) => !d);
  }, []);

  useEffect(() => {
    // Sync selected quick range with the URL
    const params = new URLSearchParams(window.location.search);
    if (globalFilterSelectedQuickRange === defaultGlobalFilterQuickRange) {
      params.delete("dtRange");
      params.delete("dtMin");
      params.delete("dtMax");
    } else if (globalFilterSelectedQuickRange !== undefined) {
      params.set("dtRange", globalFilterSelectedQuickRange.toLowerCase());
      params.delete("dtMin");
      params.delete("dtMax");
    } else {
      params.delete("dtRange");
      if (globalFilterCustomDatetimeMin) {
        params.set("dtMin", globalFilterCustomDatetimeMin);
      } else {
        params.delete("dtMin");
      }
      if (globalFilterCustomDatetimeMax) {
        params.set("dtMax", globalFilterCustomDatetimeMax);
      } else {
        params.delete("dtMax");
      }
    }
    const newSearch = params.toString();
    const newUrl = newSearch
      ? `${window.location.pathname}?${newSearch}${window.location.hash}`
      : `${window.location.pathname}${window.location.hash}`;
    window.history.replaceState(null, "", newUrl);
  }, [
    globalFilterSelectedQuickRange,
    globalFilterCustomDatetimeMin,
    globalFilterCustomDatetimeMax,
  ]);

  const getGlobalFilterDatetimeRange = useCallback(() => {
    void globalFilterDatetimeRefreshTrigger;

    if (globalFilterSelectedQuickRange === undefined) {
      return {
        datetimeMin: globalFilterCustomDatetimeMin || "",
        datetimeMax: globalFilterCustomDatetimeMax || "",
      };
    }

    return getDatetimeRangeFromQuickRange(globalFilterSelectedQuickRange);
  }, [
    globalFilterCustomDatetimeMax,
    globalFilterCustomDatetimeMin,
    globalFilterDatetimeRefreshTrigger,
    globalFilterSelectedQuickRange,
  ]);

  const contextGlobalFilterValue = useMemo(
    () => ({
      selectedQuickRange: globalFilterSelectedQuickRange,
      getDatetimeRange: getGlobalFilterDatetimeRange,
      setCustomDatetimeMin: setGlobalFilterCustomDatetimeMin,
      setCustomDatetimeMax: setGlobalFilterCustomDatetimeMax,
      setSelectedQuickRange: setGlobalFilterSelectedQuickRange,
      triggerDatetimeRefresh: triggerGlobalFilterDatetimeRefresh,
    }),
    [
      getGlobalFilterDatetimeRange,
      globalFilterSelectedQuickRange,
      triggerGlobalFilterDatetimeRefresh,
    ],
  );

  // Report
  // --------------------------------------------------------------------
  const [reportSections, setReportSections] = useState<IReportQueueSection[]>(
    () =>
      parseReportQueueSections(
        window.localStorage.getItem(LOCAL_STORAGE_KEY_REPORT_SECTIONS),
      ),
  );

  const hasReportSectionType = useCallback(
    (type: IReportQueueSectionType) =>
      reportSections.some((d) => d.type === type),
    [reportSections],
  );

  const addReportSection = useCallback(
    (section: IReportQueueSectionInput) => {
      if (reportSections.find((d) => d.type === section.type)) {
        return false;
      }

      setReportSections((d) => [...d, { ...section, createdAt: Date.now() }]);
      return true;
    },
    [reportSections],
  );

  const removeReportSectionByType = useCallback(
    (type: IReportQueueSectionType) => {
      setReportSections((d) => d.filter((v) => v.type !== type));
    },
    [],
  );

  const removeReportSectionsByType = useCallback(
    (types: IReportQueueSectionType[]) => {
      setReportSections((d) => d.filter((v) => !types.includes(v.type)));
    },
    [],
  );

  const clearReportSections = useCallback(() => {
    setReportSections([]);
  }, []);

  const contextReportValue = useMemo(
    () => ({
      sections: reportSections,
      addSection: addReportSection,
      removeSectionByType: removeReportSectionByType,
      removeSectionsByType: removeReportSectionsByType,
      clearSections: clearReportSections,
      hasSectionType: hasReportSectionType,
    }),
    [
      addReportSection,
      clearReportSections,
      hasReportSectionType,
      removeReportSectionByType,
      removeReportSectionsByType,
      reportSections,
    ],
  );

  useEffect(() => {
    window.localStorage.setItem(
      LOCAL_STORAGE_KEY_REPORT_SECTIONS,
      JSON.stringify(reportSections),
    );
  }, [reportSections]);

  // State
  // --------------------------------------------------------------------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    // Enabling loading or removing error causes error message component
    //   unmount and not working retry lock, also not good for flickering
    //   loading
    // setLoading(true);
    // setError(null);

    if (import.meta.env.VITE_NO_LOGIN) {
      setLoading(false);
      setError(null);
      setSession(defaultContextSession);
      setWorkerBuildId(import.meta.env.VITE_BUILD_ID);
      return;
    }

    // TODO try is for that Api may throw an error that cannot parse json when
    //   a non-json content is loaded.
    try {
      const res = await Api.GET("/g/session");
      if (res.data) {
        setError(null);
        // If session is null, user is unauthorized
        setSession(res.data.session || defaultContextSession);
        setPublicOrganizationInfo(res.data.publicOrganizationInfo);
        setWorkerBuildId(res.data.buildId);
      } else {
        // When server cannot be reached, err is empty string
        setError(res.error || EApiFailCode.UNKNOWN);
        setSession(defaultContextSession);
      }
    } catch (e) {
      void e;
      setError(EApiFailCode.UNKNOWN);
      setSession(defaultContextSession);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // For maintenance context
  const enableMaintenance = useCallback(() => {
    setError(EApiFailCode.MAINTENANCE);
  }, []);

  const retry = useCallback(async () => {
    await load();
    await new Promise((res) => {
      setTimeout(res, 3000);
    });
  }, [load]);

  const [updateVersionBusy, setUpdateVersionBusy] = useState(false);
  const updateVersion = useCallback(() => {
    window.location.href = `${window.location.protocol}//${
      window.location.host
    }/?build=${import.meta.env.VITE_BUILD_ID}`;
    setUpdateVersionBusy(true);
  }, []);

  // Note: Loading screens are insensitive to theme,
  //   and all other screens are responsible to set its own background color
  return (
    <ContextTheme.Provider value={contextThemeValue}>
      <ContextNotificationBalloon.Provider
        value={contextNotificationBalloonValue}
      >
        <ContextToast.Provider value={contextToastValue}>
          <ContextAreYouSure.Provider value={contextAreYouSureValue}>
            <ContextSession.Provider value={contextSessionValue}>
              <ContextGlobalFilter.Provider value={contextGlobalFilterValue}>
                <ContextReport.Provider value={contextReportValue}>
                  <ContextServerMaintenance.Provider value={enableMaintenance}>
                    <CProviderWs>
                      <CAreYouSure />
                      <CToastPanel />

                      {error && !isTranslationLoading ? (
                        <div className="h-full flex flex-col justify-center items-center space-y-6 bg-gray-200 dark:bg-gray-800">
                          {error === EApiFailCode.MAINTENANCE ? (
                            <CMaintenance />
                          ) : error === EApiFailCode.NOT_FOUND ? (
                            <CMessageText
                              icon={ShieldBan}
                              value={t("msgOrganizationIsNotFound")}
                              type="warning"
                            />
                          ) : error === EApiFailCode.TIMEOUT ? (
                            <CTimeout />
                          ) : (
                            <CMessageText
                              icon={OctagonAlert}
                              type="error"
                              value={t("cannotConnectServer")}
                            />
                          )}
                          {error !== EApiFailCode.MAINTENANCE &&
                            error !== EApiFailCode.NOT_FOUND && (
                              <CButton label={t("retry")} onClick={retry} />
                            )}
                        </div>
                      ) : loading || isTranslationLoading ? (
                        <div className="h-full flex justify-center items-center">
                          <CSpinnerLayout
                            msg={
                              isTranslationLoading
                                ? undefined
                                : t("connectingServer")
                            }
                          />
                        </div>
                      ) : workerBuildId !== import.meta.env.VITE_BUILD_ID ? (
                        <div className="h-full flex flex-col justify-center items-center space-y-6 bg-gray-200 dark:bg-gray-800">
                          <div>{t("msgNewVersionAvailable")}</div>
                          <CButton
                            label={t("update")}
                            onClick={updateVersion}
                            disabled={updateVersionBusy}
                          />
                        </div>
                      ) : !contextSessionValue.session.userDisplayName &&
                        !import.meta.env.VITE_NO_LOGIN ? (
                        <CLogin />
                      ) : (
                        <CProviderNotificationList>
                          <CLayout>
                            <Router>
                              <Switch>
                                {routes.map((d) => (
                                  <Route key="route" path={d.path}>
                                    {/* TODO */}
                                    <ContextRouteData.Provider value={d}>
                                      <CGuardAllowedPage
                                        Component={d.component}
                                        // TODO
                                        permission={
                                          (
                                            d as {
                                              permission?: IDtoEPermission;
                                            }
                                          ).permission
                                        }
                                        // TODO
                                        orgPlanFeature={
                                          (
                                            d as {
                                              orgPlanFeature?: IDtoEOrganizationPlanFeature;
                                            }
                                          ).orgPlanFeature
                                        }
                                      />
                                    </ContextRouteData.Provider>
                                  </Route>
                                ))}
                                <Route component={C404} />
                              </Switch>
                            </Router>
                          </CLayout>
                        </CProviderNotificationList>
                      )}
                    </CProviderWs>
                  </ContextServerMaintenance.Provider>
                </ContextReport.Provider>
              </ContextGlobalFilter.Provider>
            </ContextSession.Provider>
          </ContextAreYouSure.Provider>
        </ContextToast.Provider>
      </ContextNotificationBalloon.Provider>
    </ContextTheme.Provider>
  );
}
