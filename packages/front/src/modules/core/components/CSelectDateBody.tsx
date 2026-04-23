import { MAX_YEAR, MIN_YEAR, UtilDate } from "common";
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArrowLeft, ArrowRight, Paintbrush } from "lucide-react";

import { useTranslation } from "@m/core/hooks/useTranslation";
import { classNames } from "@m/core/utils/classNames";

import { CButton } from "./CButton";
import { CLine } from "./CLine";

/**
 * Note: Entry component all date prop types are string.
 *   Any other sub component's all date props types are Date.
 */

function useMonthInfos() {
  const { t } = useTranslation();

  return useMemo(
    () => [
      { label: t("monthJanuary"), days: 31 },
      { label: t("monthFebruary"), days: 29 },
      { label: t("monthMarch"), days: 31 },
      { label: t("monthApril"), days: 30 },
      { label: t("monthMay"), days: 31 },
      { label: t("monthJune"), days: 30 },
      { label: t("monthJuly"), days: 31 },
      { label: t("monthAugust"), days: 31 },
      { label: t("monthSeptember"), days: 30 },
      { label: t("monthOctober"), days: 31 },
      { label: t("monthNovember"), days: 30 },
      { label: t("monthDecember"), days: 31 },
    ],
    [t],
  );
}

const minYear = MIN_YEAR;
const maxYear = MAX_YEAR;

interface IGridCell {
  date: Date;
  selected?: boolean;
  disabled?: boolean;
  today: boolean;
}

type PageType = "year" | "month" | "day";

function isDisabled(d: Date, min?: Date, max?: Date) {
  return (
    (min &&
      (d.getFullYear() < min.getFullYear() ||
        (d.getFullYear() === min.getFullYear() &&
          (d.getMonth() < min.getMonth() ||
            (d.getMonth() === min.getMonth() &&
              d.getDate() < min.getDate()))))) ||
    (max &&
      (d.getFullYear() > max.getFullYear() ||
        (d.getFullYear() === max.getFullYear() &&
          (d.getMonth() > max.getMonth() ||
            (d.getMonth() === max.getMonth() && d.getDate() > max.getDate())))))
  );
}

// Note: value prop handles empty string like it is undefined.
//   Clear button sets value to empty string instead of undefined
//   to make value type simple, only string.

export function CSelectDateBody({
  value,
  onChange,
  sundayFirst,
  min,
  max,
  noClear,
}: {
  value?: string;
  onChange?: (value: string | undefined) => void;
  sundayFirst?: boolean;
  min?: string;
  max?: string;
  noClear?: boolean;
}) {
  const valueDate = useMemo(
    () => (value ? new Date(value) : undefined),
    [value],
  );
  const minDate = useMemo(() => (min ? new Date(min) : undefined), [min]);
  const maxDate = useMemo(() => (max ? new Date(max) : undefined), [max]);

  const [shownDate, setShownDate] = useState(() => valueDate || new Date());
  const [page, setPage] = useState<PageType>("day");

  const setValue = useCallback(
    (v: Date) => {
      onChange?.(UtilDate.objToLocalIsoDate(v));
      setShownDate(v);
    },
    [onChange],
  );

  const handleClickToday = useCallback(() => {
    setPage("day");
    setValue(new Date());
  }, [setValue]);

  const handleClickCurrent = useCallback(() => {
    if (!valueDate) {
      return;
    }
    setPage("day");
    setShownDate(valueDate);
  }, [valueDate]);

  const handleClear = useCallback(() => {
    if (onChange) {
      onChange(undefined);
    }
    setShownDate(() => new Date());
  }, [onChange]);

  const isTodayDisabled = useMemo(
    () => isDisabled(new Date(), minDate, maxDate),
    [minDate, maxDate],
  );

  const { t } = useTranslation();

  const formattedValue = useMemo(
    () => (valueDate ? UtilDate.formatObjToLocalDate(valueDate) : undefined),
    [valueDate],
  );

  return (
    <div className="h-full flex flex-col space-y-2 p-2">
      {page === "day" ? (
        <CSelectDatePageDay
          value={valueDate}
          shownDate={shownDate}
          setPage={setPage}
          setValue={setValue}
          setShownDate={setShownDate}
          sundayFirst={sundayFirst}
          min={minDate}
          max={maxDate}
        />
      ) : page === "month" ? (
        <CSelectDatePageMonth
          value={valueDate}
          shownDate={shownDate}
          setPage={setPage}
          setShownDate={setShownDate}
          min={minDate}
          max={maxDate}
        />
      ) : (
        <CSelectDatePageYear
          value={valueDate}
          setPage={setPage}
          setShownDate={setShownDate}
          min={minDate}
          max={maxDate}
        />
      )}

      <CLine className="flex-none space-x-2">
        <div className="grow">
          {formattedValue && (
            <CButton
              label={formattedValue}
              onClick={handleClickCurrent}
              tertiary
            />
          )}
        </div>

        <CButton
          label={t("today")}
          onClick={handleClickToday}
          disabled={isTodayDisabled}
        />

        {!noClear && (
          <CButton
            icon={Paintbrush}
            onClick={handleClear}
            disabled={!value}
          />
        )}
      </CLine>
    </div>
  );
}

