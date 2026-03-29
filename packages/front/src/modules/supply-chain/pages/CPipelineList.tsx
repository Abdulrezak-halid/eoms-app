import { Cog, Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDateAgo } from "@m/base/components/CDisplayDateAgo";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CDropdown, IDropdownListCallback } from "@m/core/components/CDropdown";
import { CLine } from "@m/core/components/CLine";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoPipelineResponse } from "../interfaces/IDtoPipeline";

export function CPipelineList() {
  const { t } = useTranslation();
  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("pipelines") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/supply-chain/pipeline/item");
  }, []);

  const [data, load] = useLoader(fetcher);

  const handleDelete = useCallback(
    async (record: IDtoPipelineResponse) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.name }),
        async () => {
          const res = await Api.DELETE("/u/supply-chain/pipeline/item/{id}", {
            params: { path: { id: record.id } },
          });
          apiToast(res);
          if (res.error === undefined) {
            await load();
          }
        },
      );
    },
    [push, apiToast, load, t],
  );

  const actions = useCallback<IDropdownListCallback<IDtoPipelineResponse>>(
    (d) => [
      {
        icon: Cog,
        label: t("operations"),
        path: `/supply-chain/pipeline/item/${d.id}/operation`,
      },
      {
        icon: Pencil,
        label: t("edit"),
        path: `/supply-chain/pipeline/item/${d.id}`,
      },
      {
        icon: Trash2,
        label: t("_delete"),
        onClick: handleDelete,
      },
    ],
    [t, handleDelete],
  );

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("name") },
      { label: t("createdAt"), right: true, hideSm: true },
      { label: "", right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="justify-end space-x-2 mb-4">
        <CLinkAdd path="/supply-chain/pipeline/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>
      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <CTable noOverflow header={header}>
            {payload?.records.map((d) => [
              d.name,
              <CDisplayDateAgo key="createdAt" value={d.createdAt} />,

              <div key="actions" className="flex justify-end">
                <CDropdown
                  list={actions}
                  value={d}
                  label={t("actions")}
                  hideLabelLg
                />
              </div>,
            ])}
          </CTable>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
