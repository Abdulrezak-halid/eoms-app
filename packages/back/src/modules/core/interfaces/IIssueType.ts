/**
 * @file: IIssueType.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 07.02.2025
 * Last Modified Date: 07.02.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */

export const DataIssueType = ["BUG_REPORT", "FEATURE_REQUEST"] as const;

export type IIssueType = (typeof DataIssueType)[number];
