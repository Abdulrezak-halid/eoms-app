import { useEffect, useState } from "react";

import { CChart } from "@m/base/components/CChart";
import { CMultiSelectSeu } from "@m/base/components/CMultiSelectSeu";
import { useEnergyResourceMap } from "@m/base/hooks/useEnergyResourceMap";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CCheckbox } from "@m/core/components/CCheckbox";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CFormTitle } from "@m/core/components/CFormTitle";
import { CMutedText } from "@m/core/components/CMutedText";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IDatetimeRange } from "@m/core/interfaces/IDatetimeRange";

import { useFetchSeuGraphsGroupedByEnergyResource } from "../hooks/useFetchSeuGraphsGroupedByEnergyResource";
import { IDtoReportSectionContent } from "../interfaces/IDtoReport";
import { CMessageSelectDateRange } from "./CMessageSelectDateRange";
import { CRadioGroupPrimaryRecord } from "./CRadioGroupPrimaryRecord";

export function CReportSectionSeuGraph({
  content,
  datetimeRange,
  onChange,
  onInvalidChange,
}: {
  content?: Extract<IDtoReportSectionContent, { type: "SEU_GRAPH" }>;
  datetimeRange?: IDatetimeRange;
  onChange: (value: IDtoReportSectionContent) => void;
  onInvalidChange: (value: boolean) => void;
}) {
  const { t } = useTranslation();

  const [primary, setPrimary] = useState(content?.primary ?? true);
  const [noGroup, setNoGroup] = useState(content?.noGroup ?? false);
  const inputSeuIds = useInput<string[]>(content?.seuIds || []);
  const invalid = useInputInvalid(inputSeuIds);

  useEffect(() => {
    onInvalidChange(invalid);
  }, [invalid, onInvalidChange]);

  useEffect(() => {
    onChange({
      type: "SEU_GRAPH",
      seuIds: primary ? undefined : inputSeuIds.value,
      primary,
      noGroup,
    });
  }, [inputSeuIds.value, noGroup, onChange, primary]);

  const data = useFetchSeuGraphsGroupedByEnergyResource({
    seuIds: inputSeuIds.value,
    primary,
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
            <CFormTitle value={t("seuGraph")} />

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
