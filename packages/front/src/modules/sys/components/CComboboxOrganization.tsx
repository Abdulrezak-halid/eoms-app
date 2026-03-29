import { Building } from "lucide-react";
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

export function CComboboxOrganization({
  onBusyChange,
  ...props
}: {
  onBusyChange?: (value: boolean) => void;
} & Omit<ICComboboxProps<string>, "list">) {
  const { t } = useTranslation();

  const loader = useCallback(async () => {
    return await Api.GET("/u/sys/organization/names");
  }, []);

  const [data] = useLoader(loader);

  useAsyncDataPending(data, onBusyChange);

  const middleware = useCallback(
    (payload: IExtractAsyncData<typeof data>) =>
      payload.records.map((d) => ({
        value: d.id,
        label: d.displayName,
      })),
    [],
  );

  const list = useLoaderMiddleware(data, middleware);

  return (
    <CAsyncLoader data={list} inline>
      {(payload) => (
        <CCombobox
          icon={Building}
          placeholder={t("selectAnOrganization")}
          {...props}
          list={payload}
        />
      )}
    </CAsyncLoader>
  );
}
