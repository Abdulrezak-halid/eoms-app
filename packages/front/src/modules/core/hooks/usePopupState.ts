/**
 * @file: usePopupState.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 31.10.2024
 * Last Modified Date: 02.12.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { Dispatch, SetStateAction, useState } from "react";

export interface IPopupState {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function usePopupState(): IPopupState {
  const [isOpen, setIsOpen] = useState(false);
  return { isOpen, setIsOpen };
}
