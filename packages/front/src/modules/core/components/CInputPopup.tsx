/**
 * @file: CInputPopup.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 31.10.2024
 * Last Modified Date: 31.10.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import {
  flip,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { ChevronDown } from "lucide-react";
import { PropsWithChildren, ReactElement } from "react";

import { classNames } from "@m/core/utils/classNames";

import { IPopupState } from "../hooks/usePopupState";
import { CIcon, IconType } from "./CIcon";
import { CInputContainer } from "./CInputContainer";
import { CLine } from "./CLine";

export function CInputPopup({
  state: { isOpen, setIsOpen },
  children,
  popupComponent,
  popupFixedSize,
  icon,
  caretIcon = ChevronDown,
  disabled,
  placeholder,
  invalid,
  classNameChildrenContainer,
}: PropsWithChildren<{
  state: IPopupState;
  popupComponent: () => ReactElement;
  popupFixedSize?: boolean;
  icon?: IconType;
  caretIcon?: IconType;
  disabled?: boolean;
  placeholder?: string;
  invalid?: boolean;
  classNameChildrenContainer?: string;
}>) {
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-end",
    middleware: [
      flip(),
      offset(4),
      shift(popupFixedSize ? { crossAxis: true, padding: 4 } : undefined),
      size({
        apply({ availableHeight, availableWidth, elements }) {
          Object.assign(elements.floating.style, {
            minWidth: popupFixedSize
              ? undefined
              : `${elements.reference.getBoundingClientRect().width}px`,
            maxWidth: popupFixedSize ? undefined : `${availableWidth - 32}px`,
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

  const isPlaceholderVisible = !children;

  return (
    <div className="relative">
      <button
        ref={refs.setReference}
        type="button"
        {...getReferenceProps()}
        disabled={disabled}
        className="group outline-hidden w-full block text-left"
      >
        <CInputContainer
          className={classNames("py-3", icon ? "pl-12" : "pl-3")}
          invalid={invalid}
          // Actually not needed, but to remove invalid style when disabled
          disabled={disabled}
          icon={icon}
        >
          <CLine className="justify-between">
            <div
              className={classNames(
                "min-w-0",
                isPlaceholderVisible && "x-placeholder",
                classNameChildrenContainer,
              )}
            >
              {isPlaceholderVisible ? placeholder : children}
            </div>

            <CIcon
              value={caretIcon}
              className="flex-none w-12! text-accent-700 dark:text-accent-200"
            />
          </CLine>
        </CInputContainer>
      </button>

      {isOpen && (
        <div
          ref={refs.setFloating}
          className="z-20 flex"
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {popupComponent()}
        </div>
      )}
    </div>
  );
}
