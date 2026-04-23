/**
 * @file: useMetricResourceOptions.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 27.12.2025
 * Last Modified Date: 27.12.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IUnitGroup } from "common";
import { IDtoEMetricType } from "common/build-api-schema";
import { useCallback } from "react";

import { Api, InferApiGetResponse } from "@m/base/api/Api";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { renderMetricResource } from "../utils/renderMetricResource";

export function useMetricResourceOptions({
  metricId,
  listWithMetrics,
  metricType,
  metricUnitGroup,
}: {
  metricId?: string;
  listWithMetrics?: boolean;
  metricType?: IDtoEMetricType;
  metricUnitGroup?: IUnitGroup;
}) {
  const { t } = useTranslation();

  const loader = useCallback(async () => {
    if (!listWithMetrics && !metricId) {
      return undefined;
    }
    return await Api.GET("/u/measurement/metric/resources", {
      params: { query: { metricId } },
    });
  }, [listWithMetrics, metricId]);

  const [data] = useLoader(loader);

  // Using metricId in middleware dep, middleware runs unnecessarily on metric
  //   id change
  const noMetric = !metricId;

  const middleware = useCallback(
    (payload: InferApiGetResponse<"/u/measurement/metric/resources">) =>
      payload.records
        .filter(
          (d) =>
            (!metricType || d.metric.type === metricType) &&
            (!metricUnitGroup || d.metric.unitGroup === metricUnitGroup),
        )
        .map((d) => {
          return {
            label: renderMetricResource(t, d, noMetric),
            value: d.id,
          };
        }),
    [noMetric, metricType, metricUnitGroup, t],
  );

  return useLoaderMiddleware(data, middleware);
}
