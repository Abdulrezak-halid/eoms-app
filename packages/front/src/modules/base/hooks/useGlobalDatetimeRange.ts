import { useContext, useMemo } from "react";

import { ContextGlobalFilter } from "../contexts/ContextGlobalFilter";

export function useGlobalDatetimeRange() {
  const { getDatetimeRange } = useContext(ContextGlobalFilter);

  return useMemo(() => getDatetimeRange(), [getDatetimeRange]);
}
