/**
 * @file: CSideMenu.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 17.10.2024
 * Last Modified Date: 17.04.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import {
  Bug,
  CircleUser,
  History,
  LayoutGrid,
  LogOut,
  Search,
} from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { Link } from "wouter";

import logo from "@/assets/images/eoms-logo.horizontal.shadow.768x227.webp";

import { CDarkThemeSwitch } from "@m/base/components/CDarkThemeSwitch";
import { VERSION } from "@m/base/constants/Version";
import { ContextSession } from "@m/base/contexts/ContextSession";
import { ContextSideMenu } from "@m/base/contexts/ContextSideMenu";
import { useLogout } from "@m/base/hooks/useLogout";
import { useNavData } from "@m/base/hooks/useNavData";
import { CExternalLink } from "@m/core/components/CExternalLink";
import { CInputString } from "@m/core/components/CInputString";
import { CLine } from "@m/core/components/CLine";
import { CNoRecord } from "@m/core/components/CNoRecord";
import { useBuffer } from "@m/core/hooks/useBuffer";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IRoutePath } from "@m/core/interfaces/IRoutePath";
import { classNames } from "@m/core/utils/classNames";

import { generateRequestGetPath } from "../api/Api";
import { CDisplayImage } from "../components/CDisplayImage";
import { isSessionAllowed } from "../utils/isSessionAllowed";
import { CNavButton } from "./CNavButton";
import { CNavLink } from "./CNavLink";
import { CNavLinkGroup } from "./CNavLinkGroup";

export function CSideMenu() {
  const { publicOrganizationInfo, session } = useContext(ContextSession);
  const { isOpen, close: handleClose } = useContext(ContextSideMenu);
  const { t } = useTranslation();

  const logout = useLogout();

  const [searchQuery, setSearchQuery] = useState("");
  const [bufferedSearch, bufferedSearchPending] = useBuffer(searchQuery);

  const navData = useNavData();
  const navDataFilteredByPermissions = useMemo(
    () =>
      navData
        .map((group) => ({
          ...group,
          list: group.list.filter((d) =>
            isSessionAllowed(session, d.permission, d.orgPlanFeature),
          ),
        }))
        .filter((d) => d.list.length),
    [navData, session],
  );

  const navDataFilteredBySearch = useMemo(() => {
    const query = bufferedSearch.trim().toLowerCase();
    if (!query) {
      return navDataFilteredByPermissions;
    }

    return navDataFilteredByPermissions
      .map((group) => {
        const filteredList = group.list.filter((item) =>
          item.label.toLowerCase().includes(query),
        );

        if (filteredList.length > 0) {
          return { ...group, list: filteredList };
        }
        return null;
      })
      .filter(Boolean) as typeof navData;
  }, [bufferedSearch, navDataFilteredByPermissions]);

  const bannerUrl = useMemo(
    () =>
      // Show banner on non-workspace domains too,
      //   that's why session is used instead of publicOrganizationInfo
      session.orgHasBanner
        ? generateRequestGetPath("/u/organization/banner/{id}", {
            path: { id: session.orgId },
          })
        : undefined,
    [session.orgHasBanner, session.orgId],
  );

  return (
    <>
      {isOpen && (
        <button
          type="button"
          tabIndex={-1}
          className="absolute top-0 bottom-0 left-0 right-0 z-20 lg:hidden bg-gray-400/50 dark:bg-gray-900/50"
          onClick={handleClose}
        />
      )}

      <div
        className={classNames(
          "lg:flex flex-col shadow-lg lg:shadow-none w-[20rem] flex-none bg-gray-50 dark:bg-gray-800 absolute z-20 h-full lg:static lg:z-auto dark:border-r dark:border-gray-900 lg:dark:border-r-0",
          isOpen ? "flex" : "hidden",
        )}
      >
        <div className="p-2 pb-0">
          <Link
            type="button"
            className="bg-gray-200 dark:bg-gray-700 p-1 w-full outline-hidden focus:x-outline rounded-md h-14 flex justify-center items-center"
            to={"/configuration/my-organization" satisfies IRoutePath}
            onClick={handleClose}
            title={session.orgDisplayName}
          >
            {bannerUrl ? (
              <CDisplayImage
                className="max-w-full max-h-full"
                src={bannerUrl}
                alt={session.orgDisplayName}
              />
            ) : (
              <div className="text-gray-600 dark:text-gray-300 line-clamp-2 leading-5">
                {session.orgDisplayName}
              </div>
            )}
          </Link>
        </div>

        <CInputString
          value={searchQuery}
          onChange={setSearchQuery}
          icon={Search}
          placeholder={t("search")}
          className="m-2 mb-0 flex-none"
        />

        <div
          className={classNames(
            "flex flex-col overflow-auto h-full px-2 pt-1 mt-1 pb-5",
            bufferedSearchPending && "opacity-50",
          )}
        >
          {import.meta.env.VITE_DEV_PAGES && (
            <div className="mb-2 flex flex-row">
              <CExternalLink
                label="API Doc"
                href={`${import.meta.env.VITE_API_URL}/ui`}
                tertiary
              />
              <CExternalLink
                label="Dev Report"
                href={`${import.meta.env.VITE_API_URL}/g/dev/report/render`}
                tertiary
              />
            </div>
          )}

          <CNavLink
            icon={LayoutGrid}
            label={t("dashboard")}
            path="/"
            onDone={handleClose}
            searchQuery={bufferedSearch.trim()}
          />

          <div className="mt-1 space-y-1 grow">
            {navDataFilteredBySearch.length === 0 ? (
              <CNoRecord className="py-8 text-center" />
            ) : (
              navDataFilteredBySearch.map((group, i) => (
                <CNavLinkGroup
                  key={i}
                  icon={group.icon}
                  label={group.label}
                  onDone={handleClose}
                  list={group.list}
                  searchQuery={bufferedSearch.trim()}
                />
              ))
            )}
          </div>

          <div className="mt-1 space-y-1">
            <div className="px-2 font-bold text-accent-800">
              <CDarkThemeSwitch />
            </div>

            <CNavLink
              icon={Bug}
              label={t("issueReportRequest")}
              path="/issue-report-request"
              onDone={handleClose}
              searchQuery={bufferedSearch.trim()}
            />

            {/* TODO remove dev check when real changelog is implemented */}
            {import.meta.env.VITE_DEV_PAGES && (
              <CNavLink
                icon={History}
                label={t("changelog")}
                path="/changelog"
                onDone={handleClose}
                searchQuery={bufferedSearch.trim()}
              />
            )}

            <CNavLink
              icon={CircleUser}
              label={t("myProfile")}
              path="/my-profile"
              onDone={handleClose}
              searchQuery={bufferedSearch.trim()}
            />

            <CNavButton
              icon={LogOut}
              label={t("logout")}
              onClick={logout}
              searchQuery={bufferedSearch.trim()}
            />

            <div className="text-sm leading-tight text-center text-gray-400">
              <CLine className="items-end justify-center mt-4">
                <img
                  className="w-32"
                  src={logo}
                  alt={import.meta.env.VITE_APP_NAME}
                />
                <div className="mb-[0.45rem]">
                  v{VERSION}-{session.workerVersion}
                </div>
              </CLine>

              {/* Hide env info on workspace domains */}
              {!publicOrganizationInfo && (
                <>
                  {import.meta.env.VITE_ENV_NAME}
                  {import.meta.env.VITE_BUILD_ID &&
                    ` - ${import.meta.env.VITE_BUILD_ID}`}
                  {import.meta.env.VITE_BUILD_TIME && (
                    <>
                      <br />
                      {import.meta.env.VITE_BUILD_TIME}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
