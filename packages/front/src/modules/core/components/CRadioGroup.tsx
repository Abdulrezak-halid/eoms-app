/**
 * @file: CRadioGroup.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 22.10.2024
 * Last Modified Date: 22.10.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { classNames } from "../utils/classNames";
import { CCheckbox } from "./CCheckbox";
import { ISelectListItem } from "./CSelectList";

export function CRadioGroup<TValue>({
  list,
  value,
  onChange,
  disabled,
  inline,
}: {
  list: readonly ISelectListItem<TValue>[];
  value: TValue;
  onChange?: (value: TValue, selected: boolean) => void;
  disabled?: boolean;
  inline?: boolean;
}) {
  return (
    <div
      className={classNames(
        inline && "flex flex-col @xs:flex-row @xs:items-center @xs:space-x-4",
      )}
    >
      {list.map((d, i) => (
        <CCheckbox
          key={i}
          radio
          selected={value === d.value}
          value={d.value}
          label={d.label}
          onClick={onChange}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
