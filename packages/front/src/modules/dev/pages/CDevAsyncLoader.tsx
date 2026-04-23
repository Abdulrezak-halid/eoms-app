/**
 * @file: CDevAsyncLoader.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 18.10.2024
 * Last Modified Date: 18.10.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { EApiFailCode } from "common";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CBody } from "@m/base/components/CBody";
import { CAsyncLoader, IAsyncData } from "@m/core/components/CAsyncLoader";
import { CButton } from "@m/core/components/CButton";

import { CDevComponentLine, CDevComponentPanel } from "./CDevComponentPanel";

export function CDevAsyncLoader() {
  const loading = useMemo(() => ({}), []);
  const failed = useMemo(
    () => ({ pending: true, failCode: EApiFailCode.UNKNOWN }),
    [],
  );
  const revalidating = useMemo(
    () => ({ pending: true, payload: "Payload" }),
    [],
  );
  const done = useMemo(() => ({ payload: "Payload" }), []);
  const failedAndRevalidating = useMemo(
    () => ({ failCode: EApiFailCode.UNKNOWN, pending: true }),
    [],
  );
  const failedAndPayload = useMemo(
    () => ({ failCode: EApiFailCode.UNKNOWN, payload: "Payload" }),
    [],
  );
  const noRecord = useMemo(() => ({ payload: [] }), []);
  const failedNotFound = useMemo(
    () => ({ failCode: EApiFailCode.NOT_FOUND }),
    [],
  );
  const failedForbidden = useMemo(
    () => ({ failCode: EApiFailCode.FORBIDDEN }),
    [],
  );

  const [inter, setInter] = useState<IAsyncData<string>>(loading);
  const interLoad = useCallback(() => {
    setInter(revalidating);
    setTimeout(() => {
      setInter(done);
    }, 1000);
  }, [done, revalidating]);
  useEffect(() => {
    interLoad();
  }, [interLoad]);

  return (
    <CBody title="Dev - Async Loader">
      <CDevComponentPanel>
        <CDevComponentLine label="CAsyncLoader - loading - inline">
          <CAsyncLoader data={loading} inline />
        </CDevComponentLine>

        <CDevComponentLine label="CAsyncLoader - failed - inline">
          <CAsyncLoader data={failed} inline />
        </CDevComponentLine>

        <CDevComponentLine label="CAsyncLoader - no record - inline">
          <CAsyncLoader data={noRecord} inline />
        </CDevComponentLine>

        <CDevComponentLine label="CAsyncLoader - failed not found - inline">
          <CAsyncLoader data={failedNotFound} inline />
        </CDevComponentLine>

        <CDevComponentLine label="CAsyncLoader - failed forbidden - inline">
          <CAsyncLoader data={failedForbidden} inline />
        </CDevComponentLine>

        <CDevComponentLine label="CAsyncLoader - loading">
          <CAsyncLoader data={loading} />
        </CDevComponentLine>

        <CDevComponentLine label="CAsyncLoader - failed">
          <CAsyncLoader data={failed} />
        </CDevComponentLine>

        <CDevComponentLine label="CAsyncLoader - done">
          <CAsyncLoader data={done}>
            {(payload) => <div>{payload}</div>}
          </CAsyncLoader>
        </CDevComponentLine>

        <CDevComponentLine label="CAsyncLoader - revalidating">
          <CAsyncLoader data={revalidating}>
            {(payload) => <div>{payload}</div>}
          </CAsyncLoader>
        </CDevComponentLine>

        <CDevComponentLine label="CAsyncLoader - failed + revalidating">
          <CAsyncLoader data={failedAndRevalidating} />
        </CDevComponentLine>

        <CDevComponentLine label="CAsyncLoader - failed + payload">
          <CAsyncLoader data={failedAndPayload}>
            {(payload) => <div>{payload}</div>}
          </CAsyncLoader>
        </CDevComponentLine>

        <CDevComponentLine label="CAsyncLoader - no record">
          <CAsyncLoader data={noRecord}>
            {() => <div>Should not be rendered</div>}
          </CAsyncLoader>
        </CDevComponentLine>

        <CDevComponentLine label="CAsyncLoader - failed not found">
          <CAsyncLoader data={failedNotFound} />
        </CDevComponentLine>

        <CDevComponentLine label="CAsyncLoader - failed forbidden">
          <CAsyncLoader data={failedForbidden} />
        </CDevComponentLine>

        <CDevComponentLine label="CAsyncLoader - interactive">
          <CButton
            label="Reload"
            onClick={interLoad}
            disabled={inter.pending}
          />
          <CAsyncLoader data={inter}>
            {(payload) => <div>{payload}</div>}
          </CAsyncLoader>
        </CDevComponentLine>
      </CDevComponentPanel>
    </CBody>
  );
}
