import { RefObject, useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { classNames } from "@m/core/utils/classNames";

import { timePartsToStr, useInputTimeParts } from "../hooks/useInputTimeParts";
import { CMutedText } from "./CMutedText";

export function CSelectTimeBody({
  value,
  onChange,
  min,
  max,
  withSeconds: withSecond,
}: {
  value?: string;
  onChange?: (value: string) => void;
  min?: string;
  max?: string;
  withSeconds?: boolean;
}) {
  const { t } = useTranslation();

  // TODO move CSelectTime to CSelectTimeCore and move useInputTimeParts
  //   responsiblity to user. There should be 3 components, input, select, and
  //   core.
  const { valueParts, minParts, maxParts } = useInputTimeParts(value, min, max);

  const handleChange = useCallback(
    (index: number, partValue: number) => {
      if (!onChange) {
        return;
      }
      const newValueParts = valueParts ? [...valueParts] : [0, 0, 0];
      newValueParts[index] = partValue;
      if (!withSecond) {
        newValueParts[2] = 0;
      }
      onChange(timePartsToStr(newValueParts));
    },
    [onChange, valueParts, withSecond],
  );

  return (
    <div className="bg-white dark:bg-gray-700 h-full flex">
      <CSelectTimeColumn
        count={24}
        index={0}
        value={valueParts?.[0]}
        onChange={handleChange}
        label={t("hour")}
        min={minParts?.[0]}
        max={maxParts?.[0]}
      />
      <CSelectTimeColumn
        count={60}
        index={1}
        value={valueParts?.[1]}
        onChange={handleChange}
        label={t("minute")}
        min={
          minParts && valueParts && minParts[0] === valueParts[0]
            ? minParts[1]
            : undefined
        }
        max={
          maxParts && valueParts && maxParts[0] === valueParts[0]
            ? maxParts[1]
            : undefined
        }
      />
      {withSecond && (
        <CSelectTimeColumn
          count={60}
          index={2}
          value={valueParts?.[2]}
          onChange={handleChange}
          label={t("timeSecond")}
          min={
            minParts &&
            valueParts &&
            minParts[0] === valueParts[0] &&
            minParts[1] === valueParts[1]
              ? minParts[1]
              : undefined
          }
          max={
            maxParts &&
            valueParts &&
            maxParts[0] === valueParts[0] &&
            maxParts[1] === valueParts[1]
              ? maxParts[1]
              : undefined
          }
        />
      )}
    </div>
  );
}

function CSelectTimeColumn({
  count,
  label,
  index,
  value,
  onChange,
  min,
  max,
}: {
  count: number;
  label: string;
  index: number;
  value?: number;
  onChange: (index: number, value: number) => void;
  min?: number;
  max?: number;
}) {
  const list = useMemo(() => Array.from({ length: count }), [count]);

  const refList = useRef<HTMLDivElement>(null);

  return (
    <div className="h-full flex-1 flex flex-col">
      <div className="text-center py-0.5 flex-none bg-gray-50 dark:bg-gray-800">
        <CMutedText value={label} />
      </div>
      <div ref={refList} className="grow overflow-auto p-1">
        {list.map((_, i) => (
          <CSelectListItem
            key={i}
            refList={refList}
            value={i}
            index={index}
            onChange={onChange}
            selected={value === i}
            disabled={
              (min !== undefined && i < min) || (max !== undefined && i > max)
            }
          />
        ))}
      </div>
    </div>
  );
}

function CSelectListItem({
  value,
  index,
  onChange,
  selected,
  disabled,
  refList,
}: {
  value: number;
  index: number;
  onChange: (index: number, value: number) => void;
  selected: boolean;
  disabled: boolean;
  refList: RefObject<HTMLDivElement | null>;
}) {
  const handleChange = useCallback(() => {
    onChange(index, value);
  }, [onChange, index, value]);

  const ref = useRef<HTMLButtonElement>(null);
  // const refInitialSelected = useRef(selected);

  useEffect(() => {
    if (selected && refList.current && ref.current) {
      refList.current.scrollTop =
        ref.current.offsetTop - refList.current.offsetTop;
    }
  }, [refList, selected]);

  return (
    <button
      ref={ref}
      type="button"
      // pointer-events-none is to disable hover effects
      className={classNames(
        "p-3 w-full outline-hidden rounded-md focus:x-outline space-x-2 font-bold text-right disabled:pointer-events-none",
        "disabled:opacity-40 disabled:rounded-none",
        selected
          ? "bg-accent-600 dark:bg-accent-600 text-white hover:bg-accent-700 dark:hover:bg-accent-500"
          : "text-accent-700 dark:text-accent-200 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:bg-gray-300 dark:disabled:bg-gray-600",
      )}
      onClick={handleChange}
      disabled={disabled}
    >
      {value}
    </button>
  );
}
