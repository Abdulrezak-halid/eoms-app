/**
 * @file: CDevWebSocketHandling.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 22.12.2025
 * Last Modified Date: 11.02.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IDtoWsServerMessage } from "common/build-api-schema";
import { User, Users } from "lucide-react";
import { useCallback, useState } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useWsServerMessage } from "@m/base/hooks/useWsServerMessage";
import { CButton } from "@m/core/components/CButton";
import { CCard } from "@m/core/components/CCard";

export function CDevWebSocketHandling() {
  const apiToast = useApiToast();

  const handleClick = useCallback(
    async (target: "USER" | "ORGANIZATION") => {
      const res = await Api.POST("/g/dev/ws-notification/test", {
        body: {
          target,
          message: {
            type: "NOTIFICATION",
            content: { type: "TEST" },

            // content: {
            //   type: "REPORT_RENDER_COMPLETED",
            //   reportId: "00000000-0000-0000-0000-000000000000",
            //   reportTitle: {
            //     type: "PLAIN",
            //     value: "Test",
            //   },
            // },
          },
        },
      });

      apiToast(res);
    },
    [apiToast],
  );

  const [latestWsMessage, setLatestWsMessage] = useState<IDtoWsServerMessage>();

  const wsListener = useCallback((msg: IDtoWsServerMessage) => {
    setLatestWsMessage(msg);
  }, []);

  useWsServerMessage(wsListener);

  return (
    <CBody title="Dev - Websocket Handling">
      <div className="flex flex-col space-y-2">
        <CButton
          icon={User}
          label="Send test notification to user"
          value="USER"
          onClick={handleClick}
        />
        <CButton
          icon={Users}
          label="Send test notification to organization"
          value="ORGANIZATION"
          onClick={handleClick}
        />
      </div>

      {latestWsMessage && (
        <div>
          <div>Latest Message</div>
          <CCard className="p-3">
            <pre>{JSON.stringify(latestWsMessage, null, 2)}</pre>
          </CCard>
        </div>
      )}
    </CBody>
  );
}
