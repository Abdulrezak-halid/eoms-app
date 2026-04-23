import { useCallback, useEffect, useMemo } from "react";

import { useTranslation } from "@m/core/hooks/useTranslation";

import { usePopupState } from "../hooks/usePopupState";
import { IconType } from "./CIcon";
import { CInputChipItem } from "./CInputChipItem";
import { CInputPopup } from "./CInputPopup";
import { CMultiSelectList } from "./CMultiSelectList";
import { ISelectListItem } from "./CSelectList";

export interface ICMultiSelectProps<TValue> {
  list?: readonly ISelectListItem<TValue>[];
  value?: TValue[];
  onChange?: (value: TValue[]) => void;
  onInvalidMsg?: (msg: string) => void;
  icon?: IconType;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  disabledValues?: TValue[];
  searchable?: boolean;
  searchPlaceholder?: string;
}

export function CMultiSelect<TValue>({
  list,
  value,
  onChange,
  onInvalidMsg,
  icon,
  placeholder,
  disabled,
  invalid,
  required,
  disabledValues,
  searchable,
  searchPlaceholder,
}: ICMultiSelectProps<TValue>) {
  // Maps values to labels and orders by the same order with the list
  const valuesMapped = useMemo(
    () =>
      value
        ?.map((d) => {
          const item = list?.find((v) => v.value === d);
          return {
            icon: item?.icon,
            // TODO Unknown
            label: item?.label || "Unknown",
            value: d,
          };
        })
        .sort((a, b) =>
          !list
            ? 0
            : list.findIndex((d) => d.value === a.value) -
              list.findIndex((d) => d.value === b.value),
        ) || [],
    [value, list],
  );

  const requiredInvalid = required && valuesMapped.length === 0;
  const invalidFinal = invalid || requiredInvalid;

  const { t } = useTranslation();
  useEffect(() => {
    if (!onInvalidMsg) {
      return;
    }
    let msg = "";
    if (!disabled && requiredInvalid) {
      msg = t("required");
    }
    onInvalidMsg(msg);
  }, [disabled, requiredInvalid, onInvalidMsg, t]);

  const popupState = usePopupState();

  const popupComponent = useCallback(
    () => (
      <CMultiSelectList
        list={list}
        value={value}
        onChange={onChange}
        disabledValues={disabledValues}
        searchable={searchable}
        searchPlaceholder={searchPlaceholder || t("search")}
      />
    ),
    [list, value, onChange, disabledValues, searchable, searchPlaceholder, t],
  );

  return (
    <CInputPopup
      icon={icon}
      state={popupState}
      placeholder={placeholder}
      popupComponent={popupComponent}
      disabled={disabled}
      invalid={invalidFinal}
    >
      {valuesMapped.length === 0 ? undefined : (
        <div className="-m-1 gap-1.5 flex flex-wrap">
          {valuesMapped.map((d, i) => (
            <CInputChipItem
              key={i}
              icon={d.icon}
              value={d.value}
              label={d.label}
            />
          ))}
        </div>
      )}
    </CInputPopup>
  );
}
