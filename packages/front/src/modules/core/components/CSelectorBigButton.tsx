import { CheckCircle2 } from "lucide-react";
import { useCallback } from "react";

import { CDisplayImage } from "@m/base/components/CDisplayImage";
import { CIcon, CIconOrCustom } from "@m/core/components/CIcon";
import { classNames } from "@m/core/utils/classNames";

import { ISelectListItem } from "./CSelectList";

export function CSelectorBigButton<TValue extends string>({
  list,
  value,
  onChange,
}: {
  list: ISelectListItem<TValue>[];
  value?: TValue;
  onChange: (value: TValue) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {list.map((d) => (
        <CSelectorBigButtonItem
          key={d.value}
          item={d}
          onClick={onChange}
          selected={d.value === value}
        />
      ))}
    </div>
  );
}

function CSelectorBigButtonItem<TValue>({
  item,
  onClick,
  selected,
}: {
  item: ISelectListItem<TValue>;
  onClick: (value: TValue) => void;
  selected: boolean;
}) {
  const handleClick = useCallback(() => {
    onClick(item.value);
  }, [onClick, item.value]);

  return (
    <button
      type="button"
      className={classNames(
        "group outline-hidden align-middle focus:x-outline",
        "text-center flex flex-col space-y-3 justify-center items-center rounded-md shadow-sm",
        "relative",
        "p-3 w-36",
        selected
          ? "bg-accent-600 dark:bg-accent-600 text-white hover:bg-accent-700 dark:hover:bg-accent-500"
          : "bg-white dark:bg-gray-700 text-accent-700 dark:text-accent-200 hover:bg-accent-50 dark:hover:bg-gray-600",
      )}
      onClick={handleClick}
      title={item.label}
    >
      {selected && (
        <div className="absolute top-0 left-0 p-1 bg-inherit rounded-full">
          <CIcon value={CheckCircle2} />
        </div>
      )}

      <div className="rounded-sm w-full h-12 flex-none flex justify-center items-center">
        {item.icon ? (
          <CIconOrCustom value={item.icon} className="w-10! h-10!" />
        ) : (
          item.imageSrc && (
            <CDisplayImage
              className="max-w-full max-h-full"
              src={item.imageSrc}
              alt={item.label}
            />
          )
        )}
      </div>
      <div className="font-bold">{item.label}</div>
    </button>
  );
}
