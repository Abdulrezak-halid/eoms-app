import { PropsWithChildren } from "react";
import { Link } from "wouter";

import { classNames } from "@m/core/utils/classNames";

import { IRoutePath } from "../interfaces/IRoutePath";

export function CLinkCore({
  title,
  path,
  disabled,
  className,
  children,
  targetNewTab,
}: PropsWithChildren<{
  title?: string;
  path?: IRoutePath;
  className?: string;
  disabled?: boolean;
  targetNewTab?: boolean;
}>) {
  const disabledFinal = disabled || !path;

  const props = {
    className: classNames(
      "group outline-hidden inline-block",
      disabled && "opacity-40 pointer-events-none",
      className,
    ),
    href: path || "",
    tabIndex: disabledFinal ? -1 : undefined,
    title,
  };

  if (targetNewTab) {
    return (
      <a {...props} target={targetNewTab ? "_blank" : undefined}>
        {children}
      </a>
    );
  }

  return <Link {...props}>{children}</Link>;
}
