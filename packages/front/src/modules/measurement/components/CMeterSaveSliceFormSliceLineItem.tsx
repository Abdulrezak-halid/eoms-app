import { Trash2 } from "lucide-react";
import { useMemo } from "react";

import { CComboboxDepartment } from "@m/base/components/CComboboxDepartment";
import { CButton } from "@m/core/components/CButton";
import { CCheckbox } from "@m/core/components/CCheckbox";
import { CInputNumber } from "@m/core/components/CInputNumber";

interface ICMeterSaveSliceFormLineItemProps {
  departmentId: string | undefined;
  percent: number | undefined;
  isMain: boolean;
  onDelete: () => void;
  onDepartmentChange: (departmentId: string | undefined) => void;
  onPercentChange: (percent: number | undefined) => void;
  onIsMainChange: (isMain: boolean) => void;
  usedDepartmentIds: string[];
  invalidPercent: boolean;
}

export function CMeterSaveSliceFormSliceLineItem({
  departmentId,
  percent,
  isMain,
  onDelete,
  onDepartmentChange,
  onPercentChange,
  onIsMainChange,
  usedDepartmentIds,
  invalidPercent,
}: ICMeterSaveSliceFormLineItemProps) {
  const disabledDepartments = useMemo(() => {
    return usedDepartmentIds.filter((id) => id !== departmentId);
  }, [usedDepartmentIds, departmentId]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex-none w-12 flex justify-center">
        <CCheckbox selected={isMain} onChange={onIsMainChange} />
      </div>
      <div className="grow min-w-0">
        <CComboboxDepartment
          value={departmentId}
          onChange={onDepartmentChange}
          disabledValues={disabledDepartments}
          required
        />
      </div>

      <div className="flex-none w-28">
        <CInputNumber
          value={percent}
          min={1}
          max={100}
          onChange={onPercentChange}
          invalid={invalidPercent}
          required
        />
      </div>
      <div className="flex-none w-12">
        <CButton icon={Trash2} onClick={onDelete} />
      </div>
    </div>
  );
}
