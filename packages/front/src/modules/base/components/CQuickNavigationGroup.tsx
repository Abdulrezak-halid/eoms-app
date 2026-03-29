import { CIcon, IconType } from "@m/core/components/CIcon";
import { CLine } from "@m/core/components/CLine";
import { CMutedText } from "@m/core/components/CMutedText";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IRoutePath } from "@m/core/interfaces/IRoutePath";

import { CQuickNavigationLink } from "./CQuickNavigationLink";

export function CQuickNavigationGroup({
  icon,
  label,
  list,
  searchQuery,
}: {
  icon: IconType;
  label: string;
  list: readonly {
    label: string;
    path: IRoutePath;
  }[];
  searchQuery?: string;
}) {
  const { t } = useTranslation();

  if (list.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-200 dark:bg-gray-800 rounded-md shadow-sm">
      <CLine className="p-3 pb-0 space-x-3">
        <CIcon value={icon} />
        <div className="text-gray-600 dark:text-gray-300 font-bold grow">
          {label}
        </div>
        <CMutedText>
          {list.length} {list.length === 1 ? t("item") : t("items")}
        </CMutedText>
      </CLine>

      <div className="p-4 flex flex-wrap gap-3">
        {list.map((item) => (
          <CQuickNavigationLink
            key={item.path}
            label={item.label}
            path={item.path}
            searchQuery={searchQuery}
          />
        ))}
      </div>
    </div>
  );
}
