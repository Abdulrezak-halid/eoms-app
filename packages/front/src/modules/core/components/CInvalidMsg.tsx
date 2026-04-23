/**
 * @file: CInvalidMsg.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 01.11.2024
 * Last Modified Date: 01.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useEffect, useRef, useState } from "react";

export function CInvalidMsg({ value }: { value?: string | string[] }) {
  const refOuter = useRef<HTMLDivElement>(null);
  const refInner = useRef<HTMLDivElement>(null);

  const [oldValue, setOldValue] = useState(value);

  useEffect(() => {
    if (!refOuter.current || !refInner.current) {
      return;
    }
    if (value) {
      refOuter.current.style.height = `${refInner.current.clientHeight}px`;
      setOldValue(value);
      return;
    }
    refOuter.current.style.height = "0";
  }, [value]);

  const displayedValue = value || oldValue;

  return (
    <div
      ref={refOuter}
      className="text-rose-700 dark:text-rose-400 px-3 transition-[height] overflow-hidden"
      style={{ height: "0" }}
    >
      <div ref={refInner} className="py-1">
        {Array.isArray(displayedValue)
          ? displayedValue.map((d, i) => <div key={i}>{d}</div>)
          : displayedValue}
      </div>
    </div>
  );
}
