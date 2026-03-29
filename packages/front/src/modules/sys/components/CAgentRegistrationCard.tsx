import { ChartNoAxesColumn, Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext } from "react";

import { CBadgeAgentStatus } from "@m/agent-management/components/CBadgeAgentStatus";
import { Api } from "@m/base/api/Api";
import { CDisplayDateAgo } from "@m/base/components/CDisplayDateAgo";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CBadge } from "@m/core/components/CBadge";
import { CButton } from "@m/core/components/CButton";
import { CCard } from "@m/core/components/CCard";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CMutedText } from "@m/core/components/CMutedText";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoAgentRegistrationListItem } from "../interfaces/IDtoAgentRegistration";

export function CAgentRegistrationCard({
  data,
  load,
}: {
  data: IDtoAgentRegistrationListItem;
  load: () => Promise<void>;
}) {
  const { t } = useTranslation();
  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(async () => {
    await push(
      t("msgRecordWillBeDeleted", {
        subject: data.name,
      }),
      async () => {
        const res = await Api.DELETE("/u/sys/agent/item/{id}", {
          params: { path: { id: data.id } },
        });
        apiToast(res);
        if (res.error === undefined) {
          await load();
        }
      },
    );
  }, [apiToast, data.id, data.name, load, push, t]);

  return (
    <CCard className="p-3 space-y-2">
      <div className="flex flex-col items-start @sm:flex-row @sm:items-center gap-2">
        <CBadgeAgentStatus
          statType={data.statType}
          datetimeStat={data.datetimeStat}
        />
        <div className="grow">{data.name}</div>

        {data.datetimeStat && (
          <div className="space-x-2">
            <CMutedText value={t("lastContact")} />
            <CDisplayDateAgo value={data.datetimeStat} />
          </div>
        )}
      </div>

      <CLine className="space-x-4">
        <div className="flex flex-col @md:flex-row justify-between grow gap-x-4 gap-y-2">
          <div className="w-2/3 space-y-2">
            <div>
              <CBadge value={`ID: ${data.id}`} wrap />
            </div>
            <div>
              <CMutedText>{t("serialNo")}</CMutedText>
              <div>{data.serialNo}</div>
            </div>

            <div>
              <CMutedText>{t("description")}</CMutedText>
              <div className="whitespace-pre-line">
                {data.description || <CMutedText>-</CMutedText>}
              </div>
            </div>
          </div>

          <div className="w-1/3 space-y-2">
            <div>
              <CMutedText>{t("sysOrganization")}</CMutedText>
              <div>
                {data.assignedOrg && (
                  <CBadge
                    key={data.assignedOrg.id}
                    value={data.assignedOrg.displayName}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <CLine className="space-x-2">
          <CLink
            icon={ChartNoAxesColumn}
            label={t("stats")}
            path={`/sys/agent-registration/item-stats/${data.id}`}
            hideLabelLg
          />
          <CLink
            icon={Pencil}
            label={t("edit")}
            path={`/sys/agent-registration/item/${data.id}`}
            hideLabelLg
          />
          <CButton
            icon={Trash2}
            label={t("_delete")}
            onClick={handleDelete}
            hideLabelLg
          />
        </CLine>
      </CLine>
    </CCard>
  );
}
