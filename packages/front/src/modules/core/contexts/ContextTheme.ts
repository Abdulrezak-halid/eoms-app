import { createContext } from "react";

export const ContextTheme = createContext({
  dark: false,
  setDark: (value: boolean) => {
    void value;
  },
});
