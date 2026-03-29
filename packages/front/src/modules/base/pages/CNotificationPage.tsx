import { CheckCheck } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CNotificationCard } from "@m/base/components/CNotificationCard";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CButton } from "@m/core/components/CButton";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { ContextNotificationList } from "../contexts/ContextNotificationList";

export default function CNotificationPage() {
  const { t } = useTranslation();

  const { data, load } = useContext(ContextNotificationList);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("notifications") }],
    [t],
  );

  const hasUnread = useMemo(
    () => data.payload?.records.some((n) => !n.read) ?? false,
    [data.payload],
  );

  const handleReadAll = useCallback(async () => {
    await Api.PUT("/u/core/notification/set-read", { body: {} });
    await load();
  }, [load]);

  const handleReadOne = useCallback(
    async (id: string) => {
      await Api.PUT("/u/core/notification/set-read", { body: { id } });
      await load();
    },
    [load],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <div className="space-y-4">
            <div className="flex justify-end">
              <CButton
                icon={CheckCheck}
                label={t("markAllAsRead")}
                onClick={handleReadAll}
                tertiary
                disabled={!hasUnread}
              />
            </div>

            {payload.records.map((notification) => (
              <CNotificationCard
                key={notification.id}
                notification={notification}
                onRead={handleReadOne}
              />
            ))}
          </div>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
