import { classNames } from "@m/core/utils/classNames";

export function CSpinner({
  lg,
  className,
}: {
  lg?: boolean;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        className,
        "flex-none rounded-full border-current border-b-transparent! animate-spin",
        lg ? "border-4 w-12 h-12" : "border-3 w-6 h-6",
      )}
    />
  );
}
