import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDateAgo } from "@m/base/components/CDisplayDateAgo";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CLine } from "@m/core/components/CLine";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CBadgeAgentStatus } from "../components/CBadgeAgentStatus";

export function CAgentsList() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo(() => [{ label: t("agents") }], [t]);

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/agent/assigned-items");
  }, []);

  const [data, load] = useLoader(fetcher);

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("status") },
      { label: t("name") },
      { label: t("serialNo"), hideSm: true },
      { label: t("description"), hideMd: true },
      { label: t("lastContact"), right: true, hideLg: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow justify-end">
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <CTable header={header}>
            {payload?.records.map((d) => [
              <CBadgeAgentStatus
                key="status"
                statType={d.statType}
                datetimeStat={d.datetimeStat}
              />,
              d.name,
              d.serialNo,
              d.description || "-",
              d.datetimeStat ? (
                <CDisplayDateAgo key="lastContact" value={d.datetimeStat} />
              ) : (
                <div key="lastContact">-</div>
              ),
            ])}
          </CTable>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
