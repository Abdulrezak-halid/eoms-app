import { createContext } from "react";

import { IDatetimeQuickRange } from "../hooks/useQuickTimeRanges";

export const ContextGlobalFilter = createContext<{
  selectedQuickRange?: IDatetimeQuickRange;

  // If quick range is selected, to avoid outdated datetime for new requests,
  //   it is designed as function, so navigated pages will get updated
  //   datetime. Also refresh button is clicked (trigger), `getDatetimeRange`
  //   method pointer is changed to trigger reload datetime consumers.
  getDatetimeRange: () => { datetimeMin: string; datetimeMax: string };

  setCustomDatetimeMin: (value: string | undefined) => void;
  setCustomDatetimeMax: (value: string | undefined) => void;
  setSelectedQuickRange: (value: IDatetimeQuickRange | undefined) => void;
  triggerDatetimeRefresh: () => void;
}>({
  getDatetimeRange: () => ({ datetimeMin: "", datetimeMax: "" }),
  setCustomDatetimeMin: () => {},
  setCustomDatetimeMax: () => {},
  setSelectedQuickRange: () => {},
  triggerDatetimeRefresh: () => {},
});
