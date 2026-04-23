import { ArrowRight, Check } from "lucide-react";

import { renderNotificationMessage } from "@m/base/utils/renderNotificationMessage";
import { CBadgeContainer } from "@m/core/components/CBadgeContainer";
import { CButton } from "@m/core/components/CButton";
import { CCard } from "@m/core/components/CCard";
import { CLink } from "@m/core/components/CLink";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { classNames } from "@m/core/utils/classNames";

import { IDtoNotificationListItem } from "../interfaces/IDtoNotificationListItem";
import { CDisplayDateAgo } from "./CDisplayDateAgo";

export function CNotificationCard({
  notification,
  onRead,
}: {
  notification: IDtoNotificationListItem;
  onRead: (id: string) => Promise<void>;
}) {
  const { t } = useTranslation();

  const { message, path } = renderNotificationMessage(notification.content, t);

  return (
    <CCard
      className={classNames(
        "p-2 pl-4",
        !notification.read && "border-l-4 border-accent-500",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 break-words">
          {message}
          <CBadgeContainer className="ml-2">
            <CDisplayDateAgo value={notification.createdAt} />
          </CBadgeContainer>
        </div>
        <div className="flex items-center gap-1">
          {!notification.read && (
            <CButton
              icon={Check}
              value={notification.id}
              onClick={onRead}
              tertiary
            />
          )}
          <CLink icon={ArrowRight} path={path} tertiary />
        </div>
      </div>
    </CCard>
  );
}
