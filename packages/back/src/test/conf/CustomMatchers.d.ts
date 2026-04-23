import { EApiFailCode } from "common";
import "vitest";

interface CustomMatchers<R = unknown> {
  toBeApiOk: () => R;
  toBeApiError: (code: EApiFailCode) => R;
}

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Assertion<T> extends CustomMatchers<T> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
