import { IDtoNotificationContent } from "common/build-api-schema";

import { TranslationFunc } from "@m/core/hooks/useTranslation";
import { IRoutePath } from "@m/core/interfaces/IRoutePath";
import { renderPlainOrTranslatableText } from "@m/report/utils/renderPlainOrTranslatableText";

export function renderNotificationMessage(
  content: IDtoNotificationContent,
  t: TranslationFunc,
): { message: string; path: IRoutePath } {
  switch (content.type) {
    case "PARTNERSHIP_CREATED":
      return {
        message: t("notificationNewPartnerAdded", {
          organizationName: content.organizationName,
        }),
        path: "/configuration/organization-partners",
      };

    case "REPORT_RENDER_COMPLETED":
      return {
        message: t("notificationReportRenderCompleted", {
          title: renderPlainOrTranslatableText(t, content.reportTitle),
        }),
        path: `/report/output-file/item/${content.reportId}`,
      };

    case "OUTBOUND_INTEGRATION_BROKEN":
      return {
        message: t("notificationOutboundIntegrationBroken", {
          integrationType: content.integrationType,
          metricName: content.metricName,
        }),
        path: "/measurements/metric-integration/outbound",
      };

    case "TEST":
      return {
        message: "Test Notification",
        path: "/",
      };

    case "WELCOME":
      return {
        message: t("msgNotificationWelcome"),
        path: "/",
      };
  }
}
