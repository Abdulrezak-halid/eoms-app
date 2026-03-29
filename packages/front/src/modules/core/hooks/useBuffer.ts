import { useEffect, useState } from "react";

export function useBuffer<T>(value: T) {
  const [buf, setBuf] = useState(value);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (buf === value) {
      setPending(false);
      return;
    }

    setPending(true);
    const timer = setTimeout(() => {
      setBuf(value);
      setPending(false);
    }, 200);
    return () => {
      clearTimeout(timer);
    };
  }, [value, buf]);

  return [buf, pending, setBuf] as const;
}
