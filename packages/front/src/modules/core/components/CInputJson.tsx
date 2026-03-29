import { JsonEditor, githubDarkTheme } from "json-edit-react";
import { useContext, useMemo } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";

import { ContextTheme } from "../contexts/ContextTheme";
import { classNames } from "../utils/classNames";
import { CIcon } from "./CIcon";
import { CInputContainer } from "./CInputContainer";

export function CInputJson({
  value,
  onChange,
  disabled,
}: {
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
}) {
  const { dark } = useContext(ContextTheme);

  const theme = useMemo(
    () => (dark ? [githubDarkTheme, { input: { color: "white" } }] : undefined),
    [dark],
  );

  const icons = useMemo(
    () => ({
      add: (
        <CIcon
          className="text-accent-700 dark:text-accent-500 hover:text-accent-600 dark:hover:text-accent-400"
          value={Plus}
        />
      ),
      edit: (
        <CIcon
          className="text-accent-700 dark:text-accent-500 hover:text-accent-600 dark:hover:text-accent-400"
          value={Pencil}
        />
      ),
      delete: (
        <CIcon
          className="text-accent-700 dark:text-accent-500 hover:text-accent-600 dark:hover:text-accent-400"
          value={Trash2}
        />
      ),
      ok: (
        <CIcon
          className="text-accent-700 dark:text-accent-500 hover:text-accent-600 dark:hover:text-accent-400"
          value={Check}
        />
      ),
      cancel: (
        <CIcon
          className="text-rose-700 dark:text-rose-500 hover:text-accent-600 dark:hover:text-accent-400"
          value={X}
        />
      ),
      // chevron: <YourIcon />
      // copy: <YourIcon />
    }),
    [],
  );

  return (
    <CInputContainer disabled={disabled}>
      <JsonEditor
        data={value}
        setData={onChange}
        className={classNames(
          "group-disabled:pointer-events-none z-0 bg-transparent!",
          disabled && "pointer-events-none",
        )}
        enableClipboard={false}
        theme={theme}
        icons={icons}
      />
    </CInputContainer>
  );
}
