/**
 * @file: ApiException.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 07.11.2024
 * Last Modified Date: 07.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { EApiFailCode } from "common";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

const statusCodes: Record<EApiFailCode, ContentfulStatusCode> = {
  [EApiFailCode.BAD_REQUEST]: 400,
  [EApiFailCode.ALREADY_EXISTS]: 400,
  [EApiFailCode.RECORD_IN_USE]: 400,
  [EApiFailCode.FOREIGN_KEY_IN_USE]: 400,
  [EApiFailCode.FOREIGN_KEY_NOT_FOUND]: 400,
  [EApiFailCode.NOT_FOUND]: 404,
  [EApiFailCode.FORBIDDEN]: 403,
  [EApiFailCode.UNAUTHORIZED]: 401,
  [EApiFailCode.INTERNAL]: 500,
  [EApiFailCode.UNKNOWN]: 500,
  [EApiFailCode.PLAN_LIMIT_EXCEEDED]: 403,
  [EApiFailCode.PLAN_DISABLED_OP]: 403,
  [EApiFailCode.INVALID_TOKEN]: 400,
  [EApiFailCode.TIMEOUT]: 408,
  [EApiFailCode.MAINTENANCE]: 500,
};

export class ApiException extends HTTPException {
  constructor(code: EApiFailCode, cause?: string) {
    super(statusCodes[code] || 400, { message: code, cause });
  }
}
