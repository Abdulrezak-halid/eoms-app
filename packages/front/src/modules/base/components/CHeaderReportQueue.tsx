import { CircleCheck, FileText, Trash2 } from "lucide-react";
import { useCallback } from "react";

import { useReport } from "@m/base/hooks/useReport";
import { IReportQueueSectionType } from "@m/base/interfaces/IReportQueueSection";
import { CButton } from "@m/core/components/CButton";
import { CButtonPopup } from "@m/core/components/CButtonPopup";
import { CMutedText } from "@m/core/components/CMutedText";
import { CNoRecord } from "@m/core/components/CNoRecord";
import { CPopupPanel } from "@m/core/components/CPopupPanel";
import { usePopupState } from "@m/core/hooks/usePopupState";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CHeaderReportQueue() {
  const { t } = useTranslation();
  const popupState = usePopupState();
  const {
    sections,
    groupedSections,
    clearSections,
    removeSectionByType,
    createReportFromQueue,
  } = useReport();

  const handleRemoveSectionType = useCallback(
    (type: IReportQueueSectionType) => {
      removeSectionByType(type);
    },
    [removeSectionByType],
  );

  const handleClear = useCallback(() => clearSections(), [clearSections]);

  const handleCreateReport = useCallback(() => {
    createReportFromQueue();
    popupState.setIsOpen(false);
  }, [createReportFromQueue, popupState]);

  const popupComponent = useCallback(
    () => (
      <CPopupPanel className="w-80 max-w-[calc(100vw-2rem)] p-3 space-y-3">
        <div className="font-bold text-accent-700 dark:text-accent-200">
          {t("reportSections")}
        </div>

        {groupedSections.length === 0 ? (
          <CNoRecord />
        ) : (
          <div className="space-y-1.5">
            {groupedSections.map((group) => {
              return (
                <div
                  key={group.type}
                  className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-1 flex items-center"
                >
                  <div
                    data-section-type={group.type}
                    className="grow min-w-0 mr-1"
                  >
                    <div className="rounded-md p-1.5 flex items-center space-x-2">
                      <CircleCheck className="text-accent-600" size={20} />

                      <CMutedText className="truncate font-bold">
                        {t(group.labelKey)}
                      </CMutedText>
                    </div>
                  </div>

                  <CButton
                    icon={Trash2}
                    value={group.type}
                    onClick={handleRemoveSectionType}
                    hideLabelLg
                    tertiary
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between space-x-2 pt-1">
          <CButton label={t("clear")} onClick={handleClear} tertiary />

          <CButton
            label={t("createReport")}
            onClick={handleCreateReport}
            primary
          />
        </div>
      </CPopupPanel>
    ),
    [
      groupedSections,
      handleClear,
      handleCreateReport,
      handleRemoveSectionType,
      t,
    ],
  );

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <CButtonPopup
        icon={FileText}
        label={t("report")}
        popupComponent={popupComponent}
        popupState={popupState}
        tertiary
        hideLabelLg
      />

      {sections.length > 0 && (
        <div className="absolute -top-1 -right-1 pointer-events-none z-10">
          <div className="text-xs font-bold bg-rose-600 dark:bg-rose-700 text-white px-1.5 leading-5 rounded-full min-w-5 text-center">
            {sections.length}
          </div>
        </div>
      )}
    </div>
  );
}
