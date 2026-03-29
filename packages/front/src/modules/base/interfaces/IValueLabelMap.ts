import { IconType } from "@m/core/components/CIcon";

export type IValueLabelMap<TKey extends string> = Record<
  TKey,
  { label: string; icon?: IconType; imageSrc?: string }
>;
