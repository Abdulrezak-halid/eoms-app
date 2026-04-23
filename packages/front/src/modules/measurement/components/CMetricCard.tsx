/**
 * @file: CMetricCard.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 27.08.2025
 * Last Modified Date: 27.08.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { ChartLine, Pencil, Plug, Trash2 } from "lucide-react";
import { useCallback, useContext } from "react";

import { Api } from "@m/base/api/Api";
import { CMiniChart } from "@m/base/components/CMiniChart";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useGlobalDatetimeRange } from "@m/base/hooks/useGlobalDatetimeRange";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CCard } from "@m/core/components/CCard";
import { CDropdown, IDropdownListCallback } from "@m/core/components/CDropdown";
import { CLine } from "@m/core/components/CLine";
import { CLinkCore } from "@m/core/components/CLinkCore";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoMetricResponse } from "../interfaces/IDtoMetric";
import { CMetricCardBody } from "./CMetricCardBody";

export function CMetricCard({
  data,
  load,
  searchQuery,
}: {
  data: IDtoMetricResponse;
  load: () => Promise<void>;
  searchQuery?: string;
}) {
  const { t } = useTranslation();

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const range = useGlobalDatetimeRange();

  const graphFetcher = useCallback(() => {
    return Api.GET("/u/measurement/metric/item/{id}/graph", {
      params: {
        path: { id: data.id },
        query: {
          lowResolutionMode: "true",
          ...range,
        },
      },
    });
  }, [data.id, range]);

  const [graphData] = useLoader(graphFetcher);

  const handleDelete = useCallback(async () => {
    await push(
      t("msgRecordWillBeDeleted", { subject: data.name }),
      async () => {
        const res = await Api.DELETE("/u/measurement/metric/item/{id}", {
          params: { path: { id: data.id } },
        });
        apiToast(res);
        if (res.error === undefined) {
          await load();
        }
      },
    );
  }, [apiToast, data, load, push, t]);

  const actions = useCallback<IDropdownListCallback<IDtoMetricResponse>>(
    (d) => [
      {
        icon: ChartLine,
        label: t("values"),
        path: `/measurements/metric/values/graph/${d.id}`,
      },
      {
        icon: Plug,
        label: t("integration"),
        path: d.outboundIntegration
          ? `/measurements/metric-integration/outbound/item/${d.outboundIntegration.id}`
          : d.inboundIntegration
            ? `/measurements/metric-integration/inbound/item/${d.inboundIntegration.id}`
            : undefined,
        disabled: !d.outboundIntegration && !d.inboundIntegration,
      },
      {
        icon: Pencil,
        label: t("edit"),
        path: `/measurements/metric/item/${d.id}`,
      },
      {
        icon: Trash2,
        label: t("_delete"),
        onClick: handleDelete,
      },
    ],
    [handleDelete, t],
  );

  return (
    <CCard key={data.id} className="p-3 space-y-4">
      <CLine className="space-x-3">
        <div className="grow flex flex-col gap-3 @sm:flex-row @sm:items-center min-w-0">
          <div className="grow min-w-0">
            <CMetricCardBody data={data} searchQuery={searchQuery} />
          </div>

          <CLinkCore
            path={`/measurements/metric/values/graph/${data.id}`}
            className="flex-none @sm:w-36 focus:x-outline rounded-md"
            title={t("values")}
          >
            <CAsyncLoader data={graphData} inline>
              {(payload) => (
                // No need to multiply value with multiplier,
                //   since only the shape is displayed
                <CMiniChart
                  data={payload.values}
                  className="h-16"
                  clickable
                  {...range}
                />
              )}
            </CAsyncLoader>
          </CLinkCore>
        </div>

        <div className="py-1">
          <CDropdown
            list={actions}
            value={data}
            label={t("actions")}
            hideLabelLg
          />
        </div>
      </CLine>
    </CCard>
  );
}
