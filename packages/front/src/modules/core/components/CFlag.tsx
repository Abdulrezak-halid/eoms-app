import Flag from "react-world-flags";

import { classNames } from "../utils/classNames";

export function CFlag({
  value,
  sm,
  lg,
}: {
  value: "tr" | "us" | "gb" | "ro";
  sm?: boolean;
  lg?: boolean;
}) {
  return (
    // For select list popup size, icon size must be preset,
    //   that's why a div is here. When it is set on Flag directly,
    //   it is lazy loaded and popup window size is calculated wrong.
    //   Also div is good for usage in flexboxes, that it may stretches
    <div className={classNames(lg ? "w-8" : sm ? "w-5" : "w-6")}>
      <Flag code={value} className="aspect-auto rounded-xs overflow-hidden" />
    </div>
  );
}
