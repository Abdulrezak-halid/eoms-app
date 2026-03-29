import { Building } from "lucide-react";
import { useCallback } from "react";

import {
  CAsyncLoader,
  IExtractAsyncData,
} from "@m/core/components/CAsyncLoader";
import {
  CMultiSelect,
  ICMultiSelectProps,
} from "@m/core/components/CMultiSelect";
import { useAsyncDataPending } from "@m/core/hooks/useAsyncDataPending";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "../api/Api";

export function CMultiSelectDepartment({
  onBusyChange,
  ...props
}: {
  onBusyChange?: (value: boolean) => void;
} & Omit<ICMultiSelectProps<string>, "list">) {
  const { t } = useTranslation();

  const loader = useCallback(async () => {
    return await Api.GET("/u/base/department/names");
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
        <CMultiSelect
          icon={Building}
          placeholder={t("selectDepartmentMulti")}
          list={payload}
          {...props}
        />
      )}
    </CAsyncLoader>
  );
}
