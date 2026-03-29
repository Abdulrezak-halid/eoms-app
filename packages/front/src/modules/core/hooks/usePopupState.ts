import { Dispatch, SetStateAction, useState } from "react";

export interface IPopupState {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function usePopupState(): IPopupState {
  const [isOpen, setIsOpen] = useState(false);
  return { isOpen, setIsOpen };
}
