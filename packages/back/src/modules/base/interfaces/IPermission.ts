import { permissions } from "@/permissions";

export const DataPermissions = permissions;
export type IPermission = (typeof DataPermissions)[number];
