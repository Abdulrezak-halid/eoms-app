import { EApiFailCode } from "common";
import { useCallback } from "react";

import { Api, InferApiResponse } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { useApiToast } from "@m/base/hooks/useApiToast";
import {
  CAsyncLoader,
  IExtractAsyncData,
} from "@m/core/components/CAsyncLoader";
import { CButton } from "@m/core/components/CButton";
import { CHr } from "@m/core/components/CHr";
import {
  useLoader,
  useLoaderChain,
  useLoaderMiddleware,
  useLoaderMulti,
} from "@m/core/hooks/useLoader";

export function CDevApi() {
  const apiToast = useApiToast();

  // -------------------------------------------------------------
  const fetcherFail = useCallback(async (): Promise<{
    data?: InferApiResponse<"/g/session", "get">;
    error?: string;
  }> => {
    await new Promise((res) => setTimeout(res, 1000));
    return { error: EApiFailCode.UNKNOWN };
  }, []);
  const [dataFail, loadFail] = useLoader(fetcherFail);

  const fetcherFailNotification = useCallback(async () => {
    const res = await fetcherFail();
    apiToast(res);
  }, [fetcherFail, apiToast]);

  // -------------------------------------------------------------
  const fetcherSuccess = useCallback(async () => {
    return await Api.GET("/g/session", {
      // signal: AbortSignal.timeout(10),
    });
  }, []);
  const [dataSuccess, loadSuccess] = useLoader(fetcherSuccess);

  const fetcherSuccessNotification = useCallback(async () => {
    const res = await fetcherSuccess();
    apiToast(res);
  }, [fetcherSuccess, apiToast]);

  // -------------------------------------------------------------
  const middlewareSuccess = useCallback(
    async (payload: InferApiResponse<"/g/session", "get">) => {
      await new Promise((res) => setTimeout(res, 1000));
      return `${payload.session?.workerEnvName || "No Session"}-modified`;
    },
    [],
  );

  const dataSuccessMiddlewareSuccess = useLoaderMiddleware(
    dataSuccess,
    middlewareSuccess,
  );

  // -------------------------------------------------------------
  const middlewareFail = useCallback(async () => {
    await new Promise((res) => setTimeout(res, 1000));
    throw new Error("An error.");
  }, []);

  const dataSuccessMiddlewareFail = useLoaderMiddleware(
    dataSuccess,
    middlewareFail,
  );

  const dataFailMiddlewareSuccess = useLoaderMiddleware(
    dataFail,
    middlewareSuccess,
  );

  // -------------------------------------------------------------
  const fetcherMulti = useCallback(async () => {
    return {
      data1: await Api.GET("/"),
      data2: await Api.GET("/"),
    };
  }, []);
  const [dataMulti] = useLoaderMulti(fetcherMulti);

  // -------------------------------------------------------------
  const fetcherMultiErrored = useCallback(async () => {
    return {
      data1: await Api.GET("/"),
      data2: { error: EApiFailCode.UNKNOWN },
    };
  }, []);
  const [dataMultiErrored] = useLoaderMulti(fetcherMultiErrored);

  // -------------------------------------------------------------
  const fetcherChainInput = useCallback(async () => {
    return await Api.GET("/");
  }, []);
  const [dataChainInput, loadChainInput] = useLoader(fetcherChainInput);
  const fetcherChainOutput = useCallback(
    async (input: IExtractAsyncData<typeof dataChainInput>) => {
      // eslint-disable-next-line no-console
      console.log("Chain Input", input);
      return await Api.GET("/");
    },
    [],
  );
  const [dataChainOutput, loadChainOutput] = useLoaderChain(
    dataChainInput,
    fetcherChainOutput,
  );

  // -------------------------------------------------------------
  const fetcherErroredChainInput = useCallback(async () => {
    return await Api.GET("/");
  }, []);
  const [dataErroredChainInput] = useLoader(fetcherErroredChainInput);
  const fetcherErroredChainOutput = useCallback(
    async (input: IExtractAsyncData<typeof dataErroredChainInput>) => {
      void input;
      return Promise.resolve({ error: EApiFailCode.UNKNOWN });
    },
    [],
  );
  const [dataErroredChainOutput] = useLoaderChain(
    dataErroredChainInput,
    fetcherErroredChainOutput,
  );

  return (
    <CBody title="Dev - API">
      <div className="space-x-2">
        <CButton
          label="Load Fail"
          onClick={loadFail}
          disabled={dataFail.pending}
        />

        <CButton label="Notification Fail" onClick={fetcherFailNotification} />

        <CButton
          label="Load Success"
          onClick={loadSuccess}
          disabled={dataSuccess.pending}
        />

        <CButton
          label="Notification Success"
          onClick={fetcherSuccessNotification}
        />
      </div>

      <CHr />

      <div>
        <div>Data Fail</div>
        <CAsyncLoader data={dataFail} />

        <CHr />

        <div>Data Success</div>
        <CAsyncLoader data={dataSuccess}>
          {(payload) => (
            <div>{payload?.session?.workerEnvName || "No Session"}</div>
          )}
        </CAsyncLoader>

        <CHr />

        <div>Data Success Middleware Success</div>
        <CAsyncLoader data={dataSuccessMiddlewareSuccess}>
          {(payload) => <div>{payload}</div>}
        </CAsyncLoader>

        <CHr />

        <div>Data Success Middleware Fail</div>
        <CAsyncLoader data={dataSuccessMiddlewareFail} />

        <CHr />

        <div>Data Fail Middleware Success</div>
        <CAsyncLoader data={dataFailMiddlewareSuccess} />

        <CHr />

        <div>Multi Data Fetch</div>
        <CAsyncLoader data={dataMulti}>
          {(payload) => <pre>{JSON.stringify(payload, null, 2)}</pre>}
        </CAsyncLoader>

        <CHr />

        <div>Multi Data Fetch - Errored</div>
        <CAsyncLoader data={dataMultiErrored}>
          {(payload) => <pre>{JSON.stringify(payload, null, 2)}</pre>}
        </CAsyncLoader>

        <CHr />

        <div>Chained Data Fetch</div>
        <div className="space-x-2">
          <CButton
            label="Load Input"
            onClick={loadChainInput}
            disabled={dataChainInput.pending}
          />
          <CButton
            label="Load Output"
            onClick={loadChainOutput}
            disabled={dataChainOutput.pending}
          />
        </div>
        <CAsyncLoader data={dataChainOutput}>
          {(payload) => <pre>{JSON.stringify(payload, null, 2)}</pre>}
        </CAsyncLoader>

        <CHr />

        <div>Chained Data Fetch - Errored</div>
        <CAsyncLoader data={dataErroredChainOutput}>
          {(payload) => <pre>{JSON.stringify(payload, null, 2)}</pre>}
        </CAsyncLoader>
      </div>
    </CBody>
  );
}
