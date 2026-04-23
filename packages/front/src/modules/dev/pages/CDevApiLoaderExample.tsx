import { useCallback } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import {
  CAsyncLoader,
  IExtractAsyncData,
} from "@m/core/components/CAsyncLoader";
import { CButton } from "@m/core/components/CButton";
import { CCard } from "@m/core/components/CCard";
import { CHr } from "@m/core/components/CHr";
import { CLine } from "@m/core/components/CLine";
import {
  useLoader,
  useLoaderChain,
  useLoaderMiddleware,
  useLoaderMulti,
} from "@m/core/hooks/useLoader";

export function CDevApiLoaderExample() {
  // Basic example
  const loader = useCallback(async () => await Api.GET("/g/session"), []);
  const [data, load] = useLoader(loader);

  // Middleware example
  const middleware = useCallback((payload: IExtractAsyncData<typeof data>) => {
    return {
      userName: payload.session?.userDisplayName,
      newField: true,
    };
  }, []);
  const dataMutated = useLoaderMiddleware(data, middleware);

  // Multi loader example
  const loaderMulti = useCallback(
    async () => ({
      data1: await Api.GET("/"),
      data2: await Api.GET("/g/session"),
    }),
    [],
  );
  const [dataMulti, loadMulti] = useLoaderMulti(loaderMulti);

  // Chained loader example
  const loaderInput = useCallback(async () => await Api.GET("/"), []);
  const [dataInput, loadInput] = useLoader(loaderInput);
  const loaderOutput = useCallback(
    async (input: IExtractAsyncData<typeof dataInput>) => {
      void input;
      return await Api.GET("/g/session");
    },
    [],
  );
  const [dataOutput, loadOutput] = useLoaderChain(dataInput, loaderOutput);

  return (
    <CBody title="Dev - API Loader Example">
      <div>Basic Example</div>
      <div className="space-y-4">
        <CCard>
          <CLine className="space-x-2 p-4">
            <div>Fetch remote data: GET /g/session</div>
            <CButton label="Reload" onClick={load} />
          </CLine>
        </CCard>
        <CAsyncLoader data={data}>
          {(payload) => (
            <CCard className="p-4">
              <pre>{JSON.stringify(payload, null, 2)}</pre>
            </CCard>
          )}
        </CAsyncLoader>
      </div>

      <CHr className="py-3" />

      <div>Middleware Example</div>
      <div className="space-y-4">
        <CCard>
          <CLine className="space-x-2 p-4">
            <div>Fetch remote data: GET /g/session + mutate</div>
          </CLine>
        </CCard>
        <CAsyncLoader data={dataMutated}>
          {(payload) => (
            <CCard className="p-4">
              <pre>{JSON.stringify(payload, null, 2)}</pre>
            </CCard>
          )}
        </CAsyncLoader>
      </div>

      <CHr className="py-3" />

      <div>Multi Loader Example</div>
      <div className="space-y-4">
        <CCard>
          <CLine className="space-x-2 p-4">
            <div>Fetch remote data: GET / + GET /g/session</div>
            <CButton label="Reload" onClick={loadMulti} />
          </CLine>
        </CCard>
        <CAsyncLoader data={dataMulti}>
          {(payload) => (
            <CCard className="p-4">
              <pre>{JSON.stringify(payload, null, 2)}</pre>
            </CCard>
          )}
        </CAsyncLoader>
      </div>

      <CHr className="py-3" />

      <div>Chained Loader Example</div>
      <div className="space-y-4">
        <CCard>
          <CLine className="space-x-2 p-4">
            <div>Fetch remote data: GET /</div>
            <CButton label="Reload" onClick={loadInput} />
            <div>Chain fetch remote data: GET /g/session</div>
            <CButton label="Reload" onClick={loadOutput} />
          </CLine>
        </CCard>
        <CAsyncLoader data={dataOutput}>
          {(payload) => (
            <CCard className="p-4">
              <pre>{JSON.stringify(payload, null, 2)}</pre>
            </CCard>
          )}
        </CAsyncLoader>
      </div>
    </CBody>
  );
}
