import { EApiFailCode, UtilDate } from "common";
import ExcelJS from "exceljs";
import { Logger } from "pino";

import { ApiException } from "@m/core/exceptions/ApiException";

import { IMetricFileDraftContentRecord } from "../interfaces/IMetricFileDraftContentRecord";

export namespace UtilMetricExcelImporter {
  function parseDatetimeCell(rawDate: unknown): Date | undefined {
    if (rawDate instanceof Date) {
      return rawDate;
    }

    if (typeof rawDate === "number") {
      return new Date((rawDate - 25569) * 86400 * 1000);
    }

    if (typeof rawDate === "string" && rawDate.trim()) {
      return new Date(rawDate);
    }

    return undefined;
  }

  export async function importFile(
    logger: Logger,
    buffer: ArrayBuffer,
    tzOffset: number,
  ) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const ws = workbook.worksheets[0];
    if (!ws) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "Excel worksheet not found",
      );
    }

    const rows = Array.from(ws.getRows(1, ws.rowCount) ?? []);
    if (rows.length === 0) {
      throw new ApiException(EApiFailCode.BAD_REQUEST, "Excel file is empty");
    }

    const hasHeader =
      typeof rows[0].getCell(1).value === "string" &&
      typeof rows[0].getCell(2).value === "string";

    const dataRows = hasHeader ? rows.slice(1) : rows;

    const values: IMetricFileDraftContentRecord[] = [];

    dataRows.forEach((row, idx) => {
      const lineNo = idx + 1 + (hasHeader ? 1 : 0);

      const rawDate = row.getCell(1).value;
      const rawValue = row.getCell(2).value;

      if (rawDate === null && rawValue === null) {
        logger.warn("Skipped an excel row during import.");
        return;
      }

      const datetime = parseDatetimeCell(row.getCell(1).value);
      const value = Number(rawValue);

      if (!datetime || Number.isNaN(value)) {
        throw new ApiException(
          EApiFailCode.BAD_REQUEST,
          `Row ${lineNo} is invalid: ${rawDate}, ${row.getCell(2).value}`,
        );
      }

      const utcDatetime = UtilDate.timezoneIsoDatetimeToUtcIsoDatetime(
        datetime.toISOString(),
        tzOffset,
      );

      const labels: IMetricFileDraftContentRecord["labels"] = [];

      if (hasHeader) {
        const headerRow = rows[0];
        row.eachCell((cell, colNumber) => {
          if (colNumber > 2) {
            const key = headerRow.getCell(colNumber).value;
            if (key && cell.value !== null && cell.value !== undefined) {
              labels.push({
                type: "USER_DEFINED",
                key: String(key),
                value: String(cell.value),
              });
            }
          }
        });
      }

      values.push({
        datetime: utcDatetime,
        value,
        labels,
      });
    });

    if (!values.length) {
      throw new ApiException(EApiFailCode.BAD_REQUEST, "No valid row found");
    }

    return values;
  }
}
