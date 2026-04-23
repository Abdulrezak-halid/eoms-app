/**
 * @file: CInputCore.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.11.2024
 * Last Modified Date: 06.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import {
  ChangeEvent,
  ForwardedRef,
  KeyboardEvent,
  forwardRef,
  useCallback,
} from "react";

import { classNames } from "../utils/classNames";

export const CInputCore = forwardRef(function CInputCore(
  {
    placeholder,
    value = "",
    onChange,
    onFocus,
    onKeyDown,
    disabled,
    onEnter,
    autoFocus,

    type = "text",
    maxLength,
    className,
  }: {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onFocus?: () => void;
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    onEnter?: () => void;
    autoFocus?: boolean;

    type?: "text" | "password";
    maxLength?: number;
    className?: string;
  },
  ref: ForwardedRef<HTMLInputElement>,
) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) {
        return;
      }

      if (!onEnter) {
        return;
      }
      if (e.code === "Enter") {
        e.preventDefault();
        onEnter();
      }
    },
    [onEnter, onKeyDown],
  );

  return (
    <input
      ref={ref}
      type={type}
      className={classNames(
        "w-full p-3 bg-transparent placeholder:x-placeholder outline-hidden",
        "autofill:x-autofill",
        className,
      )}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={onFocus}
      disabled={disabled}
      maxLength={maxLength}
      autoFocus={autoFocus}
    />
  );
});
