import { IDtoEEnergyResource } from "common/build-api-schema";
import { useCallback, useMemo, useState } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CComboboxEnergyResource } from "@m/base/components/CComboboxEnergyResource";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useEnergyResourceMap } from "@m/base/hooks/useEnergyResourceMap";
import { useGlobalDatetimeRange } from "@m/base/hooks/useGlobalDatetimeRange";
import {
  CAsyncLoader,
  IExtractAsyncData,
} from "@m/core/components/CAsyncLoader";
import { CHr } from "@m/core/components/CHr";
import { CLine } from "@m/core/components/CLine";
import { CMutedText } from "@m/core/components/CMutedText";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CMeterCard } from "./CMeterCard";

export function CMeterList() {
  const { t } = useTranslation();

  const [selectedEnergyResource, setSelectedEnergyResource] = useState<
    IDtoEEnergyResource | undefined
  >(undefined);

  const energyResourceMap = useEnergyResourceMap();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("meters") }],
    [t],
  );

  const range = useGlobalDatetimeRange();

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/measurement/meter/item", {
      params: {
        query: {
          ...range,
          energyResource: selectedEnergyResource,
        },
      },
    });
  }, [range, selectedEnergyResource]);

  const [data, load] = useLoader(fetcher);

  const middleware = useCallback((payload: IExtractAsyncData<typeof data>) => {
    const groupedByResource = payload.records.reduce(
      (acc, record) => {
        const key = record.energyResource;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(record);
        return acc;
      },
      {} as Partial<Record<IDtoEEnergyResource, typeof payload.records>>,
    );

    const groups = (
      Object.entries(groupedByResource) as [
        IDtoEEnergyResource,
        typeof payload.records,
      ][]
    ).map(([energyResource, records]) => ({ energyResource, records }));

    return { groups };
  }, []);

  const processedData = useLoaderMiddleware(data, middleware);

  return (
    <CBody breadcrumbs={breadcrumbs} showGlobalFilter>
      <div className="flex flex-col @sm:flex-row gap-2">
        <CLine className="flex-col @sm:flex-row gap-2 items-start w-full @sm:grow">
          <CComboboxEnergyResource
            value={selectedEnergyResource}
            onChange={setSelectedEnergyResource}
            className="w-full @sm:flex-1 @sm:min-w-0"
          />
        </CLine>

        <CLine className="gap-2 justify-end @sm:flex-shrink-0">
          <CLinkAdd path="/measurements/meter/item-add" />
          <CButtonRefresh onClick={load} />
        </CLine>
      </div>

      <CAsyncLoader data={processedData} arrayField="groups">
        {(payload) => (
          <div className="space-y-12">
            {payload.groups.map((group) => (
              <div key={group.energyResource} className="space-y-2">
                {!selectedEnergyResource && (
                  <>
                    <CMutedText className="text-lg">
                      {energyResourceMap[group.energyResource].label}
                    </CMutedText>
                    <CHr />
                  </>
                )}

                {group.records.map((d) => (
                  <CMeterCard key={d.id} data={d} load={load} />
                ))}
              </div>
            ))}
          </div>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
