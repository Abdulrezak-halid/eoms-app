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

export function CComboboxRegressionResult({
  onBusyChange,
  ...props
}: {
  onBusyChange?: (value: boolean) => void;
} & Omit<ICComboboxProps<string>, "list">) {
  const { t } = useTranslation();

  const loader = useCallback(async () => {
    return await Api.GET("/u/analysis/advanced-regression/result");
  }, []);

  const [data] = useLoader(loader);

  useAsyncDataPending(data, onBusyChange);

  const middleware = useCallback(
    (payload: IExtractAsyncData<typeof data>) => {
      return payload.records.map((result) => {
        const driverResourceNames = result.drivers
          .map((d) => d.name)
          .join(", ");
        const sourceName =
          result.seu?.name ||
          result.slices.map((slice) => slice.name).join(", ") ||
          t("meters");
        return {
          label: `${sourceName} - ${driverResourceNames}`,
          value: result.id,
        };
      });
    },
    [t],
  );

  const list = useLoaderMiddleware(data, middleware);

  return (
    <CAsyncLoader data={list} inline>
      {(payload) => (
        <CCombobox
          placeholder={t("selectARegressionResult")}
          {...props}
          list={payload}
        />
      )}
    </CAsyncLoader>
  );
}
