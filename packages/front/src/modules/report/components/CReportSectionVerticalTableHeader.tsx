/**
 * @file: CReportSectionVerticalTableHeader.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.01.2026
 * Last Modified Date: 06.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IUnit } from "common";
import { IDtoPlainOrTranslatableText } from "common/build-api-schema";
import { useCallback, useEffect } from "react";
import { EllipsisVertical } from "lucide-react";

import { CButtonPopup } from "@m/core/components/CButtonPopup";
import { useBuffer } from "@m/core/hooks/useBuffer";
import { useInput } from "@m/core/hooks/useInput";
import { usePopupState } from "@m/core/hooks/usePopupState";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  IDtoReportSectionVerticalTableColumnType,
  IDtoReportSectionVerticalTableHeader,
} from "../interfaces/IReportSectionVerticalTable";
import { CInputStringPlainOrTranslatable } from "./CInputStringPlainOrTranslatable";
import { CReportSectionVerticalTableHeaderPopup } from "./CReportSectionVerticalTableHeaderPopup";

export function CReportSectionVerticalTableHeader({
  index,
  header,
  isLastHeader,
  onChange,
  onHeaderRemove,
}: {
  index: number;
  header: IDtoReportSectionVerticalTableHeader;
  isLastHeader: boolean;
  onChange: (
    index: number,
    header: IDtoReportSectionVerticalTableHeader,
  ) => void;
  onHeaderRemove: (index: number) => void;
}) {
  const { t } = useTranslation();

  const popupState = usePopupState();

  const handleTypeChange = useCallback(
    (type: IDtoReportSectionVerticalTableColumnType) => {
      onChange(index, { ...header, valueType: type, unit: undefined });
    },
    [header, index, onChange],
  );

  const handleUnitChange = useCallback(
    (unit: IUnit | undefined) => {
      onChange(index, { ...header, unit });
    },
    [header, index, onChange],
  );

  const handleRemove = useCallback(() => {
    onHeaderRemove(index);
    const setIsOpen = popupState.setIsOpen;
    setIsOpen(false);
  }, [index, onHeaderRemove, popupState.setIsOpen]);

  const inputTitle = useInput<IDtoPlainOrTranslatableText>(
    header.title || {
      type: "PLAIN",
      value: "",
    },
  );

  const [bufferedTitle] = useBuffer(inputTitle.value);

  useEffect(() => {
    if (!bufferedTitle) {
      return;
    }
    onChange(index, {
      title: bufferedTitle,
      valueType: header.valueType,
      unit: header.unit,
    });
    // It is important to add header primitive values to dependency.
    //   Putting header object all at once, it may cause infinite render loop.
  }, [bufferedTitle, header.unit, header.valueType, index, onChange]);

  const popupComponent = useCallback(
    () => (
      <CReportSectionVerticalTableHeaderPopup
        header={header}
        isLastHeader={isLastHeader}
        onChangeType={handleTypeChange}
        onChangeUnit={handleUnitChange}
        onRemove={handleRemove}
      />
    ),
    [header, isLastHeader, handleTypeChange, handleUnitChange, handleRemove],
  );

  return (
    <td className="py-2 px-1 @sm:px-2 font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-500/10 whitespace-pre-wrap text-right min-w-60">
      <div className="flex space-x-2 w-full">
        <div className="grow">
          <CInputStringPlainOrTranslatable
            {...inputTitle}
            placeholder={t("title")}
            required
          />
        </div>

        <CButtonPopup
          icon={EllipsisVertical}
          popupState={popupState}
          popupComponent={popupComponent}
        />
      </div>
    </td>
  );
}
