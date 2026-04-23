/**
 * @file: ContextSideMenu.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 15.11.2024
 * Last Modified Date: 15.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */

import { createContext } from "react";

export const ContextSideMenu = createContext({
  isOpen: false,
  open: () => {},
  close: () => {},
});
