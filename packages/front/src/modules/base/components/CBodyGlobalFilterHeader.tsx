import { CDatetimeRangeButton } from "@m/core/components/CDatetimeRangeButton";

export function CBodyGlobalFilterHeader() {
  return (
    <div className="p-2 pt-0 flex gap-2 justify-end">
      <CDatetimeRangeButton />
    </div>
  );
}
