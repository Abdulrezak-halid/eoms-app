import { Copy, FilePlus, Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CBadge } from "@m/core/components/CBadge";
import { CDropdown, IDropdownListCallback } from "@m/core/components/CDropdown";
import { CLine } from "@m/core/components/CLine";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoTemplateListItem } from "../interfaces/IDtoReportTemplate";
import { renderPlainOrTranslatableText } from "../utils/renderPlainOrTranslatableText";

export function CReportTemplateList() {
  const { t } = useTranslation();
  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("reportTemplate") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/report/profile/item");
  }, []);
  const [data, load] = useLoader(fetcher);

  const handleClone = useCallback(
    async (record: IDtoTemplateListItem) => {
      const res = await Api.POST("/u/report/profile/item/clone", {
        body: { id: record.id },
      });
      apiToast(res);
      if (res.error === undefined) {
        await load();
      }
    },
    [apiToast, load],
  );

  const handleDelete = useCallback(
    async (record: IDtoTemplateListItem) => {
      await push(
        t("msgRecordWillBeDeleted", {
          subject: renderPlainOrTranslatableText(t, record.title),
        }),
        async () => {
          const res = await Api.DELETE("/u/report/profile/item/{id}", {
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

  const actions = useCallback<IDropdownListCallback<IDtoTemplateListItem>>(
    (d) => [
      {
        icon: FilePlus,
        label: t("use"),
        path: `/report/item-use-template/${d.id}`,
      },
      {
        icon: Copy,
        label: t("clone"),
        onClick: handleClone,
      },
      {
        icon: Pencil,
        label: t("edit"),
        path: `/report/template/${d.id}`,
        disabled: d.isCommon,
      },
      {
        icon: Trash2,
        label: t("_delete"),
        onClick: handleDelete,
        disabled: d.isCommon,
      },
    ],
    [handleClone, handleDelete, t],
  );

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("title") },
      { label: t("description"), hideSm: true },
      { label: "", right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow space-x-2 justify-end">
        <CLinkAdd path="/report/template-add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <CTable noOverflow header={header}>
            {payload.records.map((d) => [
              <div key="title">
                {renderPlainOrTranslatableText(t, d.title)}{" "}
                {d.isCommon && (
                  <CBadge
                    value={
                      d.commonLabel
                        ? renderPlainOrTranslatableText(t, d.commonLabel)
                        : t("common")
                    }
                  />
                )}
              </div>,

              <div key="description" className="whitespace-pre-line">
                {renderPlainOrTranslatableText(t, d.description) || (
                  <span>-</span>
                )}
              </div>,

              <div key="actions" className="flex overflow-visible justify-end">
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
