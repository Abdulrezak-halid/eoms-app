import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CButton } from "@m/core/components/CButton";
import { CCard } from "@m/core/components/CCard";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CMutedText } from "@m/core/components/CMutedText";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CTokenViewer } from "../components/CTokenViewer";
import { IDtoPersonalTokenResponse } from "../interfaces/IDtoPersonalToken";

export function CPersonalTokenList() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("personalTokens") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/base/user-token/item");
  }, []);
  const [data, load] = useLoader(fetcher);

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(
    async (record: IDtoPersonalTokenResponse) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.name }),
        async () => {
          const res = await Api.DELETE("/u/base/user-token/item/{id}", {
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

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow space-x-2 justify-end">
        <CLinkAdd path="/my-profile/personal-tokens/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <div className="space-y-2">
            {payload.records.map((d) => (
              <CCard key={d.id} className="p-4 space-y-2">
                <CLine className="@lg:hidden justify-between items-start space-x-2">
                  <div className="font-bold pt-3 truncate">{d.name}</div>
                  <div className="flex space-x-2">
                    <CLink
                      icon={Pencil}
                      label={t("edit")}
                      path={`/my-profile/personal-tokens/item/${d.id}`}
                      hideLabelLg
                    />
                    <CButton
                      icon={Trash2}
                      label={t("_delete")}
                      value={d}
                      onClick={handleDelete}
                      hideLabelLg
                    />
                  </div>
                </CLine>

                <div className="flex flex-col @lg:flex-row @lg:items-center gap-2">
                  <CMutedText className="hidden @lg:block @lg:w-1/3 shrink-0 truncate">
                    {d.name}
                  </CMutedText>

                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <CTokenViewer value={d.token} />

                    <div className="hidden @lg:flex items-center gap-2 shrink-0">
                      <CLink
                        icon={Pencil}
                        path={`/my-profile/personal-tokens/item/${d.id}`}
                        hideLabelLg
                      />
                      <CButton
                        icon={Trash2}
                        value={d}
                        onClick={handleDelete}
                        hideLabelLg
                      />
                    </div>
                  </div>
                </div>
              </CCard>
            ))}
          </div>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
