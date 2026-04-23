/**
 * @file: CSelectDate.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 17.10.2024
 * Last Modified Date: 30.03.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { CPopupPanel } from "./CPopupPanel";
import { CSelectDateBody } from "./CSelectDateBody";

export function CSelectDate({
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
  return (
    <CPopupPanel className="w-[22rem]">
      <div className="h-[26rem]">
        <CSelectDateBody
          value={value}
          onChange={onChange}
          sundayFirst={sundayFirst}
          min={min}
          max={max}
          noClear={noClear}
        />
      </div>
    </CPopupPanel>
  );
}
