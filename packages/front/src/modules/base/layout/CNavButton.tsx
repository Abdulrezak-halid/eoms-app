/**
 * @file: CNavButton.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 30.11.2024
 * Last Modified Date: 30.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IconType } from "@m/core/components/CIcon";

import { CNavButtonContainer } from "./CNavButtonContainer";

export function CNavButton({
  icon,
  label,
  onClick,
  searchQuery,
}: {
  icon?: IconType;
  label: string;
  onClick?: () => void;
  searchQuery?: string;
}) {
  return (
    <button
      type="button"
      className="outline-hidden group w-full text-left"
      onClick={onClick}
    >
      <CNavButtonContainer
        icon={icon}
        label={label}
        searchQuery={searchQuery}
      />
    </button>
  );
}
