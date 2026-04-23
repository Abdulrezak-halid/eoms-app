import {
  IDateQuickRange,
  getDateRangeFromQuickRange,
} from "@m/base/hooks/useQuickDateRanges";
import {
  IDatetimeQuickRange,
  getDatetimeRangeFromQuickRange,
} from "@m/base/hooks/useQuickTimeRanges";
import { tolgee } from "@m/core/utils/tolgee";

export type IQuickDatetimeRangeValue = {
  quickRange?: IDatetimeQuickRange;
  customMin?: string;
  customMax?: string;
};

export type IQuickDatetimeRangeResult = {
  datetimeMin?: string;
  datetimeMax?: string;
  invalidMsg?: string;
};

export type IQuickDateRangeValue = {
  quickRange?: IDateQuickRange;
  customMin?: string;
  customMax?: string;
};

export type IQuickDateRangeResult = {
  dateMin?: string;
  dateMax?: string;
  invalidMsg?: string;
};

export function quickRangeToDatetimeRange(
  value?: IQuickDatetimeRangeValue,
  props?: {
    required?: boolean;
    invalidMsg?: string;
  },
): IQuickDatetimeRangeResult {
  if (value?.quickRange) {
    const range = getDatetimeRangeFromQuickRange(value.quickRange);
    return {
      datetimeMin: range.datetimeMin,
      datetimeMax: range.datetimeMax,
      invalidMsg: undefined,
    };
  }

  if (value?.customMin && value.customMax) {
    return {
      datetimeMin: value.customMin,
      datetimeMax: value.customMax,
      invalidMsg: undefined,
    };
  }

  if (props?.required === false) {
    return {
      invalidMsg: undefined,
    };
  }

  return {
    invalidMsg: props?.invalidMsg || tolgee.t("required", { noWrap: true }),
  };
}

export function quickRangeToDateRange(
  value?: IQuickDateRangeValue,
  props?: {
    required?: boolean;
    invalidMsg?: string;
  },
): IQuickDateRangeResult {
  if (value?.quickRange) {
    const range = getDateRangeFromQuickRange(value.quickRange);
    return {
      dateMin: range.dateMin,
      dateMax: range.dateMax,
      invalidMsg: undefined,
    };
  }

  if (value?.customMin && value.customMax) {
    return {
      dateMin: value.customMin,
      dateMax: value.customMax,
      invalidMsg: undefined,
    };
  }

  if (props?.required === false) {
    return {
      invalidMsg: undefined,
    };
  }

  return {
    invalidMsg: props?.invalidMsg || tolgee.t("required", { noWrap: true }),
  };
}

export function datetimeRangeToQuickRange(
  datetimeMin?: string,
  datetimeMax?: string,
): IQuickDatetimeRangeValue | undefined {
  if (!datetimeMin || !datetimeMax) {
    return undefined;
  }

  return {
    customMin: datetimeMin,
    customMax: datetimeMax,
  };
}
