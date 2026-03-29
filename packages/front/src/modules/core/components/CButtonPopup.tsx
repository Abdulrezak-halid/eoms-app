import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { ReactElement, ReactNode } from "react";

import { IPopupState } from "../hooks/usePopupState";
import { classNames } from "../utils/classNames";
import { CButtonContainer, IButtonColor } from "./CButtonContainer";
import { CIcon, CIconOrCustom, IconType } from "./CIcon";

export function CButtonPopup({
  icon,
  iconRight,
  label,
  primary,
  tertiary,
  color,
  disabled,
  hideLabelSm,
  hideLabelMd,
  hideLabelLg,
  popupComponent,
  popupState: { isOpen, setIsOpen },
}: {
  icon?: IconType | ReactNode;
  iconRight?: IconType;
  label?: string;
  primary?: boolean;
  tertiary?: boolean;
  color?: IButtonColor;
  disabled?: boolean;
  hideLabelSm?: boolean;
  hideLabelMd?: boolean;
  hideLabelLg?: boolean;
  popupComponent: () => ReactElement;
  popupState: IPopupState;
}) {
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-end",
    whileElementsMounted: autoUpdate,
    middleware: [
      flip(),
      offset(4),
      shift({ padding: 16 }),
      size({
        apply({ availableHeight, availableWidth, elements }) {
          Object.assign(elements.floating.style, {
            //width: `${elements.reference.getBoundingClientRect().width}px`,
            minWidth: `${elements.reference.getBoundingClientRect().width}px`,
            maxWidth: `${availableWidth - 32}px`,
            maxHeight: `${availableHeight - 8}px`,
          });
        },
      }),
    ],
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  return (
    // inline-block is for popup to shrink
    <div className="inline-block relative">
      <button
        ref={refs.setReference}
        type="button"
        {...getReferenceProps()}
        className="group outline-hidden"
        disabled={disabled}
      >
        <CButtonContainer
          primary={primary}
          tertiary={tertiary}
          color={color}
          className="flex justify-center items-center py-3 px-2.5"
        >
          {icon && <CIconOrCustom className="mx-0.5" value={icon} />}
          {label && (
            <div
              className={classNames(
                "font-bold text-nowrap mx-1.5",
                hideLabelLg && "hidden @lg:block",
                hideLabelMd && "hidden @md:block",
                hideLabelSm && "hidden @sm:block",
              )}
            >
              {label}
            </div>
          )}
          {iconRight && <CIcon className="mx-0.5" value={iconRight} />}
        </CButtonContainer>
      </button>

      {isOpen && (
        <div
          ref={refs.setFloating}
          className="z-20"
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {popupComponent()}
        </div>
      )}
    </div>
  );
}
