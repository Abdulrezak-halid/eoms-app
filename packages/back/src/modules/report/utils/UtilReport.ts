import { EApiFailCode, IUnitGroup, UtilDate, UtilUnit } from "common";

import { ApiException } from "@m/core/exceptions/ApiException";
import { II18n } from "@m/core/interfaces/II18n";

import { IReportSection } from "../interfaces/IReportSection";

export namespace UtilReport {
  export function convertDateRangeToDatetimeRange(
    dateStart: string,
    dateEnd: string,
  ) {
    const configDatetimeEnd = new Date(dateEnd);
    configDatetimeEnd.setUTCHours(23, 59);

    return {
      datetimeStart: UtilDate.localIsoDateToIsoDatetime(dateStart),
      datetimeEnd: UtilDate.objToIsoDatetime(configDatetimeEnd),
    };
  }

  export function calculateSectionNumber(
    sections: IReportSection[],
    currentIndex: number,
  ): string {
    const counters: number[] = [];

    for (let i = 0; i <= currentIndex; i++) {
      const section = sections[i];
      const depth = section.depth || 0;

      if (depth > counters.length) {
        throw new ApiException(
          EApiFailCode.BAD_REQUEST,
          "Parent Depth is missing.",
        );
      }

      while (counters.length <= depth) {
        counters.push(0);
      }

      if (counters.length > depth + 1) {
        counters.length = depth + 1;
      }

      counters[depth]++;
    }

    return counters.join(".") + ".";
  }

  export function getUnitInfo({ t }: II18n, unitGroup: IUnitGroup) {
    const defaultUnit = UtilUnit.getDefault(unitGroup);
    return {
      abbr: UtilUnit.getAbbreviation(defaultUnit, t),
      multiplier: 1 / UtilUnit.getBaseMultiplier(defaultUnit),
      defaultUnit,
    };
  }
}
