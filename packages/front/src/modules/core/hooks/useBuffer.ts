/**
 * @file: useBuffer.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 01.11.2024
 * Last Modified Date: 01.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
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
