import { classNames } from "../utils/classNames";
import { CIcon, IconType } from "./CIcon";
import { CLine } from "./CLine";

const infoMap = {
  mute: {
    icon: "text-gray-400 dark:text-gray-500",
    text: "text-gray-500 dark:text-gray-400",
  },
  warning: {
    icon: null,
    text: "text-amber-700 dark:text-orange-300",
  },
  error: {
    icon: null,
    text: "text-rose-700 dark:text-rose-400",
  },
};

export function CMessageText({
  icon,
  value,
  className,
  type,
}: {
  icon: IconType;
  value: string;
  className?: string;
  type: keyof typeof infoMap;
}) {
  const info = infoMap[type];
  return (
    <CLine
      className={classNames("space-x-1 justify-center", info.text, className)}
    >
      <CIcon value={icon} className={classNames(info.icon)} />
      <div>{value}</div>
    </CLine>
  );
}
