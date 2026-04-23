/**
 * @file: CNavLink.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 30.11.2024
 * Last Modified Date: 30.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useMemo } from "react";
import { Link, useLocation } from "wouter";

import { IconType } from "@m/core/components/CIcon";
import { IRoutePath } from "@m/core/interfaces/IRoutePath";

import { CNavButtonContainer } from "./CNavButtonContainer";

export function CNavLink({
  icon,
  label,
  path,
  highlightPath,
  onDone,
  tabIndex,
  searchQuery,
}: {
  icon?: IconType;
  label: string;
  path: IRoutePath;
  highlightPath?: string;
  onDone: () => void;
  tabIndex?: number;
  searchQuery?: string;
}) {
  const [loc] = useLocation();

  const active = useMemo(
    () =>
      ((loc === path || loc.startsWith(`${highlightPath || path}/`)) &&
        path !== "/") ||
      path === loc,
    [path, loc, highlightPath],
  );

  return (
    <Link
      to={path}
      className="outline-hidden group block"
      onClick={onDone}
      tabIndex={tabIndex}
    >
      <CNavButtonContainer
        icon={icon}
        label={label}
        active={active}
        searchQuery={searchQuery}
      />
    </Link>
  );
}
