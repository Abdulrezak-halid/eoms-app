/**
 * @file: CReportSectionVerticalTableHeaderPopup.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.01.2026
 * Last Modified Date: 06.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IUnit } from "common";
import { useMemo } from "react";
import { Trash2 } from "lucide-react";

import { CComboboxUnit } from "@m/base/components/CComboboxUnit";
import { CButton } from "@m/core/components/CButton";
import { CPopupPanel } from "@m/core/components/CPopupPanel";
import { CRadioGroup } from "@m/core/components/CRadioGroup";
import { ISelectListItem } from "@m/core/components/CSelectList";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  IDtoReportSectionVerticalTableColumnType,
  IDtoReportSectionVerticalTableHeader,
} from "../interfaces/IReportSectionVerticalTable";

export function CReportSectionVerticalTableHeaderPopup({
  header,
  isLastHeader,
  onChangeType,
  onChangeUnit,
  onRemove,
}: {
  header: IDtoReportSectionVerticalTableHeader;
  isLastHeader: boolean;
  onChangeType: (value: IDtoReportSectionVerticalTableColumnType) => void;
  onChangeUnit: (value?: IUnit) => void;
  onRemove: () => void;
}) {
  const { t } = useTranslation();

  const typeList = useMemo<
    ISelectListItem<IDtoReportSectionVerticalTableColumnType>[]
  >(
    () => [
      { label: t("text"), value: "TEXT" },
      { label: t("number"), value: "NUMBER" },
    ],
    [t],
  );

  return (
    <CPopupPanel className="p-3 space-y-3">
      <CRadioGroup
        list={typeList}
        value={header.valueType}
        onChange={onChangeType}
        inline
      />

      {header.valueType === "NUMBER" && (
        <CComboboxUnit value={header.unit} onChange={onChangeUnit} />
      )}

      <CButton
        icon={Trash2}
        label={t("remove")}
        onClick={onRemove}
        className="w-full"
        disabled={isLastHeader}
      />
    </CPopupPanel>
  );
}
