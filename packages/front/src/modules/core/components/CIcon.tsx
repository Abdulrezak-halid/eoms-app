import { LucideProps } from "lucide-react";
import {
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  isValidElement,
  memo,
} from "react";

import { classNames } from "../utils/classNames";

export type IconType = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

export function CIcon({
  value: Value,
  lg,
  sm,
  className,
}: {
  value: IconType;
  lg?: boolean;
  sm?: boolean;
  className?: string;
}) {
  return (
    <Value
      className={classNames(
        "flex-none",
        lg ? "w-8 h-8" : sm ? "w-5 h-5" : "w-6 h-6",
        className,
      )}
    />
  );
}

export const CIconOrCustom = memo(function CIconOrCustom({
  value,
  className,
  sm,
}: {
  value: IconType | ReactNode;
  className?: string;
  sm?: boolean;
}) {
  if (isValidElement(value)) {
    return <div className={className}>{value}</div>;
  }

  return <CIcon className={className} value={value as IconType} sm={sm} />;
});
