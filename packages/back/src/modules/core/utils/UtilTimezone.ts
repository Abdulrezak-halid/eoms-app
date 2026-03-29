import { EApiFailCode, UtilDate } from "common";

import { ApiException } from "@m/core/exceptions/ApiException";

export namespace UtilTimezone {
  export function getTimezoneOffset(zone: string): number {
    try {
      return UtilDate.getTimezoneOffset(zone);
    } catch (e) {
      void e;
      throw new ApiException(EApiFailCode.BAD_REQUEST, "Invalid timezone.");
    }
  }
}
