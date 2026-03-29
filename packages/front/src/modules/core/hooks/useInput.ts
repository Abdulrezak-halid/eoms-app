import { useEffect, useState } from "react";

type UseInputContext<T> = {
  value: T;
  onChange: (value: T) => void;
  setValue: (value: T) => void;
  invalidMsg: string;
  onInvalidMsg: (value: string) => void;
  // invalid: boolean;
  busy: boolean;
  onBusyChange: (value: boolean) => void;
};

export function useInput<T = undefined>(): UseInputContext<T | undefined>;
export function useInput<T>(initialValue: T): UseInputContext<T>;

export function useInput(initialValue?: unknown): UseInputContext<unknown> {
  const [value, setValue] = useState(initialValue);
  const [invalidMsg, onInvalidMsg] = useState("");
  const [busy, setBusy] = useState(false);

  // It is to make input busy initially
  const [busyInternal, setBusyInternal] = useState(true);
  useEffect(() => {
    setBusyInternal(false);
  }, []);

  return {
    value,
    onChange: setValue,
    setValue,
    invalidMsg,
    onInvalidMsg,
    // invalid: Boolean(invalidMsg),
    busy: busy || busyInternal,
    onBusyChange: setBusy,
  };
}
export function useInputInvalid(
  ...props: { invalidMsg: string; busy: boolean }[]
) {
  const [value, setValue] = useState(true);
  useEffect(() => {
    setValue(Boolean(props.find((d) => d.invalidMsg || d.busy)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, props);
  return value;
}
