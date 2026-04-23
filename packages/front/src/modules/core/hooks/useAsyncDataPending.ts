import { useEffect } from "react";

import { IAsyncData } from "../components/CAsyncLoader";

export function useAsyncDataPending(
  data: IAsyncData<unknown>,
  cb: ((value: boolean) => void) | undefined,
) {
  useEffect(() => {
    cb?.(data.pending ?? false);
  }, [cb, data.pending]);
}
