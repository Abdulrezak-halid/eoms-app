import { useCallback, useContext } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { Trash2 } from "lucide-react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDateAgo } from "@m/base/components/CDisplayDateAgo";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CBadge } from "@m/core/components/CBadge";
import { CButton } from "@m/core/components/CButton";
import { CCard } from "@m/core/components/CCard";
import { CInputContainer } from "@m/core/components/CInputContainer";
import { CLine } from "@m/core/components/CLine";
import { CMutedText } from "@m/core/components/CMutedText";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";

export function CSysIssues() {
  const { t } = useTranslation();

  const fetcher = useCallback(() => Api.GET("/u/sys/issue/item"), []);
  const [data, load] = useLoader(fetcher);

  const apiToast = useApiToast();
  const { push } = useContext(ContextAreYouSure);
  const handleDelete = useCallback(
    async (id: string) => {
      await push(null, async () => {
        const res = await Api.DELETE("/u/sys/issue/item", { body: { id } });
        apiToast(res);
        if (res.error === undefined) {
          await load();
        }
      });
    },
    [apiToast, load, push],
  );

  return (
    <CBody title={t("issuesRequests")}>
      <div className="space-y-4">
        <CLine className="justify-end">
          <CButtonRefresh onClick={load} />
        </CLine>

        <CAsyncLoader data={data}>
          {(payload) => (
            <div className="space-y-4">
              {payload.map((d) => (
                <CCard key={d.id} className="p-3 space-y-3">
                  <div className="flex space-x-3 items-start @sm:items-center">
                    <div className="flex flex-col items-start @sm:flex-row @sm:items-center @sm:space-x-3 grow">
                      {d.type === "BUG_REPORT" ? (
                        <CBadge
                          value={t("bugReport")}
                          className="text-rose-700"
                        />
                      ) : (
                        <CBadge value={t("featureRequest")} />
                      )}

                      <div>{d.createdByUserDisplayName}</div>

                      <CMutedText className="grow">
                        {d.orgDisplayName}
                      </CMutedText>

                      <CMutedText>
                        <CDisplayDateAgo value={d.createdAt} />
                      </CMutedText>
                    </div>

                    <CButton
                      icon={Trash2}
                      label={t("_delete")}
                      hideLabelLg
                      value={d.id}
                      onClick={handleDelete}
                    />
                  </div>

                  <CInputContainer className="px-3 py-2">
                    {d.description}
                  </CInputContainer>
                </CCard>
              ))}
            </div>
          )}
        </CAsyncLoader>
      </div>
    </CBody>
  );
}
