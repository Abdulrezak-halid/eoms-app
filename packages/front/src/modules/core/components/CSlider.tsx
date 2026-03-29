/**
 * @file: CSlider.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 30.10.2024
 * Last Modified Date: 30.10.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useEffect, useMemo, useRef } from "react";

export function CSlider({
  value = 0,
  min = 0,
  max = 10,
  step = 1,
  onChange,
  disabled,
}: {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const refButton = useRef<HTMLButtonElement>(null);

  const range = max - min;
  const steps = range / step;

  useEffect(() => {
    if (!refButton.current) {
      return;
    }

    const cbMove = (e: MouseEvent) => {
      if (!ref.current) {
        return;
      }
      const boundary = ref.current.getBoundingClientRect();
      onChange?.(
        Math.round(
          Math.max(
            0,
            Math.min(1, (e.clientX - boundary.left) / boundary.width),
          ) * steps,
        ) *
          step +
          min,
      );
    };
    const cbFinish = (e: MouseEvent) => {
      window.removeEventListener("mousemove", cbMove);
      window.removeEventListener("mouseup", cbFinish);
      cbMove(e);
    };
    refButton.current.onmousedown = () => {
      window.addEventListener("mousemove", cbMove);
      window.addEventListener("mouseup", cbFinish);
    };
    return () => {
      window.removeEventListener("mousemove", cbMove);
      window.removeEventListener("mouseup", cbFinish);
    };
  }, [onChange, min, step, steps]);

  const segments = useMemo(
    () =>
      new Array(steps + 1).fill(null).map((_, i) => ({
        // edge: i === 0 || i === steps,
        rate: i / steps,
      })),
    [steps],
  );

  return (
    <button
      type="button"
      className="h-12 w-full relative flex items-center outline-hidden group disabled:opacity-40"
      ref={refButton}
      disabled={disabled}
    >
      <div className="w-full h-4 bg-gray-100 dark:bg-gray-800 absolute rounded-full" />

      <div ref={ref} className="flex items-center relative mx-3 w-full">
        {segments.map((d, i) => (
          <div
            key={i}
            className="absolute w-0 h-2"
            style={{ left: `${d.rate * 100}%` }}
          >
            <div className="h-full bg-gray-300 dark:bg-gray-600 -ml-1 w-2 rounded-full" />
          </div>
        ))}

        <div
          className="absolute w-0 h-0"
          style={{
            left: `${Math.max(0, Math.min(1, (value - min) / range)) * 100}%`,
          }}
        >
          <div className="-mt-3 -ml-3 w-6 h-6 bg-gray-500 dark:bg-gray-300 rounded-full group-focus:outline-solid group-focus:outline-2 group-focus:outline-gray-600 dark:group-focus:outline-gray-300" />
        </div>
      </div>
    </button>
  );
}
