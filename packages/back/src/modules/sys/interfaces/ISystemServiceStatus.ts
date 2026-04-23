/**
 * @file: ISystemServiceStatus.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.11.2025
 * Last Modified Date: 06.11.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */

export const DataSystemServiceStatus = [
  "NOT_INITED",
  "CONNECTING",
  "CONNECTED",
  "CLOSED",
] as const;
export type ISystemServiceStatus = (typeof DataSystemServiceStatus)[number];
