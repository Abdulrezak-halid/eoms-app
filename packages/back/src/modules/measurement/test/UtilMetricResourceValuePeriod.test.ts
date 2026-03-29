import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilMetricResourceValuePeriod } from "../utils/UtilMetricResourceValuePeriod";

describe("UtilMetricResourceValuePeriod", () => {
  it("must return MINUTELY", () => {
    const period = UtilMetricResourceValuePeriod.detectPeriod(
      "2025-01-01T00:00:00Z",
      "2025-01-01T05:59:00Z",
    );
    expect(period).toStrictEqual("MINUTELY");
  });

  it("must return HOURLY", () => {
    const period = UtilMetricResourceValuePeriod.detectPeriod(
      "2025-01-01T00:00:00Z",
      "2025-01-02T12:00:00Z",
    );
    expect(period).toStrictEqual("HOURLY");
  });

  it("must return MONTHLY", () => {
    const period = UtilMetricResourceValuePeriod.detectPeriod(
      "2025-01-01T00:00:00Z",
      "2026-01-02T12:00:00Z",
    );
    expect(period).toStrictEqual("MONTHLY");
  });

  it("must return DAILY", () => {
    const period = UtilMetricResourceValuePeriod.detectPeriod(
      "2025-01-01T00:00:00Z",
      "2025-04-02T12:00:00Z",
    );
    expect(period).toStrictEqual("DAILY");
  });

  it("must return BAD_REQUEST when start date is greater than end date", () => {
    expect(() =>
      UtilMetricResourceValuePeriod.detectPeriod(
        "2025-01-02T00:00:00Z",
        "2025-01-01T00:00:00Z",
      ),
    ).throws(EApiFailCode.BAD_REQUEST);
  });
});
