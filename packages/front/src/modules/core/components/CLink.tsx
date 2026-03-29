import { classNames } from "@m/core/utils/classNames";

import { IRoutePath } from "../interfaces/IRoutePath";
import { CButtonContainer, IButtonColor } from "./CButtonContainer";
import { CIcon, IconType } from "./CIcon";
import { CLinkCore } from "./CLinkCore";

export function CLink({
  icon,
  iconRight,
  label,
  primary,
  tertiary,
  color,
  path,
  disabled,
  hideLabelSm,
  hideLabelMd,
  hideLabelLg,
  hideLabelXl,
  targetNewTab,
}: {
  icon?: IconType;
  iconRight?: IconType;
  label?: string;
  primary?: boolean;
  tertiary?: boolean;
  color?: IButtonColor;
  path?: IRoutePath;
  disabled?: boolean;
  hideLabelSm?: boolean;
  hideLabelMd?: boolean;
  hideLabelLg?: boolean;
  hideLabelXl?: boolean;
  targetNewTab?: boolean;
}) {
  const disabledFinal = disabled || !path;

  return (
    <CLinkCore
      title={label}
      path={path}
      disabled={disabled}
      targetNewTab={targetNewTab}
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
    </CLinkCore>
  );
}
