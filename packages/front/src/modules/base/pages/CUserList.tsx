import { Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CBadge } from "@m/core/components/CBadge";
import { CDropdown, IDropdownListCallback } from "@m/core/components/CDropdown";
import { CLine } from "@m/core/components/CLine";
import { CMessageCard } from "@m/core/components/CMessageCard";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CBadgeEmail } from "../components/CBadgeEmail";
import { CBadgePhone } from "../components/CBadgePhone";
import { IBreadCrumb } from "../components/CBreadCrumbs";
import { CDisplayDateAgo } from "../components/CDisplayDateAgo";
import { ContextSession } from "../contexts/ContextSession";
import { IDtoUserListItem } from "../interfaces/IDtoUser";

export function CUserList() {
  const { t } = useTranslation();
  const { session } = useContext(ContextSession);

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/base/user/item");
  }, []);
  const [data, load] = useLoader(fetcher);
  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: data.payload
          ? `${t("users")} (${data.payload.records.length}/${session.orgPlan.maxUserCount})`
          : t("users"),
      },
    ],
    [t, data.payload, session.orgPlan],
  );

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(
    async (record: IDtoUserListItem) => {
      const fullName = `${record.name} ${record.surname || ""}`.trim();
      await push(
        t("msgRecordWillBeDeleted", { subject: fullName }),
        async () => {
          const res = await Api.DELETE("/u/base/user/item/{id}", {
            params: { path: { id: record.id } },
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

  const actions = useCallback<IDropdownListCallback<IDtoUserListItem>>(
    (d) => [
      {
        icon: ShieldCheck,
        label: t("permissions"),
        path: `/conf/user/permission/${d.id}`,
      },
      {
        icon: Pencil,
        label: t("edit"),
        path: `/conf/user/item/${d.id}`,
      },
      {
        icon: Trash2,
        label: t("_delete"),
        onClick: handleDelete,
      },
    ],
    [handleDelete, t],
  );

  const cantAddNewUser =
    data.payload &&
    (!session.orgPlan.maxUserCount ||
      data.payload.records.length >= session.orgPlan.maxUserCount);

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("name") },
      { label: t("surname"), hideMd: true },
      { label: t("position"), hideLg: true },
      { label: t("phone"), hideLg: true },
      { label: t("email"), hideSm: true },
      { label: t("lastSession"), right: true, hideMd: true },
      { label: t("createdAt"), right: true, hideLg: true },
      { label: "", right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow space-x-2 justify-end">
        <CLinkAdd path="/conf/user/item-add" disabled={cantAddNewUser} />
        <CButtonRefresh onClick={load} />
      </CLine>
      <CAsyncLoader data={data} arrayField="records">
        {(payload) => {
          return (
            <div className="space-y-2">
              {cantAddNewUser && (
                <CMessageCard message={t("msgUserLimitWarning")} />
              )}
              <CTable noOverflow header={header}>
                {payload.records.map((d) => [
                  <div key="name">
                    {d.name}{" "}
                    {session.userId === d.id && <CBadge value={t("you")} />}
                  </div>,
                  d.surname || "-",
                  d.position || "-",
                  d.phone ? <CBadgePhone key="phone" value={d.phone} /> : "-",
                  d.email ? <CBadgeEmail key="email" value={d.email} /> : "-",
                  d.lastSessionAt ? (
                    <CDisplayDateAgo
                      key="lastSession"
                      value={d.lastSessionAt}
                    />
                  ) : (
                    <div key="lastSession">-</div>
                  ),
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
            </div>
          );
        }}
      </CAsyncLoader>
    </CBody>
  );
}
