import { Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useTranslation } from "@m/core/hooks/useTranslation";

import { classNames } from "../utils/classNames";
import { CIcon, IconType } from "./CIcon";
import { CInputContainer } from "./CInputContainer";
import { CInputCore } from "./CInputCore";

export function CInputNumber({
  icon,
  placeholder,
  value,
  onChange,
  onInvalidMsg,
  disabled,
  invalid,
  required,
  step = 1,
  float,
  className,
  min,
  max,
}: {
  icon?: IconType;
  placeholder?: string;
  value?: number;
  onChange?: (value: number | undefined) => void;
  onInvalidMsg?: (msg: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  step?: number;
  float?: boolean;
  className?: string;
  min?: number;
  max?: number;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const [valueInternal, setValueInternal] = useState(value?.toString() || "");

  useEffect(() => {
    setValueInternal(value?.toString() || "");
  }, [value]);

  const handleChange = useCallback(
    (vStr: string) => {
      if (vStr === "") {
        setValueInternal("");
        onChange?.(undefined);
        return;
      }

      // Helps typing 1. and 1.000 and negative numbers like -1. and -1.000
      if (float) {
        if (!vStr.match(/^-?(\d+\.)?\d*$/)) {
          return;
        }
        setValueInternal(vStr);

        // Don't parse incomplete inputs like "-", "-.", "."
        if (vStr === "-" || vStr === "-." || vStr === ".") {
          return;
        }
      }
      // On firefox non numeric input is parsed as NaN
      else {
        if (!vStr.match(/^-?\d*$/)) {
          return;
        }

        // Don't parse incomplete negative number
        if (vStr === "-") {
          setValueInternal(vStr);
          return;
        }
      }

      const vNum = float ? parseFloat(vStr) : parseInt(vStr);
      onChange?.(vNum);
    },
    [onChange, float],
  );

  const incValue = useCallback(
    (inc: number) => {
      const v = parseFloat(((value || 0) + inc).toFixed(3));
      if (inc < 0 && min !== undefined && v < min) {
        return;
      }
      if (inc > 0 && max !== undefined && v > max) {
        return;
      }
      onChange?.(v);
    },
    [onChange, value, min, max],
  );

  const [autoStep, setAutoStep] = useState(0);

  const handleStepUp = useCallback(() => {
    setAutoStep(step);
    incValue(step);
  }, [incValue, step]);
  const handleStepDown = useCallback(() => {
    setAutoStep(-step);
    incValue(-step);
  }, [incValue, step]);
  const handleMouseUp = useCallback(() => {
    setAutoStep(0);
    ref.current?.focus();
  }, []);
  const handleMouseOut = useCallback(() => {
    setAutoStep(0);
  }, []);

  useEffect(() => {
    if (!autoStep) {
      return;
    }
    const timer = setTimeout(() => {
      incValue(autoStep);
    }, 200);
    return () => {
      clearTimeout(timer);
    };
  }, [autoStep, incValue]);

  const invalidRequired = required && value === undefined;
  const invalidMin = min !== undefined && value !== undefined && value < min;
  const invalidMax = max !== undefined && value !== undefined && value > max;
  const invalidNextMin =
    min !== undefined && value !== undefined && value - step < min;
  const invalidNextMax =
    max !== undefined && value !== undefined && value + step > max;

  const { t } = useTranslation();
  const invalidMsg = useMemo(() => {
    if (disabled) {
      return "";
    }

    if (invalidRequired) {
      return t("required");
    }
    if (invalidMin) {
      return t("invalidNumberMin", { value: min });
    }
    if (invalidMax) {
      return t("invalidNumberMax", { value: max });
    }
    return "";
  }, [invalidRequired, invalidMin, invalidMax, min, max, t, disabled]);

  const invalidFinal = invalid || Boolean(invalidMsg);

  useEffect(() => {
    onInvalidMsg?.(invalidMsg);
  }, [onInvalidMsg, invalidMsg]);

  return (
    <CInputContainer
      className={classNames("flex", className)}
      disabled={disabled}
      invalid={invalidFinal}
      icon={icon}
    >
      <CInputCore
        ref={ref}
        placeholder={placeholder}
        value={valueInternal}
        onChange={handleChange}
        disabled={disabled}
        className={icon && "pl-12"}
      />

      <div
        className={classNames(
          "self-stretch flex-none w-12 flex flex-col group-disabled:bg-opacity-40",
          disabled && "bg-opacity-40",
        )}
      >
        <button
          type="button"
          className="h-1/2 outline-hidden text-accent-700 dark:text-accent-200 disabled:opacity-30"
          onMouseDown={handleStepUp}
          onMouseUp={handleMouseUp}
          onMouseOut={handleMouseOut}
          disabled={disabled || invalidNextMax}
          tabIndex={-1}
        >
          <CIcon value={Plus} className="w-12!" sm />
        </button>

        <button
          type="button"
          className="h-1/2 outline-hidden text-accent-700 dark:text-accent-200 disabled:opacity-30"
          onMouseDown={handleStepDown}
          onMouseUp={handleMouseUp}
          onMouseOut={handleMouseOut}
          disabled={disabled || invalidNextMin}
          tabIndex={-1}
        >
          <CIcon value={Minus} className="w-12!" sm />
        </button>
      </div>
    </CInputContainer>
  );
}
