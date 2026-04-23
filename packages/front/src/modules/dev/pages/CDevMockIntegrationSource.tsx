/**
 * @file: CDevMockIntegrationSource.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 20.02.2025
 * Last Modified Date: 21.02.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useCallback, useMemo } from "react";

import { Api, InferApiResponse } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { CChart } from "@m/base/components/CChart";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { useLoader } from "@m/core/hooks/useLoader";

export function CDevMockIntegrationSource() {
  const fetcher = useCallback(async () => {
    return await Api.POST("/g/dev/mock-source", {
      body: {
        waves: [
          { vMul: 10, hMul: 20 },
          { vMul: 10, hMul: 14 },
        ],
        date: "2025-01-01",
        dateTo: "2025-02-20",
      },
    });
  }, []);
  const [data] = useLoader(fetcher);

  return (
    <CBody title="Dev - Mock Integration Source">
      <CAsyncLoader data={data}>
        {(payload) => <CDevMockIntegrationSourceChart payload={payload} />}
      </CAsyncLoader>
    </CBody>
  );
}

export function CDevMockIntegrationSourceChart({
  payload,
}: {
  payload: InferApiResponse<"/g/dev/mock-source", "post">;
}) {
  const series = useMemo(
    () => [
      {
        name: "Data",
        data: payload.values,
      },
    ],
    [payload],
  );

  return (
    <div>
      <CChart series={series} />
    </div>
  );
}
