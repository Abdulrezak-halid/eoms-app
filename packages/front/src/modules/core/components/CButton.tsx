import { useCallback, useState } from "react";

import { classNames } from "@m/core/utils/classNames";

import { CButtonContainer, IButtonColor } from "./CButtonContainer";
import { CIcon, IconType } from "./CIcon";
import { CSpinner } from "./CSpinner";

type ICButtonConditionalClickHandlerProps<TValue> =
  | {
      value?: undefined;
      onClick?: () => void | Promise<void>;
    }
  | {
      value: TValue;
      onClick?: (value: TValue) => void | Promise<void>;
    };

export type ICButtonProps<TValue> =
  ICButtonConditionalClickHandlerProps<TValue> & {
    icon?: IconType;
    iconRight?: IconType;
    label?: string;
    primary?: boolean;
    tertiary?: boolean;
    color?: IButtonColor;
    submit?: boolean;
    disabled?: boolean;
    hideLabelSm?: boolean;
    hideLabelMd?: boolean;
    hideLabelLg?: boolean;
    hideLabelXl?: boolean;
    className?: string;
    classNameContainer?: string;
    noTab?: boolean;
  };

export function CButton<TValue>({
  icon,
  iconRight,
  label,
  submit,
  primary,
  tertiary,
  color,
  disabled,
  value,
  onClick,
  hideLabelSm,
  hideLabelMd,
  hideLabelLg,
  hideLabelXl,
  className,
  classNameContainer,
  noTab,
}: ICButtonProps<TValue>) {
  const [pending, setPending] = useState(false);
  const handleClick = useCallback(async () => {
    setPending(true);
    if (onClick) {
      await onClick(value as TValue);
    }
    setPending(false);
  }, [onClick, value]);

  const disabledFinal = disabled || pending;

  return (
    <button
      type={submit ? "submit" : "button"}
      disabled={disabledFinal}
      // Without align-middle with icon and without icon buttons are not aligned
      className={classNames("group outline-hidden align-middle", className)}
      onClick={handleClick}
      tabIndex={noTab ? -1 : undefined}
      title={label}
    >
      <CButtonContainer
        primary={primary}
        tertiary={tertiary}
        className={classNames(
          "flex justify-center items-center py-3 px-2.5",
          classNameContainer,
        )}
        color={color}
      >
        {submit && (
          // Submit spinner
          <CSpinner className="mx-0.5 hidden group-[.x-form:disabled]:block" />
        )}
        {!submit && pending ? (
          // Pending spinner
          <CSpinner className="mx-0.5" />
        ) : (
          icon && (
            <CIcon
              className={classNames(
                "mx-0.5",
                submit && "block group-[.x-form:disabled]:hidden",
              )}
              value={icon}
            />
          )
        )}
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
    </button>
  );
}
