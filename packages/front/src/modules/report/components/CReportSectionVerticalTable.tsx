/**
 * @file: CReportSectionVerticalTable.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.01.2026
 * Last Modified Date: 06.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import {
  MAX_REPORT_TABLE_COLUMN_LENGTH,
  MAX_REPORT_TABLE_ROW_LENGTH,
} from "common";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";

import { CButton } from "@m/core/components/CButton";
import { CLine } from "@m/core/components/CLine";
import { CNoRecord } from "@m/core/components/CNoRecord";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoReportSectionContent } from "../interfaces/IDtoReport";
import {
  IDtoReportSectionVerticalTableCell,
  IDtoReportSectionVerticalTableHeader,
  IHeaderWithId,
  IRowWithId,
} from "../interfaces/IReportSectionVerticalTable";
import { CReportSectionVerticalTableHeader } from "./CReportSectionVerticalTableHeader";
import { CReportSectionVerticalTableRow } from "./CReportSectionVerticalTableRow";

export const CReportSectionVerticalTable = memo(
  function CReportSectionVerticalTable({
    content,
    onChange,
    onInvalidChange,
  }: {
    content: Extract<IDtoReportSectionContent, { type: "TABLE_VERTICAL" }>;
    onChange: (value: IDtoReportSectionContent) => void;
    onInvalidChange: (value: boolean) => void;
  }) {
    const { t } = useTranslation();

    const refLastId = useRef(0);

    // Extra id field is just for react to keep track of which column is removed
    const [headers, setHeaders] = useState<IHeaderWithId[]>(() =>
      content.data
        ? content.data.headers.map((d) => ({
            id: ++refLastId.current,
            data: d,
          }))
        : [
            {
              id: ++refLastId.current,
              data: {
                valueType: "TEXT",
                title: { type: "PLAIN", value: "" },
              },
            },
            {
              id: ++refLastId.current,
              data: {
                valueType: "TEXT",
                title: { type: "PLAIN", value: "" },
              },
            },
          ],
    );

    const [rows, setRows] = useState<IRowWithId[]>(() =>
      content.data
        ? content.data.rows.map((d) => ({
            id: ++refLastId.current,
            data: d,
          }))
        : [
            {
              id: ++refLastId.current,
              data: [
                { type: "PLAIN", value: "" },
                { type: "PLAIN", value: "" },
              ],
            },
            {
              id: ++refLastId.current,
              data: [
                { type: "PLAIN", value: "" },
                { type: "PLAIN", value: "" },
              ],
            },
          ],
    );

    useEffect(() => {
      onChange({
        type: "TABLE_VERTICAL",
        data: {
          headers: headers.map((d) => d.data),
          rows: rows.map((d) => d.data),
        },
      });

      onInvalidChange(headers.some((d) => d.data.title.value === ""));
    }, [headers, onChange, onInvalidChange, rows]);

    const handleHeaderAdd = useCallback(() => {
      setHeaders((d) => [
        ...d,
        {
          id: ++refLastId.current,
          data: {
            valueType: "TEXT",
            title: { type: "PLAIN", value: "" },
          },
        },
      ]);

      setRows((d) =>
        d.map((row) => ({
          id: row.id,
          data: [...row.data, { type: "PLAIN", value: "" }],
        })),
      );
    }, []);

    const handleHeaderChange = useCallback(
      (index: number, value: IDtoReportSectionVerticalTableHeader) => {
        setHeaders((d) => {
          const clone = [...d];
          clone[index] = { id: clone[index].id, data: value };
          return clone;
        });
      },
      [],
    );

    const handleHeaderRemove = useCallback((index: number) => {
      setRows((d) =>
        d.map((row) => {
          const clone = [...row.data];
          clone.splice(index, 1);
          return { id: row.id, data: clone };
        }),
      );
      setHeaders((d) => {
        const clone = [...d];
        clone.splice(index, 1);
        return clone;
      });
    }, []);

    const handleRowAdd = useCallback(() => {
      setRows((d) => [
        ...d,
        {
          id: ++refLastId.current,
          data: headers.map((header) =>
            header.data.valueType === "NUMBER"
              ? 0
              : { type: "PLAIN", value: "" },
          ),
        },
      ]);
    }, [headers]);

    const handleRowRemove = useCallback((index: number) => {
      setRows((d) => {
        const clone = [...d];
        clone.splice(index, 1);
        return clone;
      });
    }, []);

    const handleCellChange = useCallback(
      (
        iRow: number,
        iCol: number,
        value: IDtoReportSectionVerticalTableCell,
      ) => {
        setRows((d) => {
          const cloneRows = [...d];
          const row = cloneRows[iRow];
          const cloneCols = [...row.data];
          cloneCols[iCol] = value;
          cloneRows[iRow] = { id: row.id, data: cloneCols };
          return cloneRows;
        });
      },
      [],
    );

    return (
      <div className="space-y-4">
        <CLine className="justify-end">
          <CButton
            icon={Plus}
            label={t("addColumn")}
            onClick={handleHeaderAdd}
            disabled={headers.length >= MAX_REPORT_TABLE_COLUMN_LENGTH}
            tertiary
          />
        </CLine>

        <div className="rounded-md bg-white dark:bg-gray-800 shadow-sm border border-gray-300 dark:border-gray-900 overflow-hidden">
          <div className="overflow-auto min-h-80">
            <table className="w-full">
              <thead>
                <tr>
                  {headers.map((d, i) => (
                    <CReportSectionVerticalTableHeader
                      key={d.id}
                      index={i}
                      header={d.data}
                      isLastHeader={headers.length === 1}
                      onChange={handleHeaderChange}
                      onHeaderRemove={handleHeaderRemove}
                    />
                  ))}

                  <td className="py-2 px-1 @sm:px-2 font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-500/10 whitespace-pre-wrap text-right"></td>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, iRow) => (
                  <CReportSectionVerticalTableRow
                    key={row.id}
                    index={iRow}
                    headers={headers}
                    isLastRow={rows.length === 1}
                    data={row.data}
                    onCellChange={handleCellChange}
                    onRemove={handleRowRemove}
                  />
                ))}
              </tbody>
            </table>

            {!rows.length && (
              <CNoRecord className="py-8 border-t border-gray-200 dark:border-gray-900" />
            )}
          </div>
        </div>

        <CLine className="justify-end">
          <CButton
            icon={Plus}
            label={t("addRow")}
            onClick={handleRowAdd}
            disabled={rows.length >= MAX_REPORT_TABLE_ROW_LENGTH}
            tertiary
          />
        </CLine>
      </div>
    );
  },
);
