import { useCallback } from "react";

import { Api } from "@m/base/api/Api";
import { useLoader } from "@m/core/hooks/useLoader";

import { IDtoWidgetListResponse } from "../interfaces/IDtoDashboard";

export function useFetchWidgets() {
  const fetcher = useCallback(async () => {
    const response = await Api.GET("/u/dashboard/widget/item");
    return response;
  }, []);

  return useLoader<IDtoWidgetListResponse>(fetcher);
}
