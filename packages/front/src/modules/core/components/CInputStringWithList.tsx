/**
 * @file: CInputStringWithList.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 01.02.2026
 * Last Modified Date: 01.02.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import {
  flip,
  offset,
  shift,
  size,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { useCallback, useMemo, useState } from "react";

import { classNames } from "../utils/classNames";
import { CInputString, ICInputStringProps } from "./CInputString";
import { CSelectList } from "./CSelectList";

export function CInputStringWithList({
  list,
  className,
  ...props
}: Omit<ICInputStringProps, "onFocus"> & {
  list: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-end",
    middleware: [
      flip(),
      offset(4),
      shift({ padding: 16 }),
      size({
        apply({ availableHeight, availableWidth, elements }) {
          Object.assign(elements.floating.style, {
            //width: `${elements.reference.getBoundingClientRect().width}px`,
            minWidth: `${elements.reference.getBoundingClientRect().width}px`,
            maxWidth: `${availableWidth - 32}px`,
            maxHeight: `${availableHeight - 8}px`,
          });
        },
      }),
    ],
  });
  // const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    // click,
    dismiss,
  ]);

  const listForSelectList = useMemo(
    () => list?.map((d) => ({ label: d, value: d })),
    [list],
  );

  const handleFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  return (
    <div className={classNames("relative", className)}>
      <div ref={refs.setReference} {...getReferenceProps()}>
        <CInputString {...props} onFocus={handleFocus} />
      </div>

      {listForSelectList && isOpen && (
        <div
          ref={refs.setFloating}
          // flex is to force content height match to floating ui height
          className="z-20 flex"
          style={floatingStyles}
          {...getFloatingProps()}
        >
          <CSelectList
            list={listForSelectList}
            value={props.value}
            onChange={props.onChange}
          />
        </div>
      )}
    </div>
  );
}
