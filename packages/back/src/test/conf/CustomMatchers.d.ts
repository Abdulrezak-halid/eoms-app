/**
 * @file: CustomMatchers.d.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 09.01.2025
 * Last Modified Date: 09.01.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
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
