import { useContext, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { ContextSession } from "@m/base/contexts/ContextSession";
import { useNavData } from "@m/base/hooks/useNavData";
import { CInputString } from "@m/core/components/CInputString";
import { CNoRecord } from "@m/core/components/CNoRecord";
import { useBuffer } from "@m/core/hooks/useBuffer";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { classNames } from "@m/core/utils/classNames";

import { CQuickNavigationGroup } from "../components/CQuickNavigationGroup";
import { isSessionAllowed } from "../utils/isSessionAllowed";

export default function CQuickNavigationPage() {
  const { session } = useContext(ContextSession);
  const { t } = useTranslation();

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

  const normalizedSearch = useMemo(() => {
    return bufferedSearch.trim().toLowerCase();
  }, [bufferedSearch]);

  const navDataFilteredBySearch = useMemo(() => {
    if (!normalizedSearch) {
      return navDataFilteredByPermissions;
    }

    return navDataFilteredByPermissions
      .map((group) => {
        const filteredList = group.list.filter((item) =>
          item.label.toLowerCase().includes(normalizedSearch),
        );

        if (filteredList.length > 0) {
          return { ...group, list: filteredList };
        }
        return null;
      })
      .filter(Boolean) as typeof navData;
  }, [normalizedSearch, navDataFilteredByPermissions]);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("quickNavigation") }],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs} noFixedWidth>
      <CInputString
        icon={Search}
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder={t("search")}
        className="max-w-md"
      />

      {navDataFilteredBySearch.length === 0 ? (
        <CNoRecord className="py-16 text-center" />
      ) : (
        <div
          className={classNames(
            "grid grid-cols-1 gap-6 @md:grid-cols-2 @xl:grid-cols-3",
            // "columns-1 @md:columns-2 @xl:columns-3 space-y-6 gap-6",
            bufferedSearchPending && "opacity-50",
          )}
        >
          {navDataFilteredBySearch.map((group) => (
            // <div className="break-inside-avoid" key={group.label}>
            <CQuickNavigationGroup
              key={group.label}
              icon={group.icon}
              label={group.label}
              list={group.list}
              searchQuery={normalizedSearch}
            />
            // </div>
          ))}
        </div>
      )}
    </CBody>
  );
}
