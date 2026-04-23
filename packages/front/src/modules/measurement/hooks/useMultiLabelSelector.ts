import { useCallback, useEffect, useMemo, useState } from "react";

import { Api } from "@m/base/api/Api";
import { ISelectListItem } from "@m/core/components/CSelectList";
import { useAsyncDataPending } from "@m/core/hooks/useAsyncDataPending";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { TranslationFunc, useTranslation } from "@m/core/hooks/useTranslation";

import { ICLabelSelectorValue } from "../interfaces/IMultiLabelSelector";
import { renderMetricResourceLabel } from "../utils/renderMetricResourceLabel";

export interface IUseMultiLabelSelectorParams {
  value?: ICLabelSelectorValue[];
  onChange?: (value: ICLabelSelectorValue[]) => void;
  metricId?: string;
  onInvalidMsg?: (msg: string) => void;
  onBusyChange?: (value: boolean) => void;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
}

function normalizeInternalLabel(
  value: ICLabelSelectorValue,
): ICLabelSelectorValue {
  return value;
}

function normalizeUserDefinedLabel(value: {
  key: string;
  value: string;
}): ICLabelSelectorValue {
  return {
    type: "USER_DEFINED",
    key: value.key.trim(),
    value: value.value.trim(),
  };
}

function normalizeLabel(value: ICLabelSelectorValue): ICLabelSelectorValue {
  if (value.type === "INTERNAL") {
    return normalizeInternalLabel(value);
  }

  return normalizeUserDefinedLabel(value);
}

function serializeLabel(value: ICLabelSelectorValue): string {
  return JSON.stringify(value);
}

function labelIdentity(value: ICLabelSelectorValue): string {
  return `${value.key.trim().toUpperCase()}\u0000${value.value.trim().toUpperCase()}`;
}

function toListItem(
  value: ICLabelSelectorValue,
  t: TranslationFunc,
): ISelectListItem<string> {
  return {
    label: renderMetricResourceLabel(t, value) || `${value.key}:${value.value}`,
    value: serializeLabel(value),
  };
}

function uniqueLabels(values: ICLabelSelectorValue[]): ICLabelSelectorValue[] {
  const map = new Map<string, ICLabelSelectorValue>();

  values.forEach((value) => {
    const normalized = normalizeLabel(value);
    if (!normalized.key.trim() || !normalized.value.trim()) {
      return;
    }
    map.set(labelIdentity(normalized), normalized);
  });

  return [...map.values()];
}

export function useMultiLabelSelector({
  value,
  onChange,
  metricId,
  onInvalidMsg,
  onBusyChange,
  disabled,
  invalid,
  required,
}: IUseMultiLabelSelectorParams) {
  const { t } = useTranslation();
  const [nextKey, setNextKey] = useState("");
  const [nextValue, setNextValue] = useState("");
  const [invalidInternal, setInvalidInternal] = useState(false);

  const loader = useCallback(async () => {
    return await Api.GET("/u/measurement/metric/labels", {
      params: {
        query: {
          metricId,
        },
      },
    });
  }, [metricId]);

  const [data] = useLoader(loader);
  useAsyncDataPending(data, onBusyChange);

  const middleware = useCallback(
    (payload: ICLabelSelectorValue[] | { labels: ICLabelSelectorValue[] }) => {
      const labels = Array.isArray(payload)
        ? payload
        : "labels" in payload
          ? payload.labels
          : [];

      const normalizedLabels = uniqueLabels(labels);
      const keys = new Map<string, string>();

      normalizedLabels.forEach((label) => {
        const trimmedKey = label.key.trim();
        if (!trimmedKey) {
          return;
        }
        const normalizedKey =
          label.type === "INTERNAL" ? trimmedKey.toUpperCase() : trimmedKey;
        const dedupeKey = normalizedKey.toLocaleLowerCase();
        const existing = keys.get(dedupeKey);
        if (!existing || normalizedKey === normalizedKey.toUpperCase()) {
          keys.set(dedupeKey, normalizedKey);
        }
      });

      return {
        labels: normalizedLabels,
        keys: [...keys.values()].sort((a, b) => a.localeCompare(b)),
      };
    },
    [],
  );

  const dataMapped = useLoaderMiddleware(data, middleware);

  const selectedLabels = useMemo(() => uniqueLabels(value || []), [value]);

  const selectedSerialized = useMemo(
    () => selectedLabels.map((label) => serializeLabel(label)),
    [selectedLabels],
  );

  const list = useMemo(() => {
    const fromServer = dataMapped.payload?.labels || [];
    return uniqueLabels([...fromServer, ...selectedLabels]).map((label) =>
      toListItem(label, t),
    );
  }, [dataMapped.payload?.labels, selectedLabels, t]);

  const keyOptions = useMemo(
    () => dataMapped.payload?.keys || [],
    [dataMapped],
  );

  const hasPendingCustomInput =
    Boolean(nextKey.trim()) || Boolean(nextValue.trim());
  const hasDuplicateSelected =
    value !== undefined && uniqueLabels(value).length !== value.length;

  useEffect(() => {
    if (disabled) {
      onInvalidMsg?.("");
      setInvalidInternal(false);
      return;
    }

    if (required && selectedLabels.length === 0) {
      onInvalidMsg?.(t("required"));
      setInvalidInternal(true);
      return;
    }

    if (hasPendingCustomInput && (!nextKey.trim() || !nextValue.trim())) {
      onInvalidMsg?.(t("required"));
      setInvalidInternal(true);
      return;
    }

    if (hasDuplicateSelected) {
      onInvalidMsg?.(t("invalidDuplicatedItems"));
      setInvalidInternal(true);
      return;
    }

    onInvalidMsg?.("");
    setInvalidInternal(false);
  }, [
    disabled,
    hasDuplicateSelected,
    hasPendingCustomInput,
    nextKey,
    nextValue,
    onInvalidMsg,
    required,
    selectedLabels.length,
    t,
  ]);

  const handleSelectChange = useCallback(
    (labelsSerialized: string[]) => {
      const nextLabels = labelsSerialized
        .map((item) => {
          try {
            return normalizeLabel(JSON.parse(item) as ICLabelSelectorValue);
          } catch {
            return undefined;
          }
        })
        .filter((item): item is ICLabelSelectorValue => Boolean(item));
      onChange?.(nextLabels);
    },
    [onChange],
  );

  const handleAdd = useCallback(() => {
    const label = normalizeUserDefinedLabel({
      key: nextKey,
      value: nextValue,
    });

    if (!label.key || !label.value) {
      return;
    }

    if (
      selectedLabels.some(
        (item) => labelIdentity(item) === labelIdentity(label),
      )
    ) {
      setNextValue("");
      return;
    }

    onChange?.([...selectedLabels, label]);
    setNextKey("");
    setNextValue("");
  }, [nextKey, nextValue, onChange, selectedLabels]);

  const canAdd =
    !disabled &&
    Boolean(nextKey.trim()) &&
    Boolean(nextValue.trim()) &&
    !selectedLabels.some(
      (item) =>
        labelIdentity(item) ===
        labelIdentity(
          normalizeUserDefinedLabel({
            key: nextKey,
            value: nextValue,
          }),
        ),
    );

  return {
    invalidFinal: invalid || invalidInternal,
    list,
    keyOptions,
    nextKey,
    nextValue,
    setNextKey,
    setNextValue,
    selectedSerialized,
    handleSelectChange,
    handleAdd,
    canAdd,
  } as const;
}
