import { CHr } from "./CHr";
import { CMutedText } from "./CMutedText";

export function CFormTitle({ value }: { value: string }) {
  return (
    <div className="pt-4 pb-2">
      <CMutedText className="block mb-2" value={value} />
      <CHr />
    </div>
  );
}