function CSelectDatePageDay({
  value,
  shownDate,
  setPage,
  setValue,
  setShownDate,
  sundayFirst,
  min,
  max,
}: {
  value?: Date;
  shownDate: Date;
  setPage: (value: PageType) => void;
  setValue: (value: Date) => void;
  setShownDate: (value: Date) => void;
  sundayFirst?: boolean;
  min?: Date;
  max?: Date;
}) {
  const monthInfos = useMonthInfos();
  const shownMonth = monthInfos[shownDate.getMonth()];

  const grid = useMemo(() => {
    const tempDate = new Date(shownDate);
    tempDate.setDate(1);
    let firstDayIndex = tempDate.getDay();
    if (!sundayFirst) {
      firstDayIndex = (firstDayIndex + 6) % 7;
    }

    const today = new Date();

    const rows: (IGridCell | null)[][] = [];
    for (let iRow = 0; iRow < 6; ++iRow) {
      const row: (IGridCell | null)[] = [];
      for (let iCell = 0; iCell < 7; ++iCell) {
        const d = new Date(shownDate);
        d.setDate(iRow * 7 + iCell + 1 - firstDayIndex);
        if (
          iCell === 0 &&
          iRow === 5 &&
          d.getMonth() !== shownDate.getMonth()
        ) {
          break;
        }
        if (d.getFullYear() < minYear || d.getFullYear() > maxYear) {
          row.push(null);
          continue;
        }
        row.push({
          date: d,
          selected:
            value &&
            d.getDate() === value.getDate() &&
            d.getMonth() === value.getMonth() &&
            d.getFullYear() === value.getFullYear(),
          today:
            d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear(),
          disabled: isDisabled(d, min, max),
        });
      }
      if (row.length) {
        rows.push(row);
      }
    }
    return rows;
  }, [shownDate, value, sundayFirst, min, max]);

  const handleClickPrevNext = useCallback(
    (dir: number) => {
      const d = new Date(shownDate);
      d.setDate(1);
      d.setMonth(d.getMonth() + dir);
      setShownDate(d);
    },
    [shownDate, setShownDate],
  );

  const { t } = useTranslation();

  const dayTitles = useMemo(() => {
    const dayNames = [
      { title: t("daySu"), index: 0 },
      { title: t("dayMo"), index: 1 },
      { title: t("dayTu"), index: 2 },
      { title: t("dayWe"), index: 3 },
      { title: t("dayTh"), index: 4 },
      { title: t("dayFr"), index: 5 },
      { title: t("daySa"), index: 6 },
    ];
    if (!sundayFirst) {
      dayNames.push(dayNames.shift()!);
    }
    return dayNames;
  }, [t, sundayFirst]);

  return (
    <>
      <CLine className="justify-between flex-none">
        <CButton
          icon={ArrowLeft}
          value={-1}
          onClick={handleClickPrevNext}
          disabled={
            shownDate.getFullYear() === minYear && shownDate.getMonth() === 0
          }
        />
        <CButton
          label={`${shownMonth.label} ${shownDate.getFullYear()}`}
          value="month"
          onClick={setPage}
        />
        <CButton
          icon={ArrowRight}
          value={1}
          onClick={handleClickPrevNext}
          disabled={
            shownDate.getFullYear() === maxYear && shownDate.getMonth() === 11
          }
        />
      </CLine>

      <div className="grow flex flex-col">
        <div className="flex h-full items-center">
          {dayTitles.map((d, i) => (
            <div
              key={i}
              className={classNames(
                "w-full h-full flex justify-center items-center text-gray-400 font-bold",
                d.index === 6 &&
                  "border-l-2 border-gray-200 dark:border-gray-700",
                sundayFirst &&
                  d.index === 0 &&
                  "border-r-2 border-gray-200 dark:border-gray-700",
              )}
            >
              {d.title}
            </div>
          ))}
        </div>
        {grid.map((row, iRow) => (
          <div key={iRow} className="flex h-full">
            {row.map((cell, iCell) => (
              <div
                key={iCell}
                className={classNames(
                  "w-full h-full",
                  dayTitles[iCell].index === 6 &&
                    "border-l-2 border-gray-200 dark:border-gray-700",
                  sundayFirst &&
                    dayTitles[iCell].index === 0 &&
                    "border-r-2 border-gray-200 dark:border-gray-700",
                )}
              >
                {cell && (
                  <CSelectDatePageDayGridButton
                    key={cell.date.getTime()}
                    cell={cell}
                    shownDate={shownDate}
                    onClick={setValue}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function CSelectDatePageDayGridButton({
  cell,
  shownDate,
  onClick,
}: {
  cell: IGridCell;
  shownDate: Date;
  onClick: (value: Date) => void;
}) {
  const handleClick = useCallback(() => {
    onClick(cell.date);
  }, [onClick, cell]);

  return (
    <button
      type="button"
      // pointer-events-none is to disable hover effects
      className={classNames(
        "w-full h-full p-0.5 outline-hidden group/item",
        "disabled:opacity-40 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:pointer-events-none",
        cell.date.getMonth() !== shownDate.getMonth() && "text-gray-400",
      )}
      onClick={handleClick}
      disabled={cell.disabled}
    >
      <div
        className={classNames(
          "w-full h-full flex items-center justify-center rounded-md",
          "group-focus/item:x-outline",
          cell.selected
            ? "group-hover/item:bg-accent-700 dark:group-hover/item:bg-accent-500"
            : "group-hover/item:bg-gray-200 dark:group-hover/item:bg-gray-700",
          cell.selected
            ? "bg-accent-600 dark:bg-accent-600 text-white font-bold"
            : cell.today &&
                "border-2 border-dashed border-accent-600 dark:border-accent-300",
        )}
      >
        {cell.date.getDate()}
      </div>
    </button>
  );
}

function CSelectDatePageMonth({
  value,
  shownDate,
  setPage,
  setShownDate,
  min,
  max,
}: {
  value?: Date;
  shownDate: Date;
  setPage: (value: PageType) => void;
  setShownDate: (value: Date) => void;
  min?: Date;
  max?: Date;
}) {
  const grid = useMemo(() => {
    const today = new Date();
    const dateRef = new Date(shownDate);
    // Reset date of month, otherwise if shown date is 29+ febuarary is skipped
    dateRef.setDate(1);
    const rows: IGridCell[][] = [];
    for (let iRow = 0; iRow < 4; ++iRow) {
      const row: IGridCell[] = [];
      rows.push(row);
      for (let iCell = 0; iCell < 3; ++iCell) {
        const d = new Date(dateRef);
        d.setMonth(iRow * 3 + iCell);
        row.push({
          date: d,
          selected:
            value &&
            d.getMonth() === value.getMonth() &&
            d.getFullYear() === value.getFullYear(),
          today:
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear(),
          disabled:
            (min &&
              (d.getFullYear() < min.getFullYear() ||
                (d.getFullYear() === min.getFullYear() &&
                  d.getMonth() < min.getMonth()))) ||
            (max &&
              (d.getFullYear() > max.getFullYear() ||
                (d.getFullYear() === max.getFullYear() &&
                  d.getMonth() > max.getMonth()))),
        });
      }
    }
    return rows;
  }, [shownDate, value, min, max]);

  const handleClickPrevNext = useCallback(
    (dir: number) => {
      const d = new Date(shownDate);
      d.setDate(1);
      d.setFullYear(d.getFullYear() + dir);
      setShownDate(d);
    },
    [shownDate, setShownDate],
  );

  return (
    <>
      <CLine className="justify-between flex-none">
        <CButton
          icon={ArrowLeft}
          value={-1}
          onClick={handleClickPrevNext}
          disabled={shownDate.getFullYear() === minYear}
        />
        <CButton
          label={shownDate.getFullYear().toString()}
          value="year"
          onClick={setPage}
        />
        <CButton
          icon={ArrowRight}
          value={1}
          onClick={handleClickPrevNext}
          disabled={shownDate.getFullYear() === maxYear}
        />
      </CLine>

      <div className="grow flex flex-col">
        {grid.map((row, iRow) => (
          <div key={iRow} className="flex h-full">
            {row.map((cell, iCell) => (
              <CSelectDatePageMonthGridButton
                key={iCell}
                cell={cell}
                setPage={setPage}
                setShownDate={setShownDate}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function CSelectDatePageMonthGridButton({
  cell,
  setPage,
  setShownDate,
}: {
  cell: IGridCell;
  setPage: (value: PageType) => void;
  setShownDate: (value: Date) => void;
}) {
  const monthInfos = useMonthInfos();

  const handleClick = useCallback(() => {
    setPage("day");
    setShownDate(cell.date);
  }, [cell, setPage, setShownDate]);

  return (
    <button
      type="button"
      // pointer-events-none is to disable hover effects
      className="w-full h-full p-0.5 outline-hidden group/item disabled:opacity-40 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:pointer-events-none"
      onClick={handleClick}
      disabled={cell.disabled}
    >
      <div
        className={classNames(
          "w-full h-full flex flex-col items-center justify-center rounded-md",
          "group-focus/item:x-outline",
          cell.selected
            ? "group-hover/item:bg-accent-700 dark:group-hover/item:bg-accent-500"
            : "group-hover/item:bg-gray-200 dark:group-hover/item:bg-gray-700",
          cell.selected
            ? "bg-accent-600 dark:bg-accent-600 text-white"
            : cell.today &&
                "border-2 border-dashed border-accent-600 dark:border-accent-300",
        )}
      >
        <div className="text-2xl">{cell.date.getMonth() + 1}</div>
        <div
          className={classNames(
            "text-sm -mt-1",
            cell.selected ? "text-white" : "text-gray-600 dark:text-gray-300",
          )}
        >
          {monthInfos[cell.date.getMonth()].label}
        </div>
      </div>
    </button>
  );
}

function CSelectDatePageYear({
  value,
  setPage,
  setShownDate,
  min,
  max,
}: {
  value?: Date;
  setPage: (value: PageType) => void;
  setShownDate: (value: Date) => void;
  min?: Date;
  max?: Date;
}) {
  const grid = useMemo(() => {
    const today = new Date();
    const cells: IGridCell[] = [];
    for (let iCell = minYear; iCell <= maxYear; ++iCell) {
      const d = value ? new Date(value) : new Date();
      d.setDate(1);
      d.setFullYear(iCell);
      cells.push({
        date: d,
        selected: value && d.getFullYear() === value.getFullYear(),
        today: d.getFullYear() === today.getFullYear(),
        disabled:
          (min && d.getFullYear() < min.getFullYear()) ||
          (max && d.getFullYear() > max.getFullYear()),
      });
    }
    return cells;
  }, [value, min, max]);

  const refButton = useRef<HTMLButtonElement>(null);
  const refDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (refButton.current && refDiv.current) {
      refDiv.current.scrollTop =
        refButton.current.offsetTop - refDiv.current.offsetTop;
      refButton.current.focus();
    }
  }, []);

  return (
    <div ref={refDiv} className="grow grid grid-cols-4 overflow-auto py-2 pr-2">
      {grid.map((cell, i) => (
        <CSelectDatePageYearGridButton
          ref={(value ? cell.selected : cell.today) ? refButton : undefined}
          key={i}
          cell={cell}
          setPage={setPage}
          setShownDate={setShownDate}
        />
      ))}
    </div>
  );
}

const CSelectDatePageYearGridButton = forwardRef(
  function CSelectDatePageYearGridButton(
    {
      cell,
      setPage,
      setShownDate,
    }: {
      cell: IGridCell;
      setPage: (value: PageType) => void;
      setShownDate: (value: Date) => void;
    },
    ref: ForwardedRef<HTMLButtonElement>,
  ) {
    const handleClick = useCallback(() => {
      setPage("month");
      setShownDate(cell.date);
    }, [setPage, setShownDate, cell]);

    return (
      <button
        ref={ref}
        type="button"
        // pointer-events-none is to disable hover effects
        className="w-full h-12 text-lg p-0.5 outline-hidden group/item disabled:opacity-40 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:pointer-events-none"
        onClick={handleClick}
        disabled={cell.disabled}
      >
        <div
          className={classNames(
            "w-full h-full flex items-center justify-center rounded-md",
            "group-focus/item:x-outline",
            cell.selected
              ? "group-hover/item:bg-accent-700 dark:group-hover/item:bg-accent-500"
              : "group-hover/item:bg-gray-200 dark:group-hover/item:bg-gray-700",
            cell.selected
              ? "bg-accent-600 dark:bg-accent-600 text-white"
              : cell.today &&
                  "border-2 border-dashed border-accent-600 dark:border-accent-300",
          )}
        >
          {cell.date.getFullYear()}
        </div>
      </button>
    );
  },
);
