/**
 * @file: CMessageCard.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 10.11.2024
 * Last Modified Date: 10.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import {
  ArrowRight,
  Check,
  Info,
  OctagonAlert,
  TriangleAlert,
} from "lucide-react";

import { IRoutePath } from "../interfaces/IRoutePath";
import { classNames } from "../utils/classNames";
import { IButtonColor } from "./CButtonContainer";
import { CIcon, IconType } from "./CIcon";
import { CLine } from "./CLine";
import { CLink } from "./CLink";

const typeInfos = {
  success: {
    classNames:
      "bg-green-100 text-green-700 border-green-600 dark:text-green-300 dark:bg-green-900/50 dark:border-green-500",
    icon: Check,
    buttonColor: "default",
  },
  info: {
    classNames:
      "bg-sky-100 text-sky-700 border-sky-600 dark:text-sky-300 dark:bg-sky-900/50 dark:border-sky-500",
    icon: Info,
    buttonColor: "blue",
  },
  error: {
    classNames:
      "bg-rose-100 text-rose-700 border-rose-500 dark:text-rose-300 dark:bg-rose-900/50 dark:border-rose-500",
    icon: OctagonAlert,
    buttonColor: "red",
  },
  warning: {
    classNames:
      "bg-amber-100 text-amber-700 border-amber-600 dark:text-amber-300 dark:bg-amber-900/50 dark:border-amber-500",
    icon: TriangleAlert,
    buttonColor: "orange",
  },
} satisfies Record<
  string,
  { classNames: string; icon: IconType; buttonColor: IButtonColor }
>;

type IMessageType = keyof typeof typeInfos;

export function CMessageCard({
  message,
  goLabel,
  goPath,
  type = "warning",
  className,
}: {
  message: string;
  goLabel?: string;
  goPath?: IRoutePath;
  type?: IMessageType;
  className?: string;
}) {
  const typeInfo = typeInfos[type];

  // Style is very similary to CCard
  return (
    <CLine
      className={classNames(
        "rounded-lg shadow-sm flex items-center p-2 pl-4 space-x-3 border-l-6 overflow-x-auto",
        typeInfo.classNames,
        className,
      )}
    >
      <CIcon value={typeInfo.icon} />
      <div className="grow py-1">{message}</div>
      {goLabel && (
        <CLink
          iconRight={ArrowRight}
          color={typeInfo.buttonColor}
          label={goLabel}
          path={goPath}
          primary
          hideLabelSm
        />
      )}
    </CLine>
  );
}
