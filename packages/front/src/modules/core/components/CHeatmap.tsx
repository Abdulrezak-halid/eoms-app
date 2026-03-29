import {
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import React, { useCallback, useContext, useMemo, useState } from "react";

import { CCard } from "@m/core/components/CCard";
import { ContextTheme } from "@m/core/contexts/ContextTheme";

import { classNames } from "../utils/classNames";
import { CMutedText } from "./CMutedText";

export interface IHeatmapData {
  label: string;
  columns: {
    value: number | null;
    description?: string;
  }[];
}

export interface IHeatmapProps {
  data: IHeatmapData[];
  columnLabels: string[];
}

export function CHeatmap({ data, columnLabels }: IHeatmapProps) {
  const { dark } = useContext(ContextTheme);
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<{
    value: number | null;
    description?: string;
    rowLabel: string;
    columnLabel: string;
    rowIndex: number;
    columnIndex: number;
  } | null>(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context);
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  const { minValue, maxValue } = useMemo(() => {
    const allValues = data
      .flatMap((row) => row.columns.map((col) => col.value))
      .filter((val): val is number => val !== null); 

    if (allValues.length === 0) {
      return { minValue: 0, maxValue: 0 };
    }

    return {
      minValue: Math.min(...allValues),
      maxValue: Math.max(...allValues),
    };
  }, [data]);

  const getColorIntensity = useCallback(
    (value: number): number => {
      if (maxValue === minValue) {
        return 0.5;
      }
      return (value - minValue) / (maxValue - minValue);
    },
    [maxValue, minValue],
  );

  const createCellHoverHandler = useMemo(
    () =>
      function (
        rowData: IHeatmapData,
        columnData: { value: number | null; description?: string },
        rowIndex: number,
        columnIndex: number,
      ) {
        return function (event: React.MouseEvent) {
          refs.setReference(event.currentTarget);
          setTooltipContent({
            value: columnData.value,
            description: columnData.description,
            rowLabel: rowData.label,
            columnLabel: columnLabels[columnIndex],
            rowIndex,
            columnIndex,
          });
          setIsOpen(true);
        };
      },
    [refs, columnLabels],
  );

  const handleCellLeave = useMemo(
    () =>
      function () {
        setIsOpen(false);
      },
    [],
  );

  const cellsData = useMemo(() => {
    return data.map((rowData, rowIndex) =>
      rowData.columns.map((columnData, columnIndex) => {
        if (columnData.value === null) {
          const backgroundColor = dark
            ? "oklch(37.2% 0.044 257.287)" // slate-700
            : "oklch(92.9% 0.013 255.508)"; // slate-200

          return {
            backgroundColor,
            handler: createCellHoverHandler(
              rowData,
              columnData,
              rowIndex,
              columnIndex,
            ),
          };
        }

        const intensity = getColorIntensity(columnData.value);
        const opacity = 0.3 + intensity * 0.7;
        const backgroundColor = dark
          ? `color-mix(in srgb, var(--color-accent-500) ${opacity * 100}%, transparent)`
          : `color-mix(in srgb, var(--color-accent-400) ${opacity * 100}%, transparent)`;

        return {
          backgroundColor,
          value: parseFloat(columnData.value.toFixed(3)).toString(),
          handler: createCellHoverHandler(
            rowData,
            columnData,
            rowIndex,
            columnIndex,
          ),
        };
      }),
    );
  }, [data, getColorIntensity, dark, createCellHoverHandler]);

  return (
    <CCard className="bg-white dark:bg-gray-100 flex pt-4 pr-4 overflow-auto">
      <div
        className="w-full h-[36rem] grid gap-0.5"
        style={{
          gridTemplateColumns: `8rem repeat(${columnLabels.length}, minmax(3rem, 1fr))`,
          gridTemplateRows: `repeat(${data.length}, minmax(3rem, 1fr))`,
        }}
      >
        {data.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <div className="flex items-center justify-end px-3 text-gray-700 dark:text-gray-100">
              <div
                className="text-right truncate whitespace-nowrap"
                title={row.label}
              >
                {row.label}
              </div>
            </div>

            {cellsData[rowIndex].map((cell, colIndex) => (
              <div
                key={colIndex}
                className={
                  "relative flex items-center justify-center rounded hover:x-outline hover:z-10"
                }
                style={{ backgroundColor: cell.backgroundColor }}
                onMouseEnter={cell.handler}
                onMouseLeave={handleCellLeave}
                {...getReferenceProps()}
              >
                <div className="px-2 text-center">{cell.value}</div>
              </div>
            ))}
          </React.Fragment>
        ))}

        <div />

        {columnLabels.map((label, i) => (
          <div
            key={i}
            className={classNames(
              "flex min-w-0 overflow-hidden",
              columnLabels.length > 6
                ? "items-start justify-start pt-8 pb-4"
                : "items-center justify-center",
            )}
          >
            <div
              className={classNames(
                "text-gray-700 dark:text-gray-100 whitespace-nowrap truncate text-ellipsis",
                columnLabels.length > 6
                  ? "-rotate-45 origin-top-left max-w-40"
                  : "p-3 pt-2",
              )}
              title={label}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {isOpen && tooltipContent && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="z-50 max-w-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 shadow-lg text-gray-700 dark:text-gray-100"
          {...getFloatingProps()}
        >
          <div className="space-y-1">
            <div>
              {tooltipContent.rowLabel} - {tooltipContent.columnLabel}
            </div>
            {tooltipContent.description && (
              <CMutedText
                className="whitespace-pre-line"
                value={tooltipContent.description}
              />
            )}
          </div>
        </div>
      )}
    </CCard>
  );
}
