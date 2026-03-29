import { Link } from "wouter";

import { CHighlightedMatchText } from "@m/core/components/CHighlightedMatchText";

export function CQuickNavigationLink({
  label,
  path,
  searchQuery,
}: {
  label: string;
  path: string;
  searchQuery?: string;
}) {
  return (
    <Link
      to={path}
      className="w-36 h-24 text-center flex justify-center items-center bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 px-3 rounded-md shadow-md"
    >
      <div className="line-clamp-3 text-accent-700 dark:text-accent-200 font-bold">
        <CHighlightedMatchText value={label} query={searchQuery} />
      </div>
    </Link>
  );
}
