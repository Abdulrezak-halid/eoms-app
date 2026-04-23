import { Trash2 } from "lucide-react";

import { CButton } from "@m/core/components/CButton";

import {
  IDtoReportSectionVerticalTableCell,
  IHeaderWithId,
} from "../interfaces/IReportSectionVerticalTable";
import { CReportSectionVerticalTableRowCell } from "./CReportSectionVerticalTableRowCell";

export function CReportSectionVerticalTableRow({
  index,
  headers,
  data,
  isLastRow,
  onCellChange,
  onRemove,
}: {
  index: number;
  headers: IHeaderWithId[];
  data: IDtoReportSectionVerticalTableCell[];
  isLastRow: boolean;
  onCellChange: (
    iRow: number,
    iCol: number,
    cell: IDtoReportSectionVerticalTableCell,
  ) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <tr>
      {data.map((cell, iCol) => (
        <CReportSectionVerticalTableRowCell
          key={headers[iCol].id}
          iRow={index}
          iCol={iCol}
          header={headers[iCol].data}
          cell={cell}
          onChange={onCellChange}
        />
      ))}

      <td className="py-2 px-1 @sm:px-2 border-t border-gray-200 dark:border-gray-900 text-right">
        <CButton
          icon={Trash2}
          value={index}
          onClick={onRemove}
          disabled={isLastRow}
        />
      </td>
    </tr>
  );
}
