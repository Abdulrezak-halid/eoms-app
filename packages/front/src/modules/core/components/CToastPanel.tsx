/**
 * @file: CToast.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 31.10.2024
 * Last Modified Date: 01.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useContext, useMemo } from "react";
import {
  Check,
  Info,
  TriangleAlert,
  OctagonAlert,
} from "lucide-react";

import {
  ContextToast,
  IToastRecord,
  TOAST_DURATION_SEC,
} from "@m/core/contexts/ContextToast";

import { classNames } from "../utils/classNames";
import { CIcon } from "./CIcon";
import { CLine } from "./CLine";

export function CToastPanel() {
  const context = useContext(ContextToast);

  return (
    <div className="absolute top-0 right-0 left-0 bottom-0 z-20 p-4 space-y-2 overflow-hidden pointer-events-none flex flex-col justify-end">
      {context.items.map((d) => (
        <CToastRecord key={d.id} record={d} />
      ))}
    </div>
  );
}

const typeInfos = {
  success: {
    color: "bg-teal-50 text-teal-700 dark:bg-teal-800 dark:text-teal-200",
    icon: Check,
  },
  danger: {
    color: "bg-rose-50 text-rose-700 dark:bg-rose-800 dark:text-rose-200",
    icon: OctagonAlert,
  },
  warning: {
    color:
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200",
    icon: TriangleAlert,
  },
  info: {
    color: "bg-sky-50 text-sky-700 dark:bg-sky-800 dark:text-sky-200",
    icon: Info,
  },
  muted: {
    color: "bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-200",
    icon: Info,
  },
};

function CToastRecord({ record }: { record: IToastRecord }) {
  const typeInfo = typeInfos[record.type];

  const style = useMemo(
    () => ({
      animationName: "x-ani-width",
      animationTimingFunction: "linear",
      animationDuration: `${TOAST_DURATION_SEC - 0.1}s`,
    }),
    [],
  );

  return (
    <div
      className={classNames(
        "p-3 text-lg w-full sm:w-96 ml-auto pointer-events-auto select-none rounded-md shadow-md relative overflow-hidden flex-none",
        typeInfo.color,
      )}
    >
      <CLine className="space-x-3">
        <CIcon value={record.icon || typeInfo.icon} />
        <div className="leading-5">{record.message}</div>
      </CLine>

      {record.timer !== null && (
        <div
          className="absolute bottom-0 left-0 h-1 bg-current/40 w-full"
          style={style}
        />
      )}
    </div>
  );
}
