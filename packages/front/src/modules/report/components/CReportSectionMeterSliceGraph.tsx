/**
 * @file: CReportSectionMeterSliceGraph.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 08.01.2026
 * Last Modified Date: 08.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useEffect, useState } from "react";

import { CChart } from "@m/base/components/CChart";
import { useEnergyResourceMap } from "@m/base/hooks/useEnergyResourceMap";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CCheckbox } from "@m/core/components/CCheckbox";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CFormTitle } from "@m/core/components/CFormTitle";
import { CMutedText } from "@m/core/components/CMutedText";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IDatetimeRange } from "@m/core/interfaces/IDatetimeRange";
import { CMultiSelectMeterSlice } from "@m/measurement/components/CMultiSelectMeterSlice";

import { useFetchMeterSliceGraphsGroupedByEnergyResource } from "../hooks/useFetchMeterSliceGraphsGroupedByEnergyResource";
import { IDtoReportSectionContent } from "../interfaces/IDtoReport";
import { CMessageSelectDateRange } from "./CMessageSelectDateRange";

export function CReportSectionMeterSliceGraph({
  datetimeRange,
  content,
  onChange,
  onInvalidChange,
}: {
  datetimeRange?: IDatetimeRange;
  content: Extract<IDtoReportSectionContent, { type: "METER_SLICE_GRAPH" }>;
  onChange: (value: IDtoReportSectionContent) => void;
  onInvalidChange: (value: boolean) => void;
}) {
  const { t } = useTranslation();

  const [noGroup, setNoGroup] = useState(content.noGroup ?? false);
  const inputMeterSliceIds = useInput<string[]>(content.sliceIds || []);
  const invalid = useInputInvalid(inputMeterSliceIds);

  useEffect(() => {
    onInvalidChange(invalid);
  }, [invalid, onInvalidChange]);

  useEffect(() => {
    onChange({
      type: "METER_SLICE_GRAPH",
      sliceIds: inputMeterSliceIds.value,
      noGroup,
    });
  }, [inputMeterSliceIds.value, noGroup, onChange]);

  const data = useFetchMeterSliceGraphsGroupedByEnergyResource({
    sliceIds: inputMeterSliceIds.value,
    noGroup,
    datetimeRange,
  });

  const energyResourceMap = useEnergyResourceMap();

  return (
    <>
      <CFormPanel>
        <CFormLine
          label={t("meters")}
          invalidMsg={inputMeterSliceIds.invalidMsg}
        >
          <CMultiSelectMeterSlice
            {...inputMeterSliceIds}
            includeMains
            allEnergyResources
            required
          />
        </CFormLine>

        <CFormLine label={t("combineAllResources")}>
          <CCheckbox selected={noGroup} onChange={setNoGroup} />
        </CFormLine>
      </CFormPanel>

      {inputMeterSliceIds.value.length !== 0 &&
        (!datetimeRange ? (
          <CMessageSelectDateRange />
        ) : (
          <>
            <CFormTitle value={t("graph")} />

            <CAsyncLoader data={data} showSpinnerDuringNoFetch>
              {(payload) => (
                <div className="space-y-6">
                  {payload.map(({ energyResource, series, unit }, index) => (
                    <div key={energyResource ?? `all-resources-${index}`}>
                      {energyResource && (
                        <CMutedText className="text-lg mb-3">
                          {energyResourceMap[energyResource].label}
                        </CMutedText>
                      )}

                      <CChart
                        series={series}
                        type="line"
                        unitStr={unit}
                        disableInteractiveLegend
                        {...datetimeRange}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CAsyncLoader>
          </>
        ))}
    </>
  );
}
