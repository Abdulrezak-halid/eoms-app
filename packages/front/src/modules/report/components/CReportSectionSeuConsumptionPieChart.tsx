/**
 * @file: CReportSectionSeuConsumptionPieChart.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 07.01.2026
 * Last Modified Date: 07.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useEffect, useState } from "react";

import { CMultiSelectSeu } from "@m/base/components/CMultiSelectSeu";
import { useEnergyResourceMap } from "@m/base/hooks/useEnergyResourceMap";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CCheckbox } from "@m/core/components/CCheckbox";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CFormTitle } from "@m/core/components/CFormTitle";
import { CMutedText } from "@m/core/components/CMutedText";
import { CPieChart } from "@m/core/components/CPieChart";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IDatetimeRange } from "@m/core/interfaces/IDatetimeRange";

import { useFetchSeuPiesGroupedByEnergyResource } from "../hooks/useFetchSeuPiesGroupedByEnergyResource";
import { IDtoReportSectionContent } from "../interfaces/IDtoReport";
import { CMessageSelectDateRange } from "./CMessageSelectDateRange";
import { CRadioGroupPrimaryRecord } from "./CRadioGroupPrimaryRecord";

export function CReportSectionSeuConsumptionPieChart({
  datetimeRange,
  content,
  onChange,
  onInvalidChange,
}: {
  datetimeRange?: IDatetimeRange;
  content?: Extract<
    IDtoReportSectionContent,
    { type: "SEU_TOTAL_CONSUMPTION_PIE_CHART" }
  >;
  onChange: (value: IDtoReportSectionContent) => void;
  onInvalidChange: (value: boolean) => void;
}) {
  const [primary, setPrimary] = useState(content?.primary ?? true);
  const [noGroup, setNoGroup] = useState(content?.noGroup ?? false);
  const inputSeuIds = useInput<string[]>(content?.seuIds || []);
  const invalid = useInputInvalid(inputSeuIds);

  useEffect(() => {
    onInvalidChange(invalid);
  }, [invalid, onInvalidChange]);

  useEffect(() => {
    onChange({
      type: "SEU_TOTAL_CONSUMPTION_PIE_CHART",
      seuIds: primary ? undefined : inputSeuIds.value,
      primary,
      noGroup,
    });
  }, [inputSeuIds.value, noGroup, onChange, primary]);

  const { t } = useTranslation();

  const data = useFetchSeuPiesGroupedByEnergyResource({
    primary,
    seuIds: inputSeuIds.value,
    noGroup,
    datetimeRange,
  });

  const energyResourceMap = useEnergyResourceMap();

  return (
    <>
      <CFormPanel>
        <CFormLine label={t("seus")} invalidMsg={inputSeuIds.invalidMsg}>
          <div className="space-y-2">
            <CRadioGroupPrimaryRecord value={primary} onChange={setPrimary} />
            <CMultiSelectSeu {...inputSeuIds} required disabled={primary} />
          </div>
        </CFormLine>

        <CFormLine label={t("combineAllResources")}>
          <CCheckbox selected={noGroup} onChange={setNoGroup} />
        </CFormLine>
      </CFormPanel>

      {(inputSeuIds.value.length !== 0 || primary) &&
        (!datetimeRange ? (
          <CMessageSelectDateRange />
        ) : (
          <>
            <CFormTitle value={t("graph")} />

            <CAsyncLoader data={data}>
              {(payload) => (
                <div className="space-y-6">
                  {payload.map(({ energyResource, pieData, unit }, index) => (
                    <div key={energyResource ?? `all-resources-${index}`}>
                      {energyResource && (
                        <CMutedText className="text-lg mb-3">
                          {energyResourceMap[energyResource].label}
                        </CMutedText>
                      )}

                      <CPieChart
                        data={pieData}
                        unit={unit}
                        disableInteractiveLegend
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
