import { IDtoEJobName } from "common/build-api-schema";
import { useCallback } from "react";

import {
  CAsyncLoader,
  IExtractAsyncData,
} from "@m/core/components/CAsyncLoader";
import { CCombobox, ICComboboxProps } from "@m/core/components/CCombobox";
import { useAsyncDataPending } from "@m/core/hooks/useAsyncDataPending";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "../api/Api";

export function CComboboxJobHandler({
  onBusyChange,
  ...props
}: {
  onBusyChange?: (value: boolean) => void;
} & Omit<ICComboboxProps<IDtoEJobName>, "list">) {
  const { t } = useTranslation();

  const loader = useCallback(async () => {
    return await Api.GET("/u/sys/job/handler-names");
  }, []);

  const [data] = useLoader(loader);

  useAsyncDataPending(data, onBusyChange);

  const middleware = useCallback(
    (payload: IExtractAsyncData<typeof data>) =>
      payload.records.map((handler) => ({
        label: handler,
        value: handler,
      })),
    [],
  );

  const list = useLoaderMiddleware(data, middleware);

  return (
    <CAsyncLoader data={list} inline>
      {(payload) => (
        <CCombobox
          placeholder={t("selectJobHandler")}
          {...props}
          list={payload}
        />
      )}
    </CAsyncLoader>
  );
}
