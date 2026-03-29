import {
  ArrowRight,
  Check,
  Info,
  OctagonAlert,
  TriangleAlert,
} from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import {
  ContextNotificationBalloon,
  INotificationBalloonRecord,
  NOTIFICATION_BALLOON_DURATION_SEC,
} from "@m/core/contexts/ContextNotificationBalloon";

import { useNavigate } from "../hooks/useNavigate";
import { classNames } from "../utils/classNames";
import { CIcon } from "./CIcon";

export function CNotificationBalloonPanel() {
  const { items, remove } = useContext(ContextNotificationBalloon);

  const itemsReversed = useMemo(() => {
    const newList = [...items];
    newList.reverse();
    return newList;
  }, [items]);

  return (
    <div className="absolute top-0 right-0 left-0 bottom-0 z-50 p-4 space-y-2 flex flex-col overflow-hidden pointer-events-none">
      {itemsReversed.map((d) => (
        <CNotificationBalloonRecord key={d.id} record={d} remove={remove} />
      ))}
    </div>
  );
}

const typeInfos = {
  success: {
    color:
      "bg-teal-100 hover:bg-teal-200 text-teal-700 dark:bg-teal-800 dark:hover:bg-teal-700 dark:text-teal-100 ",
    icon: Check,
  },
  danger: {
    color:
      "bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-800 dark:hover:bg-rose-700 dark:text-rose-100",
    icon: OctagonAlert,
  },
  warning: {
    color:
      "bg-yellow-100 hover:bg-yellow-200 text-yellow-700 dark:bg-yellow-800 dark:hover:bg-yellow-700 dark:text-yellow-100",
    icon: TriangleAlert,
  },
  info: {
    color:
      "bg-sky-100 hover:bg-sky-200 text-sky-700 dark:bg-sky-800 dark:hover:bg-sky-700 dark:text-sky-100",
    icon: Info,
  },
  muted: {
    color:
      "bg-gray-200 hover:bg-gray-300 text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100",
    icon: Info,
  },
};

function CNotificationBalloonRecord({
  record,
  remove,
}: {
  record: INotificationBalloonRecord;
  remove: (id: number) => void;
}) {
  const typeInfo = typeInfos[record.type];

  const style = useMemo(
    () => ({
      animationName: "x-ani-width",
      animationTimingFunction: "linear",
      animationDuration: `${NOTIFICATION_BALLOON_DURATION_SEC - 0.1}s`,
      animationDelay: `${record.creation - new Date().getTime()}ms`,
    }),
    [record.creation],
  );

  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    remove(record.id);
    navigate(record.path);
  }, [navigate, record.id, record.path, remove]);

  return (
    <button
      type="button"
      className={classNames(
        "outline-hidden focus:x-outline pointer-events-auto select-none",
        "text-left w-full sm:w-96 ml-auto rounded-md shadow-md relative overflow-hidden flex-none",
        typeInfo.color,
      )}
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3 min-h-16 px-3">
        <CIcon value={record.icon || typeInfo.icon} />

        <div className="leading-5 py-2 grow">{record.message}</div>

        <CIcon
          className="text-accent-600 dark:text-accent-200"
          value={ArrowRight}
        />
      </div>

      {record.timer !== null && (
        <div
          className={classNames(
            "absolute bottom-0 left-0 h-1 bg-gray-800/10 dark:bg-white/30",
            "w-full",
          )}
          style={style}
        />
      )}
    </button>
  );
}
