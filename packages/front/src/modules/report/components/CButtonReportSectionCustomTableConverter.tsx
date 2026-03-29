/**
 * @file: CButtonReportSectionCustomTableConverter.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 21.01.2026
 * Last Modified Date: 21.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { ArrowRight } from "lucide-react";
import { useCallback, useContext } from "react";

import { CButton } from "@m/core/components/CButton";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoReportSectionContent } from "../interfaces/IDtoReport";
import { IVerticalTableData } from "../interfaces/IVerticalTableData";

export function CButtonReportSectionCustomTableConverter<TData>({
  data,
  converter,
  onChange,
}: {
  data: TData;
  converter: (data: TData) => IVerticalTableData;
  onChange: (value: IDtoReportSectionContent) => void;
}) {
  const { t } = useTranslation();

  const { push } = useContext(ContextAreYouSure);

  const handleConvert = useCallback(async () => {
    await push(t("msgReportSectionConvertCustomTable"), () => {
      const tableData = converter(data);
      onChange({ type: "TABLE_VERTICAL", data: tableData });
    });
  }, [converter, data, onChange, push, t]);

  return (
    <div className="flex justify-end">
      <CButton
        icon={ArrowRight}
        label={t("convertToEditableTable")}
        onClick={handleConvert}
      />
    </div>
  );
}
