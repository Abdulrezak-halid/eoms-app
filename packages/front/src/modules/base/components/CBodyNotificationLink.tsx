import { Bell } from "lucide-react";
import { useContext, useMemo } from "react";

import { CLink } from "@m/core/components/CLink";
import { useRoutePath } from "@m/core/hooks/useRoutePath";

import { ContextNotificationList } from "../contexts/ContextNotificationList";

export function CBodyNotificationLink() {
  const { items } = useContext(ContextNotificationList);

  const unreadCount = useMemo(() => {
    return items.filter((n) => !n.read).length;
  }, [items]);

  const routePath = useRoutePath();
  const isCurrentPage = routePath === "/notifications";

  return (
    <div className="relative">
      <CLink
        icon={Bell}
        path="/notifications"
        primary={isCurrentPage}
        tertiary
      />
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 pointer-events-none z-10">
          <div className="text-xs font-bold bg-rose-600 dark:bg-rose-700 text-white px-1.5 leading-5 rounded-full min-w-5 text-center">
            {unreadCount}
          </div>
        </div>
      )}
    </div>
  );
}
