import { classNames } from "@m/core/utils/classNames";

export function CCardTitle({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "font-bold overflow-hidden text-nowrap text-ellipsis text-gray-600 dark:text-gray-300",
        className,
      )}
    >
      {value}
    </div>
  );
}
