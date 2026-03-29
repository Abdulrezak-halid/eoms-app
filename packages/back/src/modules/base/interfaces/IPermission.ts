/**
 * @file: IPermission.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 05.03.2025
 * Last Modified Date: 05.03.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { permissions } from "@/permissions";

export const DataPermissions = permissions;
export type IPermission = (typeof DataPermissions)[number];
