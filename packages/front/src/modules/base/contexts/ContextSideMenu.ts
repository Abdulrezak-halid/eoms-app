import { createContext } from "react";

export const ContextSideMenu = createContext({
  isOpen: false,
  open: () => {},
  close: () => {},
});
