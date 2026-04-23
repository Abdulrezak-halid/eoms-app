import { ReactElement } from "react";

import { classNames } from "../utils/classNames";
import { CNoRecord } from "./CNoRecord";

export interface ITableHeaderColumn {
  label?: React.ReactNode;
  right?: boolean;
  center?: boolean;
  hideSm?: boolean;
  hideMd?: boolean;
  hideLg?: boolean;
  hideXl?: boolean;
  noClampLine?: boolean;
}

export interface ITableHeaderParentColumn extends ITableHeaderColumn {
  colspan?: number;
}

export function CTable({
  headerParent,
  header,
  children,
  bordered = false,
  className,
  classNameHeaderCell,
  noOverflow = false,
}: {
  headerParent?: ITableHeaderParentColumn[];
  header: ITableHeaderColumn[];
  children?: (ReactElement | string | number)[][];
  bordered?: boolean;
  className?: string;
  classNameHeaderCell?: string;
  noOverflow?: boolean;
}) {
  // Double div is to clip scrollbar rounded corner
  return (
    <div
      className={classNames(
        "rounded-md bg-white dark:bg-gray-800 shadow-sm border border-gray-300 dark:border-gray-900",
        noOverflow ? "overflow-visible" : "overflow-hidden",
        className,
      )}
    >
      <div className={noOverflow ? "overflow-visible" : "overflow-auto"}>
        <table className="w-full">
          <thead>
            {headerParent && (
              <tr>
                {headerParent.map((d, i) => (
                  <td
                    key={i}
                    colSpan={d.colspan}
                    className={classNames(
                      "py-2 @md:py-3 px-2 @md:px-4 font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-500/10 whitespace-pre-wrap",
                      "border-b border-gray-300 dark:border-gray-900",
                      d.right && "text-right",
                      d.center && "text-center",
                      d.hideSm && "hidden @sm:table-cell",
                      d.hideMd && "hidden @md:table-cell",
                      d.hideLg && "hidden @lg:table-cell",
                      d.hideXl && "hidden @xl:table-cell",
                      bordered &&
                        "border-r border-gray-300 dark:border-gray-900 last:border-r-0",
                      classNameHeaderCell,
                    )}
                  >
                    {d.label}
                  </td>
                ))}
              </tr>
            )}

            <tr>
              {header.map((d, i) => (
                <td
                  key={i}
                  className={classNames(
                    "py-2 @md:py-3 px-2 @md:px-4 font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-500/10 whitespace-pre-wrap",
                    d.right && "text-right",
                    d.center && "text-center",
                    d.hideSm && "hidden @sm:table-cell",
                    d.hideMd && "hidden @md:table-cell",
                    d.hideLg && "hidden @lg:table-cell",
                    d.hideXl && "hidden @xl:table-cell",
                    bordered &&
                      "border-r border-gray-300 dark:border-gray-900 last:border-r-0",
                    classNameHeaderCell,
                  )}
                >
                  {d.label}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {children?.map((row, iRow) => (
              <tr key={iRow}>
                {row.map((col, iCol) => (
                  <td
                    key={iCol}
                    className={classNames(
                      "py-2 @md:py-3 px-2 @md:px-4 border-t border-gray-200 dark:border-gray-900",
                      header[iCol]?.right && "text-right",
                      header[iCol]?.center && "text-center",
                      header[iCol]?.hideSm && "hidden @sm:table-cell",
                      header[iCol]?.hideMd && "hidden @md:table-cell",
                      header[iCol]?.hideLg && "hidden @lg:table-cell",
                      header[iCol]?.hideXl && "hidden @xl:table-cell",
                      bordered && "border-r last:border-r-0",
                    )}
                  >
                    {/* If there is no label, do not auto clamp (for action columns) */}
                    {header[iCol].label && !header[iCol]?.noClampLine ? (
                      <div className="line-clamp-2 @sm:line-clamp-3">{col}</div>
                    ) : (
                      col
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {Boolean(!children?.length) && (
          <CNoRecord className="py-8 border-t border-gray-200 dark:border-gray-900" />
        )}
      </div>
    </div>
  );
}
