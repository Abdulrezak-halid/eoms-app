import { EllipsisVertical } from "lucide-react";
import { ReactNode, useCallback, useMemo, useState } from "react";

import { usePopupState } from "../hooks/usePopupState";
import { IRoutePath } from "../interfaces/IRoutePath";
import { MaybePromise } from "../interfaces/MaybePromise";
import { CButtonPopup } from "./CButtonPopup";
import { IconType } from "./CIcon";
import { CSelectList } from "./CSelectList";

export type IDropdownListItem<TValue> = {
  icon?: IconType | ReactNode;
  label: string;
  disabled?: boolean;
  onClick?: (value: TValue) => MaybePromise<void>;
  path?: IRoutePath;
};

export type IDropdownListCallback<TValue> = (
  value: TValue,
) => IDropdownListItem<TValue>[];

export function CDropdown<TValue>({
  icon,
  label,
  list,
  value,
  hideLabelLg,
  hideLabelMd,
  iconRight = EllipsisVertical,
  tertiary,
  noIconRight,
  selectedItem,
  disabled,
}: {
  icon?: IconType | ReactNode;
  label?: string;
  hideLabelLg?: boolean;
  hideLabelMd?: boolean;
  iconRight?: IconType;
  tertiary?: boolean;
  noIconRight?: boolean;
  disabled?: boolean;
} & (
  | {
      value?: undefined;
      list: IDropdownListItem<undefined>[];
      selectedItem?: IDropdownListItem<undefined>;
    }
  | {
      value: TValue;
      list: IDropdownListItem<TValue>[] | IDropdownListCallback<TValue>;
      selectedItem?: IDropdownListItem<TValue>;
    }
)) {
  const listInternal = useMemo(
    () =>
      (typeof list === "function"
        ? list(value === undefined ? (undefined as TValue) : value)
        : list
      ).map((d) => ({
        icon: d.icon,
        label: d.label,
        disabled: d.disabled,
        value: d,
        path: d.path,
      })),
    [list, value],
  );

  const popupState = usePopupState();
  const setIsOpen = popupState.setIsOpen;

  const [busy, setBusy] = useState(false);

  const handleChange = useCallback(
    async (item: IDropdownListItem<TValue> | IDropdownListItem<undefined>) => {
      setIsOpen(false);
      setBusy(true);
      if (item.onClick) {
        await (item.onClick as (value: TValue) => MaybePromise<void>)(
          value as TValue,
        );
      }
      setBusy(false);
    },
    [value, setIsOpen],
  );

  const popupComponent = useCallback(
    () => (
      <CSelectList
        list={listInternal}
        onChange={handleChange}
        value={selectedItem}
      />
    ),
    [handleChange, listInternal, selectedItem],
  );

  return (
    <CButtonPopup
      icon={icon}
      iconRight={noIconRight ? undefined : iconRight}
      label={label}
      popupComponent={popupComponent}
      popupState={popupState}
      disabled={busy || disabled}
      hideLabelLg={hideLabelLg}
      hideLabelMd={hideLabelMd}
      tertiary={tertiary}
    />
  );
}
