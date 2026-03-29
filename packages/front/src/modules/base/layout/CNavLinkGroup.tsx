import { ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { CIcon, IconType } from "@m/core/components/CIcon";
import { CLine } from "@m/core/components/CLine";
import { IRoutePath } from "@m/core/interfaces/IRoutePath";

import { CNavLink } from "./CNavLink";

export function CNavLinkGroup({
  icon,
  label,
  list,
  onDone,
  searchQuery,
}: {
  icon: IconType;
  label: string;
  list: readonly {
    label: string;
    path: IRoutePath;
    highlightPath?: string;
  }[];
  onDone: () => void;
  searchQuery?: string;
}) {
  const [isOpened, setOpened] = useState(false);
  const toggleOpen = useCallback(() => {
    setOpened((d) => !d);
  }, []);

  const refOuter = useRef<HTMLDivElement>(null);
  const refInner = useRef<HTMLDivElement>(null);
  const [outerHeight, setOuterHeight] = useState(0);

  useEffect(() => {
    if (!refOuter.current || !refInner.current) {
      return;
    }
    if (!isOpened) {
      setOuterHeight(0);
      return;
    }

    const element = refInner.current;
    const resizeObserver = new ResizeObserver(() => {
      if (element.clientHeight === 0) {
        return;
      }
      setOuterHeight(element.clientHeight);
    });
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, [isOpened]);

  return (
    <div>
      <button
        type="button"
        className="outline-hidden w-full text-left py-3 focus:x-outline hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
        onClick={toggleOpen}
      >
        <CLine className="pl-3 pr-2 font-bold text-gray-600 dark:text-gray-200 space-x-2">
          <CIcon value={icon} />
          <div className="grow leading-5">{label}</div>
          <CIcon value={isOpened ? ChevronUp : ChevronDown} />
        </CLine>
      </button>

      <div
        ref={refOuter}
        className="transition-[height] duration-300 overflow-hidden -mx-2"
        style={{ height: `${outerHeight}px` }}
      >
        <div ref={refInner} className="px-2 py-1 space-y-1">
          {list.map((d, i) => (
            <CNavLink
              key={i}
              label={d.label}
              path={d.path}
              highlightPath={d.highlightPath}
              onDone={onDone}
              tabIndex={isOpened ? undefined : -1}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
