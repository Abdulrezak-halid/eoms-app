/**
 * @file: CInputMultiString.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 01.11.2024
 * Last Modified Date: 24.02.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useCallback, useEffect, useRef, useState } from "react";

import { useTranslation } from "@m/core/hooks/useTranslation";

import { classNames } from "../utils/classNames";
import { IconType } from "./CIcon";
import { CInputChipItem } from "./CInputChipItem";
import { CInputContainer } from "./CInputContainer";
import { CInputCore } from "./CInputCore";

export function CInputMultiString({
  value,
  onChange,
  placeholder,
  onInvalidMsg,
  icon,
  disabled,
  invalid,
  required,
  regex,
  regexInvalidMsg,
}: {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  onInvalidMsg?: (msg: string) => void;
  icon?: IconType;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  regex?: RegExp;
  regexInvalidMsg?: string;
}) {
  const [nextValue, setNextValue] = useState("");

  const { t } = useTranslation();

  const handleEnter = useCallback(() => {
    if (!nextValue) {
      return;
    }

    if (regex && !regex.test(nextValue)) {
      return;
    }

    setNextValue("");
    if (onChange) {
      onChange(value ? [...value, nextValue] : [nextValue]);
    }
  }, [nextValue, regex, onChange, value]);

  const handleRemove = useCallback(
    (index: number) => {
      if (!value || !onChange) {
        return;
      }
      const copy = [...value];
      copy.splice(index, 1);
      onChange(copy);
    },
    [value, onChange],
  );

  const refInput = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    refInput.current?.focus();
  }, []);

  const [invalidInternal, setInvalidInternal] = useState(false);
  const invalidFinal = invalid || invalidInternal;

  useEffect(() => {
    // Order of checks are on purpose

    if (nextValue && regex && !regex.test(nextValue)) {
      onInvalidMsg?.(regexInvalidMsg || t("invalidRegex"));
      setInvalidInternal(true);
      return;
    }

    if (nextValue) {
      onInvalidMsg?.(t("pressEnterToAddValue"));
      // It is false intentionally, do not make the input red for this error
      setInvalidInternal(false);
      return;
    }

    if (required && (!value || value.length === 0)) {
      onInvalidMsg?.(t("required"));
      setInvalidInternal(true);
      return;
    }

    if (value && new Set(value).size !== value.length) {
      onInvalidMsg?.(t("invalidDuplicatedItems"));
      setInvalidInternal(true);
      return;
    }

    onInvalidMsg?.("");
    setInvalidInternal(false);
  }, [value, nextValue, onInvalidMsg, t, required, regex, regexInvalidMsg]);

  return (
    <div
      className="block text-left w-full enabled:hover:cursor-text"
      onClick={handleClick}
    >
      <CInputContainer
        icon={icon}
        className={classNames(
          "group-disabled:pointer-events-none p-2 flex flex-wrap gap-2",
          icon && "pl-10",
          disabled && "pointer-events-none",
        )}
        invalid={invalidFinal}
        // Actually not needed, but to remove invalid style when disabled
        disabled={disabled}
      >
        {value &&
          value.map((d, i) => (
            <CInputChipItem
              key={i}
              value={i}
              label={d}
              onRemove={handleRemove}
            />
          ))}
        {/* TODO input inside button */}
        <CInputCore
          ref={refInput}
          value={nextValue}
          onChange={setNextValue}
          className={classNames("inline-block w-auto! -m-2")}
          placeholder={!value || value.length === 0 ? placeholder : undefined}
          // TODO
          maxLength={50}
          onEnter={handleEnter}
          disabled={disabled}
        />
      </CInputContainer>
    </div>
  );
}
