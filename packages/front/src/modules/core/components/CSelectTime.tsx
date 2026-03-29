/**
 * @file: CSelectTime.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 29.03.2025
 * Last Modified Date: 29.03.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { CPopupPanel } from "./CPopupPanel";
import { CSelectTimeBody } from "./CSelectTimeBody";

export function CSelectTime({
  value,
  onChange,
  min,
  max,
  withSeconds,
}: {
  value?: string;
  onChange?: (value: string) => void;
  min?: string;
  max?: string;
  withSeconds?: boolean;
}) {
  return (
    // Top-level overflow-hidden is to make scrollbar corners rounded
    <CPopupPanel className="h-96 overflow-hidden">
      <CSelectTimeBody
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        withSeconds={withSeconds}
      />
    </CPopupPanel>
  );
}
