import { IDtoEDocumentApprovementStatus } from "common/build-api-schema";

import { CBadge } from "@m/core/components/CBadge";

import { useDocumentApprovementStatusMap } from "../hooks/useDocumentApprovementStatusMap";

const statusConfig: Record<
  IDtoEDocumentApprovementStatus,
  { className: string }
> = {
  APPROVED: {
    className: "text-green-700 dark:text-green-300",
  },
  PENDING: {
    className: "text-amber-700 dark:text-amber-300",
  },
  REJECTED: {
    className: "text-red-700 dark:text-red-300",
  },
};

export function CBadgeApprovementStatus({
  value,
}: {
  value: IDtoEDocumentApprovementStatus;
}) {
  const statusMap = useDocumentApprovementStatusMap();

  const { className } = statusConfig[value];
  const info = statusMap[value];

  return <CBadge className={className} icon={info.icon} value={info.label} />;
}
