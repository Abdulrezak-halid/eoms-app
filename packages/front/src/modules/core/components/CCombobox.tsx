import {
  flip,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { ChevronDown, Paintbrush } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useTranslation } from "@m/core/hooks/useTranslation";
import { classNames } from "@m/core/utils/classNames";

import { MaybePromise } from "../interfaces/MaybePromise";
import { CIcon, IconType } from "./CIcon";
import { CInputContainer } from "./CInputContainer";
import { CInputInnerButton } from "./CInputInnerButton";
import { CLine } from "./CLine";
import { CSelectList, ISelectListItem } from "./CSelectList";

export interface ICComboboxProps<TValue> {
  list?: readonly ISelectListItem<TValue>[];
  value?: TValue;
  onChange?: (value: TValue | undefined) => MaybePromise<void>;
  onInvalidMsg?: (msg: string) => void;
  icon?: IconType;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  className?: string;
  hideLabelSm?: boolean;
  hideLabelMd?: boolean;
  hideLabelLg?: boolean;
  disabledValues?: TValue[];
  enabledValues?: TValue[];
  searchable?: boolean;
  searchPlaceholder?: string;
  noClear?: boolean;
}

export function CCombobox<TValue>({
  list,
  value,
  onChange,
  onInvalidMsg,
  icon,
  placeholder,
  disabled,
  invalid,
  required,
  className,
  hideLabelSm,
  hideLabelMd,
  hideLabelLg,
  disabledValues,
  enabledValues,
  searchable,
  searchPlaceholder,
  noClear,
}: ICComboboxProps<TValue>) {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-end",
    middleware: [
      flip(),
      offset(4),
      shift({ padding: 16 }),
      size({
        apply({ availableHeight, availableWidth, elements }) {
          Object.assign(elements.floating.style, {
            //width: `${elements.reference.getBoundingClientRect().width}px`,
            minWidth: `${elements.reference.getBoundingClientRect().width}px`,
            maxWidth: `${availableWidth - 32}px`,
            maxHeight: `${availableHeight - 8}px`,
          });
        },
      }),
    ],
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  const [busy, setBusy] = useState(false);
  const handleChange = useCallback(
    async (v: TValue | undefined) => {
      setIsOpen(false);
      setBusy(true);
      await onChange?.(v);
      setBusy(false);
    },
    [onChange],
  );

  const handleClear = useCallback(async () => {
    await handleChange(undefined);
  }, [handleChange]);

  const selectedListItem = useMemo(
    () =>
      value === undefined ? undefined : list?.find((d) => d.value === value),
    [list, value],
  );

  const requiredInvalid = required && value === undefined;
  const invalidFinal = invalid || requiredInvalid;

  const { t } = useTranslation();
  useEffect(() => {
    onInvalidMsg?.(!disabled && requiredInvalid ? t("required") : "");
  }, [requiredInvalid, onInvalidMsg, t, disabled]);

  return (
    <div className={classNames("relative", className)}>
      <button
        ref={refs.setReference}
        type="button"
        {...getReferenceProps()}
        disabled={disabled || busy}
        className="group outline-hidden block text-left min-w-0 w-full"
      >
        <CInputContainer
          className={classNames(
            "py-3",
            selectedListItem?.icon || icon ? "pl-12" : "pl-3",
          )}
          disabled={disabled}
          invalid={invalidFinal}
          icon={selectedListItem?.icon || icon}
        >
          <CLine className="justify-between">
            <div
              className={classNames(
                "text-nowrap overflow-hidden text-ellipsis grow",
                hideLabelSm && "hidden @sm:block",
                hideLabelMd && "hidden @md:block",
                hideLabelLg && "hidden @lg:block",
                !selectedListItem && "x-placeholder",
              )}
            >
              {selectedListItem ? selectedListItem.label : placeholder}
            </div>

            {value && !disabled && !busy && !noClear && (
              <CInputInnerButton
                ariaLabel={t("clear")}
                icon={Paintbrush}
                onClick={handleClear}
                className="-my-3 ml-3"
              />
            )}

            <CIcon
              value={ChevronDown}
              className="w-12! text-accent-700 dark:text-accent-200"
            />
          </CLine>
        </CInputContainer>
      </button>

      {isOpen && (
        <div
          ref={refs.setFloating}
          // flex is to force content height match to floating ui height
          className="z-20 flex"
          style={floatingStyles}
          {...getFloatingProps()}
        >
          <CSelectList
            list={list}
            value={value}
            onChange={handleChange}
            disabledValues={disabledValues}
            enabledValues={enabledValues}
            searchable={searchable}
            searchPlaceholder={searchPlaceholder || t("search")}
          />
        </div>
      )}
    </div>
  );
}
