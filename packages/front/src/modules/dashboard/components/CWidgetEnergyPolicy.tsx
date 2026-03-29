import { useCallback } from "react";

import { Api } from "@m/base/api/Api";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { useLoader } from "@m/core/hooks/useLoader";

export function CWidgetEnergyPolicy() {
  const fetcher = useCallback(async () => {
    const response = await Api.GET("/u/commitment/energy-policy/item");
    return response;
  }, []);

  const [data] = useLoader(fetcher);

  return (
    <CAsyncLoader
      data={data}
      arrayField="records"
      className="min-h-72 h-full p-2 flex flex-col"
    >
      {(payload) => (
        <div className="space-y-4 max-h-96 overflow-y-auto p-4 pl-5 grow rounded-md shadow-inner bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
          {payload.records.map((policy) => (
            <div key={policy.id} className="flex items-start space-x-4">
              <div className="mt-1 w-4 h-4 rounded-full border-4 border-accent-500 dark:border-accent-500 flex-none" />
              <div>{policy.content}</div>
            </div>
          ))}
        </div>
      )}
    </CAsyncLoader>
  );
}
