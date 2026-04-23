import { useCallback, useEffect, useMemo, useState } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeEnergyResource } from "@m/base/components/CBadgeEnergyResource";
import { CBadgeSeu } from "@m/base/components/CBadgeSeu";
import { CMultiSelectSeu } from "@m/base/components/CMultiSelectSeu";
import { useUnitInfo } from "@m/base/hooks/useUnitMultiplierAndAbbr";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CBadgePercentage } from "@m/core/components/CBadgePercentage";
import { CDisplayNumber } from "@m/core/components/CDisplayNumber";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CTable } from "@m/core/components/CTable";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IDatetimeRange } from "@m/core/interfaces/IDatetimeRange";

import { IDtoReportSectionContent } from "../interfaces/IDtoReport";
import { customTableConverterSeuConsumptionTable } from "../utils/customTableConverterSeuConsumptionTable";
import { CButtonReportSectionCustomTableConverter } from "./CButtonReportSectionCustomTableConverter";
import { CMessageSelectDateRange } from "./CMessageSelectDateRange";
import { CRadioGroupPrimaryRecord } from "./CRadioGroupPrimaryRecord";

export function CReportSectionSeuConsumptionTable({
  content,
  onChange,
  onInvalidChange,
  datetimeRange,
}: {
  content?: Extract<
    IDtoReportSectionContent,
    { type: "SEU_CONSUMPTION_TABLE" }
  >;
  onChange: (value: IDtoReportSectionContent) => void;
  onInvalidChange: (value: boolean) => void;
  datetimeRange?: IDatetimeRange;
}) {
  const { t } = useTranslation();

  const [primary, setPrimary] = useState(content?.primary ?? true);
  const inputSeuIds = useInput<string[]>(content?.seuIds || []);
  const invalid = useInputInvalid(inputSeuIds);

  useEffect(() => {
    onInvalidChange(invalid);
  }, [invalid, onInvalidChange]);

  useEffect(() => {
    onChange({
      type: "SEU_CONSUMPTION_TABLE",
      seuIds: primary ? undefined : inputSeuIds.value,
      primary,
    });
  }, [inputSeuIds.value, onChange, primary]);

  const fetcher = useCallback(async () => {
    if (!datetimeRange) {
      return;
    }

    const seuIds = inputSeuIds.value;

    if (!primary && (!seuIds || seuIds.length === 0)) {
      return;
    }

    return await Api.GET("/u/measurement/seu/item", {
      params: {
        query: {
          primary: primary ? "true" : undefined,
          seuIds: !primary && seuIds ? seuIds.join(",") : undefined,
          ...datetimeRange,
        },
      },
    });
  }, [datetimeRange, inputSeuIds.value, primary]);

  const [data] = useLoader(fetcher);

  const { multiplier, abbr } = useUnitInfo("ENERGY");

  const header = useMemo(
    () => [
      { label: t("significantEnergyUser") },
      { label: t("resource") },
      { label: t("consumption"), right: true },
      { label: t("percentage"), right: true },
    ],
    [t],
  );

  return (
    <div className="space-y-3">
      <CFormPanel>
        <CFormLine label={t("seus")} invalidMsg={inputSeuIds.invalidMsg}>
          <div className="space-y-2">
            <CRadioGroupPrimaryRecord value={primary} onChange={setPrimary} />
            <CMultiSelectSeu {...inputSeuIds} required disabled={primary} />
          </div>
        </CFormLine>
      </CFormPanel>

      {(inputSeuIds.value.length !== 0 || primary) &&
        (!datetimeRange ? (
          <CMessageSelectDateRange />
        ) : (
          <>
            <CAsyncLoader data={data} showSpinnerDuringNoFetch>
              {(payload) => (
                <div className="space-y-3">
                  <CButtonReportSectionCustomTableConverter
                    data={payload.records}
                    converter={customTableConverterSeuConsumptionTable}
                    onChange={onChange}
                  />

                  <CTable header={header} bordered>
                    {payload.records.map((row) => [
                      <CBadgeSeu key="seu" value={row.name} wrap />,
                      <CBadgeEnergyResource
                        key="energy-resource"
                        value={row.energyResource}
                      />,
                      <CDisplayNumber
                        key="consumption"
                        value={
                          row.consumption !== null
                            ? row.consumption * multiplier
                            : undefined
                        }
                        unitStr={abbr}
                      />,
                      row.percentage !== null ? (
                        <CBadgePercentage
                          key="percentage"
                          value={row.percentage}
                          inline
                        />
                      ) : (
                        ""
                      ),
                    ])}
                  </CTable>
                </div>
              )}
            </CAsyncLoader>
          </>
        ))}
    </div>
  );
}
