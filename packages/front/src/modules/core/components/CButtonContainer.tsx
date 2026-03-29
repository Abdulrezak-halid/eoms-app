import { PropsWithChildren } from "react";

import { classNames } from "@m/core/utils/classNames";

const buttonColorSet = {
  default: {
    primary:
      "bg-accent-600 text-accent-50 dark:bg-accent-400 dark:text-accent-950 hover:bg-accent-500 dark:hover:bg-accent-300",
    secondary:
      "bg-accent-50 text-accent-700 dark:bg-accent-900 dark:text-accent-200 hover:bg-white dark:hover:bg-accent-800",
    tertiary:
      "text-accent-700 dark:text-accent-200 hover:bg-gray-200 dark:hover:bg-gray-700",
  },
  red: {
    primary:
      "bg-rose-600 text-rose-50 dark:bg-rose-400 dark:text-rose-950 hover:bg-rose-500 dark:hover:bg-rose-300",
    secondary:
      "bg-rose-50 text-rose-700 dark:bg-rose-900 dark:text-rose-200 hover:bg-white dark:hover:bg-rose-800",
    tertiary:
      "text-rose-700 dark:text-rose-200 hover:bg-gray-200 dark:hover:bg-gray-700",
  },
  orange: {
    primary:
      "bg-amber-600 text-amber-50 dark:bg-amber-400 dark:text-amber-950 hover:bg-amber-500 dark:hover:bg-amber-300",
    secondary:
      "bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-200 hover:bg-white dark:hover:bg-amber-800",
    tertiary:
      "text-amber-700 dark:text-amber-200 hover:bg-gray-200 dark:hover:bg-gray-700",
  },
  blue: {
    primary:
      "bg-sky-600 text-sky-50 dark:bg-sky-400 dark:text-sky-950 hover:bg-sky-500 dark:hover:bg-sky-300",
    secondary:
      "bg-sky-50 text-sky-700 dark:bg-sky-900 dark:text-sky-200 hover:bg-white dark:hover:bg-sky-800",
    tertiary:
      "text-sky-700 dark:text-sky-200 hover:bg-gray-200 dark:hover:bg-gray-700",
  },
};

export type IButtonColor = keyof typeof buttonColorSet;

export function CButtonContainer({
  primary,
  tertiary,
  children,
  className,
  color = "default",
  forceDisabled,
}: PropsWithChildren<{
  primary?: boolean;
  tertiary?: boolean;
  className?: string;
  color?: IButtonColor;
  forceDisabled?: boolean;
}>) {
  const colorSubKey = forceDisabled
    ? "tertiary"
    : primary
      ? "primary"
      : tertiary
        ? "tertiary"
        : "secondary";

  return (
    <div
      className={classNames(
        "rounded-md overflow-hidden",
        "group-focus:x-outline",
        // pointer-events-none is to disable hover effects
        "group-disabled:opacity-40 group-disabled:bg-transparent group-disabled:text-accent-700 dark:group-disabled:text-accent-200 group-disabled:shadow-none group-disabled:pointer-events-none",
        buttonColorSet[color][colorSubKey],
        !tertiary && !forceDisabled && "shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
