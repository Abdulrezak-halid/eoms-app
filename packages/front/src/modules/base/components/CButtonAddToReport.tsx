import { FilePlusCorner } from "lucide-react";
import { useCallback, useContext } from "react";

import { useReport } from "@m/base/hooks/useReport";
import { IReportQueueSectionType } from "@m/base/interfaces/IReportQueueSection";
import { CButton } from "@m/core/components/CButton";
import { ContextToast } from "@m/core/contexts/ContextToast";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CButtonAddToReport({
  sectionType,
  noHideLabel,
  disabled,
  tertiary,
}: {
  sectionType: IReportQueueSectionType;
  noHideLabel?: boolean;
  disabled?: boolean;
  tertiary?: boolean;
}) {
  const { t } = useTranslation();
  const { push } = useContext(ContextToast);
  const { addByType, hasSectionType } = useReport();

  const alreadyAdded = hasSectionType(sectionType);

  const handleClick = useCallback(() => {
    const added = addByType({ type: sectionType });
    if (added) {
      push(t("addedToReport"), "success");
      return;
    }
  }, [addByType, push, sectionType, t]);

  return (
    <CButton
      icon={FilePlusCorner}
      label={t("addToReport")}
      onClick={handleClick}
      hideLabelSm={!noHideLabel}
      disabled={disabled || alreadyAdded}
      tertiary={tertiary}
      hideLabelLg
    />
  );
}
