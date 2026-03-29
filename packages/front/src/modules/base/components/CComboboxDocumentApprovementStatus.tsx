import { IDtoEDocumentApprovementStatus } from "common/build-api-schema";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CCombobox, ICComboboxProps } from "@m/core/components/CCombobox";
import { useMapToComboList } from "@m/core/hooks/useMapToComboList";

import { useDocumentApprovementStatusMap } from "../hooks/useDocumentApprovementStatusMap";

export function CComboboxDocumentApprovementStatus(
  props: Omit<ICComboboxProps<IDtoEDocumentApprovementStatus>, "list">,
) {
  const { t } = useTranslation();

  const documentApprovementStatusMap = useDocumentApprovementStatusMap();

  const list = useMapToComboList(documentApprovementStatusMap);

  return (
    <CCombobox
      placeholder={t("selectAnApprovementStatus")}
      {...props}
      list={list}
    />
  );
}
