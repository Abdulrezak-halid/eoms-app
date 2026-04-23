import { classNames } from "../utils/classNames";

export function CHr({ className }: { className?: string }) {
  return (
    <div
      className={classNames(
        "border-b border-gray-300 dark:border-gray-600",
        className,
      )}
    />
  );
}
