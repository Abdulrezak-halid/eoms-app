import { AlarmClock, CircleAlert, Play, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDatetime } from "@m/base/components/CDisplayDatetime";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CBadge } from "@m/core/components/CBadge";
import { CButton } from "@m/core/components/CButton";
import { CCard } from "@m/core/components/CCard";
import { CIcon } from "@m/core/components/CIcon";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CMutedText } from "@m/core/components/CMutedText";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { useScheduleTypeMap } from "../hooks/useScheduleType";
import {
  IDtoJobListResponse,
  IDtoJobRunRequest,
} from "../interfaces/IDtoServiceJob";

export function CJobList() {
  const { t } = useTranslation();
  const scheduleMap = useScheduleTypeMap();

  const breadcrumbs = useMemo<IBreadCrumb[]>(() => [{ label: t("jobs") }], [t]);

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/sys/job");
  }, []);
  const [data, load] = useLoader(fetcher);

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleRun = useCallback(
    async (record: IDtoJobListResponse) => {
      const runData: IDtoJobRunRequest = {
        name: record.meta.name,
        param: record.meta.param,
      };
      const res = await Api.POST("/u/sys/job/run", {
        body: runData,
      });
      apiToast(res);
      if (!res.error) {
        await load();
      }
    },
    [apiToast, load],
  );

  const handleDelete = useCallback(
    async (records: IDtoJobListResponse) => {
      await push(
        t("msgRecordWillBeDeleted", {
          subject: records.meta.name,
        }),
        async () => {
          const res = await Api.DELETE("/u/sys/job/remove/{id}", {
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

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow space-x-2 justify-end">
        <CLink
          icon={AlarmClock}
          label={t("schedule")}
          path="/sys/job-schedule/add"
        />
        <CLink icon={Play} label={t("run")} path="/sys/job-run/add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <div className="space-y-4">
            {payload.records.map((d) => (
              <CCard key={d.id} className="p-4 space-y-4">
                <CLine className="justify-between items-center space-x-2">
                  <div className="font-bold truncate">{d.meta.name}</div>

                  <div className="flex items-center space-x-2">
                    {d.runFailCount > 0 && (
                      <CBadge
                        value={`${t("failedCount")}: ${d.runFailCount}`}
                        className="text-rose-600 dark:text-rose-300"
                      />
                    )}
                    <CBadge value={`${t("runCount")}: ${d.runCount}`} />
                    <CButton
                      icon={Play}
                      label={t("run")}
                      value={d}
                      onClick={handleRun}
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

                <div className="flex flex-col @md:flex-row justify-between grow gap-x-4 gap-y-2">
                  <div className="w-full @md:w-1/4">
                    <CMutedText>{t("type")}</CMutedText>
                    <div>
                      <CBadge
                        key={d.id}
                        value={scheduleMap[d.meta.type].label}
                      />
                    </div>
                  </div>
                  <div className="w-full @md:w-1/4">
                    <CMutedText>{t("parameter")}</CMutedText>
                    <div className="break-words">
                      {JSON.stringify(d.meta.param, null, 2)}
                    </div>
                  </div>
                  {d.meta.type === "CRON" ? (
                    <>
                      <div className="w-full @md:w-1/4">
                        <CMutedText>{t("rule")}</CMutedText>
                        <div>{d.meta.rule}</div>
                      </div>
                      <div className="w-full @md:w-1/4">
                        <CMutedText>{t("priority")}</CMutedText>
                        <div>{d.meta.priority || "-"}</div>
                      </div>
                    </>
                  ) : d.meta.type === "ONE_TIME" ? (
                    <div className="w-full @md:w-1/4">
                      <CMutedText>{t("datetime")}</CMutedText>
                      <div>
                        <CDisplayDatetime key={d.id} value={d.meta.datetime} />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full @md:w-1/4" />
                  )}
                </div>

                {d.failInfo && (
                  <CLine className="space-x-1 text-rose-600 dark:text-rose-400">
                    <CIcon value={CircleAlert} />
                    <div>{d.failInfo.msg}</div>
                    <CDisplayDatetime value={d.failInfo.datetime} />
                  </CLine>
                )}
              </CCard>
            ))}
          </div>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
