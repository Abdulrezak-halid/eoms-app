import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeUnitGroup } from "@m/base/components/CBadgeUnitGroup";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CButton } from "@m/core/components/CButton";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoProductResponse } from "../interfaces/IDtoProduct";

export function CProductList() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("product") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/product-base/product/item");
  }, []);
  const [data, load] = useLoader(fetcher);

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(
    async (records: IDtoProductResponse) => {
      await push(
        t("msgRecordWillBeDeleted", {
          subject: records.code,
        }),
        async () => {
          const res = await Api.DELETE("/u/product-base/product/item/{id}", {
            params: { path: { id: records.id } },
          });
          apiToast(res);
          if (res.error === undefined) {
            await load();
          }
        },
      );
    },
    [apiToast, load, push, t],
  );

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("code") },
      { label: t("description"), hideMd: true },
      { label: t("unit"), hideSm: true },
      { label: "", right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="justify-end space-x-2 grow">
        <CLinkAdd path="/product-base/product/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <>
            <CTable header={header}>
              {payload.records.map((d) => [
                d.code,
                d.description || "-",
                <CBadgeUnitGroup key="unit" value={d.unit} />,
                <CLine key="actions" className="justify-end space-x-2">
                  <CLink
                    icon={Pencil}
                    label={t("edit")}
                    path={`/product-base/product/item/${d.id}`}
                    hideLabelLg
                  />
                  <CButton
                    icon={Trash2}
                    label={t("_delete")}
                    value={d}
                    onClick={handleDelete}
                    hideLabelLg
                  />
                </CLine>,
              ])}
            </CTable>
          </>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
