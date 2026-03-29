/**
 * @file: CNavButtonContainer.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 30.11.2024
 * Last Modified Date: 30.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { CHighlightedMatchText } from "@m/core/components/CHighlightedMatchText";
import { CIcon, IconType } from "@m/core/components/CIcon";
import { classNames } from "@m/core/utils/classNames";

export function CNavButtonContainer({
  icon,
  label,
  active,
  searchQuery,
}: {
  icon?: IconType;
  label: string;
  active?: boolean;
  searchQuery?: string;
}) {
  return (
    <div
      // relative is for absolute active indicator
      className={classNames(
        "flex items-center space-x-2 rounded-md font-bold pr-3 py-1 min-h-12 text-accent-700 dark:text-accent-200 relative",
        "hover:bg-gray-200 dark:hover:bg-gray-700",
        "group-focus:x-outline",
        icon ? "pl-3" : "pl-5",
        active && "bg-gray-200 dark:bg-gray-700",
      )}
    >
      {active && (
        <div className="absolute top-1 left-1 bottom-1 bg-accent-600 dark:bg-accent-300 w-1.5 rounded-full" />
      )}

      {icon && <CIcon value={icon} />}

      <div className="grow text-nowrap text-ellipsis overflow-hidden">
        <CHighlightedMatchText value={label} query={searchQuery} />
      </div>
    </div>
  );
}
