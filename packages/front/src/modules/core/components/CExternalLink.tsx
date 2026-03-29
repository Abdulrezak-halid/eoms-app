import { SquareArrowOutUpRight } from "lucide-react";

import { classNames } from "@m/core/utils/classNames";

import { CButtonContainer, IButtonColor } from "./CButtonContainer";
import { CIcon, IconType } from "./CIcon";

export function CExternalLink({
  icon,
  iconRight = SquareArrowOutUpRight,
  label,
  href,
  primary,
  tertiary,
  color,
  disabled,
  hideLabelSm,
  hideLabelMd,
  hideLabelLg,
  hideLabelXl,
  target = "_blank", // open in new tab
  rel = "noopener noreferrer", // for security
  download,
}: {
  icon?: IconType;
  iconRight?: IconType | null;
  label?: string;
  href?: string;
  primary?: boolean;
  tertiary?: boolean;
  color?: IButtonColor;
  disabled?: boolean;
  hideLabelSm?: boolean;
  hideLabelMd?: boolean;
  hideLabelLg?: boolean;
  hideLabelXl?: boolean;
  target?: string;
  rel?: string;
  download?: string;
}) {
  const disabledFinal = disabled || !href;

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={classNames(
        "group outline-hidden inline-block",
        disabledFinal && "opacity-40 pointer-events-none",
      )}
      tabIndex={disabledFinal ? -1 : undefined}
      download={download}
    >
      <CButtonContainer
        primary={primary}
        tertiary={tertiary}
        color={color}
        className="flex justify-center items-center py-3 px-2.5"
        forceDisabled={disabledFinal}
      >
        {icon && <CIcon className="mx-0.5" value={icon} />}
        {label && (
          <div
            className={classNames(
              "font-bold text-nowrap mx-1.5",
              hideLabelSm && "hidden @sm:block",
              hideLabelMd && "hidden @md:block",
              hideLabelLg && "hidden @lg:block",
              hideLabelXl && "hidden @xl:block",
            )}
          >
            {label}
          </div>
        )}
        {iconRight && <CIcon className="mx-0.5" value={iconRight} />}
      </CButtonContainer>
    </a>
  );
}
