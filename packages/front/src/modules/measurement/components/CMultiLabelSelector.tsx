import { Plus, Tags } from "lucide-react";

import { CButton } from "@m/core/components/CButton";
import { CInputString } from "@m/core/components/CInputString";
import { CInputStringWithList } from "@m/core/components/CInputStringWithList";
import { CLine } from "@m/core/components/CLine";
import {
  CMultiSelect,
  ICMultiSelectProps,
} from "@m/core/components/CMultiSelect";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { useMultiLabelSelector } from "../hooks/useMultiLabelSelector";
import { ICLabelSelectorValue } from "../interfaces/IMultiLabelSelector";

export interface ICMultiLabelSelectorProps
  extends Omit<ICMultiSelectProps<string>, "list" | "value" | "onChange"> {
  value?: ICLabelSelectorValue[];
  onChange?: (value: ICLabelSelectorValue[]) => void;
  metricId?: string;
  onBusyChange?: (value: boolean) => void;
}

export function CMultiLabelSelector({
  value,
  onChange,
  onInvalidMsg,
  metricId,
  onBusyChange,
  disabled,
  invalid,
  required,
  ...props
}: ICMultiLabelSelectorProps) {
  const { t } = useTranslation();
  const selector = useMultiLabelSelector({
    value,
    onChange,
    metricId,
    onInvalidMsg,
    onBusyChange,
    disabled,
    invalid,
    required,
  });

  return (
    <div className="space-y-2">
      <CMultiSelect
        icon={Tags}
        list={selector.list}
        searchable
        placeholder={t("labels")}
        searchPlaceholder={t("search")}
        value={selector.selectedSerialized}
        onChange={selector.handleSelectChange}
        disabled={disabled}
        invalid={selector.invalidFinal}
        {...props}
      />

      <CLine className="gap-2 items-start">
        <div className="grow min-w-0">
          <CInputStringWithList
            value={selector.nextKey}
            onChange={selector.setNextKey}
            list={selector.keyOptions}
            placeholder={t("key")}
            required={Boolean(selector.nextValue.trim())}
            disabled={disabled}
          />
        </div>

        <div className="grow min-w-0">
          <CInputString
            value={selector.nextValue}
            onChange={selector.setNextValue}
            placeholder={t("value")}
            required={Boolean(selector.nextKey.trim())}
            disabled={disabled}
          />
        </div>

        <CButton
          icon={Plus}
          label={t("add")}
          onClick={selector.handleAdd}
          disabled={!selector.canAdd}
        />
      </CLine>
    </div>
  );
}
