import { IDtoPlainOrTranslatableText } from "common/build-api-schema";
import { useEffect } from "react";

import { CInputNumber } from "@m/core/components/CInputNumber";
import { useBuffer } from "@m/core/hooks/useBuffer";
import { useInput } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  IDtoReportSectionVerticalTableCell,
  IDtoReportSectionVerticalTableHeader,
} from "../interfaces/IReportSectionVerticalTable";
import { CInputStringPlainOrTranslatable } from "./CInputStringPlainOrTranslatable";

export function CReportSectionVerticalTableRowCell({
  iRow,
  iCol,
  header,
  cell,
  onChange,
}: {
  iRow: number;
  iCol: number;
  header: IDtoReportSectionVerticalTableHeader;
  cell: IDtoReportSectionVerticalTableCell;
  onChange: (
    iRow: number,
    iCol: number,
    value: IDtoReportSectionVerticalTableCell,
  ) => void;
}) {
  const { t } = useTranslation();

  const inputNumber = useInput<number | undefined>(
    typeof cell === "number" ? cell : 0,
  );
  const inputText = useInput<IDtoPlainOrTranslatableText>(
    typeof cell !== "number" ? cell : { type: "PLAIN", value: "" },
  );

  const [bufferedNumber] = useBuffer(inputNumber.value);
  const [bufferedText] = useBuffer(inputText.value);

  useEffect(() => {
    onChange(
      iRow,
      iCol,
      header.valueType === "NUMBER" ? bufferedNumber || 0 : bufferedText,
    );
  }, [bufferedNumber, bufferedText, header.valueType, iCol, iRow, onChange]);

  return (
    <td className="py-2 px-1 @sm:px-2 border-t border-gray-200 dark:border-gray-900">
      {header.valueType === "NUMBER" ? (
        <CInputNumber {...inputNumber} placeholder={t("value")} float />
      ) : (
        <CInputStringPlainOrTranslatable
          {...inputText}
          placeholder={t("value")}
        />
      )}
    </td>
  );
}
