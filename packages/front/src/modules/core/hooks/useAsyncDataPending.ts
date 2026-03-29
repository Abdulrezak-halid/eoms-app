/**
 * @file: useAsyncDataPending.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 11.02.2026
 * Last Modified Date: 11.02.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
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
