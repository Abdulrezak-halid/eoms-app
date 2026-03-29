import {
  IDtoEMetricIntegrationPeriod,
  IDtoETranslationKeys,
} from "common/build-api-schema";

export function getIntegrationPeriodTranslationKey(
  integrationPeriod: IDtoEMetricIntegrationPeriod,
): IDtoETranslationKeys {
  switch (integrationPeriod) {
    case "MINUTELY":
      return "minutely";
    case "MINUTELY_5":
      return "fiveMinutely";
    case "MINUTELY_15":
      return "fifteenMinutely";
    case "HOURLY":
      return "hourly";
    case "DAILY":
      return "daily";
    case "MONTHLY":
      return "monthly";
  }
}
