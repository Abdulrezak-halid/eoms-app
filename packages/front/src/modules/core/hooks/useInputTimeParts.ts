import { useMemo } from "react";

export function useInputTimeParts(value?: string, min?: string, max?: string) {
  const valueParts = useMemo(() => {
    if (!value) {
      return undefined;
    }
    const parts = strToTimeParts(value);
    return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
  }, [value]);

  const minParts = useMemo(() => {
    if (!min) {
      return undefined;
    }
    const parts = strToTimeParts(min);
    return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
  }, [min]);

  const maxParts = useMemo(() => {
    if (!max) {
      return undefined;
    }
    const parts = strToTimeParts(max);
    return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
  }, [max]);

  return { valueParts, minParts, maxParts };
}

export function timePartsToStr(parts: number[]) {
  return parts.map((d) => d.toString().padStart(2, "0")).join(":");
}

export function strToTimeParts(value: string) {
  return value.split(":").map((d) => parseInt(d));
}
