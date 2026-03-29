/**
 * @file: useFetcher.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 20.10.2024
 * Last Modified Date: 20.10.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { EApiFailCode } from "common";
import { useCallback, useContext, useEffect, useState } from "react";

import { ContextServerMaintenance } from "@m/base/contexts/ContextServerMaintenance";
import { ContextSession } from "@m/base/contexts/ContextSession";
import { IAsyncData } from "@m/core/components/CAsyncLoader";

import { MaybePromise } from "../interfaces/MaybePromise";

export const NO_FETCH_FAIL_CODE = "NO_FETCH_FAIL_CODE";

type IApiResponse<TData> = { data?: TData; error?: string };

export function useLoader<TData>(
  fetcher: () => Promise<IApiResponse<TData> | undefined> | undefined,
) {
  const [data, setData] = useState<IAsyncData<TData>>({
    pending: true,
  });

  // const mutate = useCallback((data: TData) => {
  //   setData((d) => ({ ...d, data }));
  // }, []);

  const { clearSession } = useContext(ContextSession);

  const enableMaintenance = useContext(ContextServerMaintenance);

  const load = useCallback(async () => {
    setData((d) => ({ ...d, pending: true }));
    try {
      const res = await fetcher();

      if (res === undefined) {
        setData({ failCode: NO_FETCH_FAIL_CODE });
        return;
      }

      if (res.data !== undefined && res.error === undefined) {
        setData({ payload: res.data });
        return;
      }

      if (
        res.error === EApiFailCode.UNAUTHORIZED &&
        !import.meta.env.VITE_NO_LOGIN
      ) {
        clearSession();
        return;
      }
      if (res.error === EApiFailCode.MAINTENANCE) {
        enableMaintenance();
        return;
      }
      setData({ failCode: res.error || EApiFailCode.UNKNOWN });
    } catch (e) {
      void e;
      setData({ failCode: EApiFailCode.UNKNOWN });
    }
  }, [fetcher, clearSession, enableMaintenance]);

  useEffect(() => {
    void load();
  }, [load]);

  return [data, load /*, mutate*/] as const;
}

export function useLoaderChain<TInput, TOutput>(
  data: IAsyncData<TInput>,
  nextFetcher: (
    data: TInput,
  ) => Promise<IApiResponse<TOutput> | undefined> | undefined,
): [IAsyncData<{ input: TInput; output: TOutput }>, () => Promise<void>] {
  const [outputData, setOutputData] = useState<
    IAsyncData<{ input: TInput; output: TOutput }>
  >({
    pending: true,
  });

  const { clearSession } = useContext(ContextSession);

  const enableMaintenance = useContext(ContextServerMaintenance);

  const load = useCallback(async () => {
    if (data.payload === undefined || data.failCode) {
      setOutputData({ ...data, payload: undefined });
      return;
    }
    setOutputData((d) => ({ ...d, pending: true }));
    if (data.pending) {
      return;
    }
    try {
      const res = await nextFetcher(data.payload);

      if (res === undefined) {
        setOutputData({ failCode: NO_FETCH_FAIL_CODE });
        return;
      }

      if (res.data !== undefined && res.error === undefined) {
        setOutputData({ payload: { input: data.payload, output: res.data } });
        return;
      }

      if (
        res.error === EApiFailCode.UNAUTHORIZED &&
        !import.meta.env.VITE_NO_LOGIN
      ) {
        clearSession();
        return;
      }
      if (res.error === EApiFailCode.MAINTENANCE) {
        enableMaintenance();
        return;
      }
      setOutputData({ failCode: res.error || EApiFailCode.UNKNOWN });
    } catch (e) {
      void e;
      setOutputData({ failCode: EApiFailCode.UNKNOWN });
    }
  }, [clearSession, data, enableMaintenance, nextFetcher]);

  useEffect(() => {
    void load();
  }, [load]);

  return [outputData, load];
}

export function useLoaderMiddleware<TInput, TOutput>(
  data: IAsyncData<TInput>,
  middleware: (payload: TInput) => MaybePromise<TOutput>,
): IAsyncData<TOutput> {
  const [outputData, setOutputData] = useState<IAsyncData<TOutput>>({
    pending: true,
  });
  const load = useCallback(async () => {
    if (data.payload === undefined || data.failCode) {
      setOutputData({ ...data, payload: undefined });
      return;
    }
    setOutputData((d) => ({ ...d, pending: true }));
    if (data.pending) {
      return;
    }
    try {
      const payload = await middleware(data.payload);
      setOutputData({ ...data, payload });
    } catch (e) {
      void e;
      setOutputData({ failCode: EApiFailCode.UNKNOWN });
    }
  }, [data, middleware]);

  useEffect(() => {
    void load();
  }, [load]);

  return outputData;
}

export function useLoaderMulti<
  TFetcherReturn extends {
    [K: string]: IApiResponse<unknown> | undefined;
  },
  TDataSet extends {
    [K in keyof TFetcherReturn]: TFetcherReturn[K] extends undefined
      ? NonNullable<TFetcherReturn[K]>["data"] | undefined
      : NonNullable<NonNullable<TFetcherReturn[K]>["data"]>;
  },
>(fetcher: () => Promise<TFetcherReturn | undefined> | undefined) {
  const [data, setData] = useState<IAsyncData<TDataSet>>({
    pending: true,
  });

  // const mutate = useCallback((data: TData) => {
  //   setData((d) => ({ ...d, data }));
  // }, []);

  const { clearSession } = useContext(ContextSession);

  const enableMaintenance = useContext(ContextServerMaintenance);

  const load = useCallback(async () => {
    setData((d) => ({ ...d, pending: true }));
    try {
      const res = await fetcher();

      if (res === undefined) {
        setData({ failCode: NO_FETCH_FAIL_CODE });
        return;
      }

      const result: Partial<TDataSet> = {};

      for (const _key in res) {
        const key = _key as keyof TFetcherReturn;
        const sub = res[key];

        if (sub === undefined) {
          result[key] = undefined;
          continue;
        }

        if (sub.data !== undefined && sub.error === undefined) {
          result[key] = sub.data as TDataSet[string];
          continue;
        }

        if (
          sub.error === EApiFailCode.UNAUTHORIZED &&
          !import.meta.env.VITE_NO_LOGIN
        ) {
          clearSession();
          return;
        }

        if (sub.error === EApiFailCode.MAINTENANCE) {
          enableMaintenance();
          return;
        }

        setData({ failCode: sub.error || EApiFailCode.UNKNOWN });
        return;
      }

      setData({ payload: result as TDataSet });
    } catch (e) {
      void e;
      setData({ failCode: EApiFailCode.UNKNOWN });
    }
  }, [fetcher, clearSession, enableMaintenance]);

  useEffect(() => {
    void load();
  }, [load]);

  return [data, load /*, mutate*/] as const;
}
