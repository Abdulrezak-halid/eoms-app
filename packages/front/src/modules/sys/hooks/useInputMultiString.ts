import { useState } from "react";

export function useInputMultiString(initialValue?: string[]) {
  const [value, setValue] = useState<string[]>(initialValue || []);
  const [invalidMsg, setInvalidMsg] = useState("");

  return {
    value,
    onChange: setValue,
    invalidMsg,
    onInvalidMsg: setInvalidMsg,
  };
}
