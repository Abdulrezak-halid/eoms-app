/**
 * @file: ContextTheme.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 18.10.2024
 * Last Modified Date: 18.10.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */

import { createContext } from "react";

export const ContextTheme = createContext({
  dark: false,
  setDark: (value: boolean) => {
    void value;
  },
});
