/**
 * @file: CComboboxAssignedAgent.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 01.08.2025
 * Last Modified Date: 01.08.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { MemoryStick } from "lucide-react";
import { useCallback } from "react";

import { Api } from "@m/base/api/Api";
import {
  CAsyncLoader,
  IExtractAsyncData,
} from "@m/core/components/CAsyncLoader";
import { CCombobox, ICComboboxProps } from "@m/core/components/CCombobox";
import { useAsyncDataPending } from "@m/core/hooks/useAsyncDataPending";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CComboboxAssignedAgent({
  onBusyChange,
  ...props
}: {
  onBusyChange?: (value: boolean) => void;
} & Omit<ICComboboxProps<string>, "list">) {
  const { t } = useTranslation();

  const loader = useCallback(async () => {
    return await Api.GET("/u/agent/assigned-items");
  }, []);

  const [data] = useLoader(loader);

  useAsyncDataPending(data, onBusyChange);

  const middleware = useCallback(
    (payload: IExtractAsyncData<typeof data>) =>
      payload.records.map((d) => ({
        label: d.name,
        value: d.id,
      })),
    [],
  );

  const list = useLoaderMiddleware(data, middleware);

  return (
    <CAsyncLoader data={list} inline>
      {(payload) => (
        <CCombobox
          icon={MemoryStick}
          placeholder={t("selectAnAgent")}
          {...props}
          list={payload}
        />
      )}
    </CAsyncLoader>
  );
}
