import { DraggableProvided } from "@hello-pangea/dnd";
import { PropsWithChildren, ReactNode } from "react";
import { GripVertical } from "lucide-react";

import { usePermission } from "@m/base/hooks/usePermission";
import { CCard } from "@m/core/components/CCard";
import { CIcon } from "@m/core/components/CIcon";
import { CLine } from "@m/core/components/CLine";
import { CMutedText } from "@m/core/components/CMutedText";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { classNames } from "@m/core/utils/classNames";

export function CWidgetCard({
  title,
  actions,
  children,
  provided,
}: PropsWithChildren<{
  title?: string;
  actions?: ReactNode;
  provided?: DraggableProvided;
}>) {
  const { t } = useTranslation();

  const hasEditPerm = usePermission("/DASHBOARD/WIDGET/EDIT");

  return (
    <CCard className="h-full flex flex-col">
      {(title || actions || provided) && (
        <CLine className="justify-between items-center pr-2 pt-2">
          <div
            className={classNames(
              "flex items-center",
              !hasEditPerm && "h-12 pl-5",
            )}
          >
            {hasEditPerm && provided && (
              <div
                {...provided.dragHandleProps}
                className="cursor-move text-gray-400 hover:text-gray-600 w-12 h-12 flex items-center justify-center"
                title={t("movewidget")}
              >
                <CIcon value={GripVertical} lg />
              </div>
            )}
            {title && <CMutedText className="text-lg">{title}</CMutedText>}
          </div>

          <div className="flex items-center">
            {hasEditPerm && actions && <div className="ml-2">{actions}</div>}
          </div>
        </CLine>
      )}
      <div className="flex-1">{children}</div>
    </CCard>
  );
}
