/**
 * @file: IInboundIntegrationType.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 09.07.2025
 * Last Modified Date: 09.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
export const DataInboundIntegrationType = ["WEBHOOK", "AGENT"] as const;
export type IInboundIntegrationType =
  (typeof DataInboundIntegrationType)[number];
