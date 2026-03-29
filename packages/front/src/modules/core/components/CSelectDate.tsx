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
