import { PropsWithChildren, useCallback } from "react";
import { Info, X } from "lucide-react";

import { usePopupState } from "../hooks/usePopupState";
import { CButton } from "./CButton";
import { CButtonPopup } from "./CButtonPopup";

type IProps = PropsWithChildren<{ label?: string; message?: string }>;

export function CInfoButton({ children, label, message }: IProps) {
  const popupState = usePopupState();

  const closePopup = useCallback(
    () => popupState.setIsOpen(false),
    [popupState],
  );

  const popupComponent = useCallback(
    () => (
      <div className="w-96 max-w-screen rounded-lg bg-sky-200 text-sky-800 dark:bg-sky-900 dark:text-sky-200 whitespace-pre-line">
        <div className="relative p-4 pr-16">
          <div className="absolute top-1 right-1">
            <CButton icon={X} tertiary onClick={closePopup} color="blue" />
          </div>
          <div>{children || message}</div>
        </div>
      </div>
    ),
    [children, closePopup, message],
  );

  return (
    <CButtonPopup
      icon={Info}
      label={label}
      popupComponent={popupComponent}
      popupState={popupState}
      tertiary
      color="blue"
    />
  );
}
