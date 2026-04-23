import { ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { useCallback, useState } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeEnergyResource } from "@m/base/components/CBadgeEnergyResource";
import { useGlobalDatetimeRange } from "@m/base/hooks/useGlobalDatetimeRange";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CButton } from "@m/core/components/CButton";
import { CCard } from "@m/core/components/CCard";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CIcon } from "@m/core/components/CIcon";
import { CLine } from "@m/core/components/CLine";
import { CMutedText } from "@m/core/components/CMutedText";
import { CNoRecord } from "@m/core/components/CNoRecord";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoSeuSuggestion } from "../interfaces/IDtoSeu";
import { CBadgeMeterSlice } from "./CBadgeMeterSlice";

interface ICSeuSuggestionsProps {
  onSelect: (suggestion: IDtoSeuSuggestion, index: number) => void;
  selectedIndex?: number | null;
}

export function CSeuSuggestions({
  onSelect,
  selectedIndex = null,
}: ICSeuSuggestionsProps) {
  const { t } = useTranslation();

  const range = useGlobalDatetimeRange();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const fetcher = useCallback(() => {
    return Api.GET("/u/measurement/seu/suggest", {
      params: {
        query: {
          minConsumptionPercentage: 80,
          ...range,
        },
      },
    });
  }, [range]);

  const [data] = useLoader(fetcher);

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <div className="mb-4">
      <div className="space-y-2">
        <div className="cursor-pointer" onClick={handleToggleCollapse}>
          <CLine className="justify-between items-center">
            <div className="flex items-center gap-2">
              <CIcon value={Lightbulb} className="text-yellow-500" />
              <div className="font-semibold">{t("seuSuggestions")}</div>
            </div>
            <CIcon value={isCollapsed ? ChevronDown : ChevronUp} />
          </CLine>
        </div>

        {!isCollapsed && (
          <div>
            <CAsyncLoader data={data} arrayField="records">
              {(payload) => (
                <>
                  {payload.records.length === 0 ? (
                    <div className="py-8">
                      <CNoRecord />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {payload.records.map((suggestion, index) => (
                        <CSuggestionCard
                          key={index}
                          suggestion={suggestion}
                          index={index}
                          isSelected={selectedIndex === index}
                          onSelect={onSelect}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </CAsyncLoader>
          </div>
        )}
      </div>
    </div>
  );
}

function CSuggestionCard({
  suggestion,
  index,
  isSelected,
  onSelect,
}: {
  suggestion: IDtoSeuSuggestion;
  index: number;
  isSelected: boolean;
  onSelect: (suggestion: IDtoSeuSuggestion, index: number) => void;
}) {
  const { t } = useTranslation();

  const handleClick = useCallback(() => {
    onSelect(suggestion, index);
  }, [onSelect, suggestion, index]);

  return (
    <CCard className="p-3">
      <CLine className="space-x-3 items-start">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col @sm:flex-row gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-bold truncate" title={suggestion.name}>
                {suggestion.name}
              </div>

              <div className="flex-shrink-0">
                <CBadgeEnergyResource value={suggestion.energyResource} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <CMutedText>{t("meters")}</CMutedText>
              <CGridBadge>
                {suggestion.meterSlices.map((d) => (
                  <CBadgeMeterSlice key={d.id} value={d.name} />
                ))}
              </CGridBadge>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <CButton
            label={t("select")}
            onClick={handleClick}
            primary={isSelected}
          />
        </div>
      </CLine>
    </CCard>
  );
}
