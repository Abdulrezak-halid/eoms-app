import { MAX_REPORT_TABLE_ROW_LENGTH } from "common";
import { IDtoPlainOrTranslatableText } from "common/build-api-schema";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { CButton } from "@m/core/components/CButton";
import { CFormLine } from "@m/core/components/CFormPanel";
import { CLine } from "@m/core/components/CLine";
import { CMutedText } from "@m/core/components/CMutedText";
import { useInput } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoReportSectionContent } from "../interfaces/IDtoReport";
import { CInputStringPlainOrTranslatable } from "./CInputStringPlainOrTranslatable";

type IDtoReportSectionContentHorizontalTable = Extract<
  IDtoReportSectionContent,
  { type: "TABLE_HORIZONTAL" }
>;
type IDtoReportSectionContentHorizontalTableRow = NonNullable<
  IDtoReportSectionContentHorizontalTable["rows"]
>[number];

type ITableRow = {
  id: number;
  data: IDtoReportSectionContentHorizontalTableRow;
};

export const CReportSectionHorizontalTable = memo(
  function CReportSectionHorizontalTable({
    content,
    onChange,
    onInvalidChange,
  }: {
    content: Extract<IDtoReportSectionContent, { type: "TABLE_HORIZONTAL" }>;
    onChange: (value: IDtoReportSectionContent) => void;
    onInvalidChange: (value: boolean) => void;
  }) {
    const { t } = useTranslation();

    const refLastId = useRef(0);

    const [rows, setRows] = useState<ITableRow[]>(() =>
      content.rows
        ? content.rows.map((d) => ({
            id: ++refLastId.current,
            data: d,
          }))
        : [
            {
              id: ++refLastId.current,
              data: {
                title: { type: "PLAIN", value: "" },
                value: { type: "PLAIN", value: "" },
              },
            },
            {
              id: ++refLastId.current,
              data: {
                title: { type: "PLAIN", value: "" },
                value: { type: "PLAIN", value: "" },
              },
            },
          ],
    );

    useEffect(() => {
      onChange({ type: "TABLE_HORIZONTAL", rows: rows.map((d) => d.data) });
      onInvalidChange(
        rows.some(
          (d) => d.data.title.value === "" || d.data.value.value === "",
        ),
      );
    }, [onChange, onInvalidChange, rows]);

    const handleRowAdd = useCallback(() => {
      setRows((d) => [
        ...d,
        {
          id: ++refLastId.current,
          data: {
            title: { type: "PLAIN", value: "" },
            value: { type: "PLAIN", value: "" },
          },
        },
      ]);
    }, []);

    const handleRowRemove = useCallback((iRow: number) => {
      setRows((d) => {
        const clone = [...d];
        clone.splice(iRow, 1);
        return clone;
      });
    }, []);

    const handleRowChange = useCallback(
      (iRow: number, value: IDtoReportSectionContentHorizontalTableRow) => {
        setRows((d) => {
          const clone = [...d];
          clone[iRow] = {
            id: clone[iRow].id,
            data: value,
          };
          return clone;
        });
      },
      [],
    );

    return (
      <div className="space-y-3">
        <CFormLine label={t("tableRows")} />
        <div className="flex gap-3 items-center">
          <CMutedText className="flex-1">{t("title")}</CMutedText>
          <CMutedText className="flex-1">{t("value")}</CMutedText>
          <div className="w-12" />
        </div>

        {rows.map((row, index) => (
          <CTableRow
            key={row.id}
            row={row.data}
            index={index}
            canRemove={rows.length > 1}
            onChange={handleRowChange}
            onRemove={handleRowRemove}
          />
        ))}
        <CLine className="justify-end">
          <CButton
            icon={Plus}
            label={t("addRow")}
            onClick={handleRowAdd}
            disabled={rows.length >= MAX_REPORT_TABLE_ROW_LENGTH}
            tertiary
            hideLabelLg
          />
        </CLine>
      </div>
    );
  },
);

function CTableRow({
  index,
  row,
  canRemove,
  onChange,
  onRemove,
}: {
  index: number;
  row: IDtoReportSectionContentHorizontalTableRow;
  canRemove: boolean;
  onChange: (
    index: number,
    value: IDtoReportSectionContentHorizontalTableRow,
  ) => void;
  onRemove: (index: number) => void;
}) {
  const { t } = useTranslation();

  const inputTitle = useInput<IDtoPlainOrTranslatableText>(
    row.title || {
      type: "PLAIN",
      value: "",
    },
  );
  const inputValue = useInput<IDtoPlainOrTranslatableText>(
    row.value || {
      type: "PLAIN",
      value: "",
    },
  );

  useEffect(() => {
    onChange(index, { title: inputTitle.value, value: inputValue.value });
  }, [index, inputTitle.value, inputValue.value, onChange]);

  return (
    <div className="flex gap-3 items-start w-full">
      <div className="flex-1">
        <CFormLine>
          <CInputStringPlainOrTranslatable
            {...inputTitle}
            placeholder={t("title")}
            required
          />
        </CFormLine>
      </div>

      <div className="flex-1">
        <CFormLine>
          <CInputStringPlainOrTranslatable
            {...inputValue}
            placeholder={t("value")}
            required
          />
        </CFormLine>
      </div>

      <div className="w-12 flex justify-center">
        <CButton
          icon={Trash2}
          value={index}
          onClick={onRemove}
          disabled={!canRemove}
        />
      </div>
    </div>
  );
}
