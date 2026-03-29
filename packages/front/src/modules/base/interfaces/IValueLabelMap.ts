/**
 * @file: IValueLabelMap.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 11.07.2025
 * Last Modified Date: 11.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IconType } from "@m/core/components/CIcon";

export type IValueLabelMap<TKey extends string> = Record<
  TKey,
  { label: string; icon?: IconType; imageSrc?: string }
>;
