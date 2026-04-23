import { useMemo } from "react";

import { CRadioGroup } from "@m/core/components/CRadioGroup";
import { ISelectListItem } from "@m/core/components/CSelectList";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CRadioGroupPrimaryRecord({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const { t } = useTranslation();

  const list = useMemo<ISelectListItem<boolean>[]>(
    () => [
      {
        label: t("usePrimaryRecords"),
        value: true,
      },
      {
        label: t("selectRecordsManually"),
        value: false,
      },
    ],
    [t],
  );

  return <CRadioGroup list={list} value={value} onChange={onChange} inline />;
}
