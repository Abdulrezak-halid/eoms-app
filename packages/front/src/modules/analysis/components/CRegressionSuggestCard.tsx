import { ArrowRight, Pointer, Trash2 } from "lucide-react";
import { useCallback, useContext } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeSeu } from "@m/base/components/CBadgeSeu";
import { CDisplayDateAgo } from "@m/base/components/CDisplayDateAgo";
import { CDisplayDate } from "@m/base/components/CDisplayDatetime";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CButton } from "@m/core/components/CButton";
import { CCard } from "@m/core/components/CCard";
import { CCheckbox } from "@m/core/components/CCheckbox";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CIcon } from "@m/core/components/CIcon";
import { CLink } from "@m/core/components/CLink";
import { CMutedText } from "@m/core/components/CMutedText";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { CBadgeMetric } from "@m/measurement/components/CBadgeMetric";
import { CBadgeMessageQueueTaskStatus } from "@m/report/components/CBadgeMessageQueueTaskStatus";

import { IDtoAdvancedRegressionSuggestItem } from "../interfaces/IDtoRegressionAnalyses";

export function CRegressionSuggestCard({
  data,
  load,
  selected,
  onCheckboxClick,
}: {
  data: IDtoAdvancedRegressionSuggestItem;
  load: () => Promise<void>;
  selected?: boolean;
  onCheckboxClick?: (id: string, selected: boolean) => void;
}) {
  const { t } = useTranslation();
  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(async () => {
    await push(
      t("msgRecordWillBeDeleted", { subject: data.seu.name }),
      async () => {
        const res = await Api.DELETE(
          "/u/analysis/advanced-regression/suggest/{id}",
          {
            params: { path: { id: data.id } },
          },
        );
        apiToast(res);
        if (res.error === undefined) {
          await load();
        }
      },
    );
  }, [apiToast, data, load, push, t]);

  return (
    <CCard className="p-3">
      <div className="flex flex-col @sm:flex-row @sm:gap-2">
        {onCheckboxClick && (
          <div className="flex items-center justify-between @sm:hidden mb-2">
            <CCheckbox
              selected={selected}
              value={data.id}
              onClick={onCheckboxClick}
            />
            <div className="flex gap-2">
              {data.status === "SUCCESS" && data.drivers.length > 0 && (
                <CLink
                  icon={Pointer}
                  label={t("use")}
                  path={`/analysis/advanced-regression/item-add-from-suggestion/${data.id}`}
                />
              )}
              <CButton
                icon={Trash2}
                label={t("_delete")}
                value={data}
                onClick={handleDelete}
              />
            </div>
          </div>
        )}

        {onCheckboxClick && (
          <div className="hidden @sm:flex items-start -my-1">
            <CCheckbox
              selected={selected}
              value={data.id}
              onClick={onCheckboxClick}
            />
          </div>
        )}

        <div className="grow min-w-0">
          <CRegressionSuggestCardBody data={data} />
        </div>

        <div className="hidden @sm:flex gap-2 self-start">
          {data.status === "SUCCESS" && data.drivers.length > 0 && (
            <CLink
              icon={Pointer}
              label={t("use")}
              path={`/analysis/advanced-regression/item-add-from-suggestion/${data.id}`}
              hideLabelSm
            />
          )}

          <CButton
            icon={Trash2}
            label={t("_delete")}
            value={data}
            onClick={handleDelete}
            hideLabelSm
          />
        </div>
      </div>
    </CCard>
  );
}

export function CRegressionSuggestCardBody({
  data,
}: {
  data: IDtoAdvancedRegressionSuggestItem;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col @md:flex-row @md:items-start @md:gap-6">
      <div className="grow min-w-0 space-y-2">
        <CGridBadge>
          <CBadgeSeu value={data.seu.name} />
          <CBadgeMessageQueueTaskStatus
            value={data.status}
            failInfo={data.failInfo}
          />
        </CGridBadge>

        <div className="flex items-center gap-1">
          <CMutedText>{t("range")}</CMutedText>
          <CDisplayDate value={data.datetimeStart} />
          <CIcon value={ArrowRight} sm />
          <CDisplayDate value={data.datetimeEnd} />
        </div>

        <div className="flex items-center gap-1">
          <CMutedText>{t("createdAt")}</CMutedText>
          <CDisplayDateAgo value={data.createdAt} />
        </div>
      </div>

      {data.status === "SUCCESS" && (
        <div className="flex-none @md:w-56 @lg:w-72 min-w-0">
          {data.drivers.length > 0 ? (
            <div className="space-y-1">
              <CMutedText>{t("drivers")}</CMutedText>
              <CGridBadge>
                {data.drivers.map((d) => (
                  <CBadgeMetric key={d.id} value={d.name} />
                ))}
              </CGridBadge>
            </div>
          ) : (
            <CMutedText>{t("noDriverFound")}</CMutedText>
          )}
        </div>
      )}
    </div>
  );
}
