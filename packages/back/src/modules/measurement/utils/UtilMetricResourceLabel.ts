/**
 * @file: UtilMetricResourceLabel.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 25.12.2025
 * Last Modified Date: 25.12.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { EApiFailCode } from "common";
import xxhash from "xxhash-wasm";

import { ApiException } from "@m/core/exceptions/ApiException";

import { IMetricResourceLabel } from "../interfaces/IMetricResourceLabel";

const DEFAULT_HASH_SEED = 0n;

export namespace UtilMetricResourceLabel {
  export function canonicalize(labels: IMetricResourceLabel[]): string {
    if (labels.length === 0) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "Metric resource labels should have at least one key.",
      );
    }

    const set = new Set(labels.map((d) => `${d.type}.${d.key}`));

    if (set.size !== labels.length) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "Metric resource labels should have unique keys.",
      );
    }

    return labels
      .map((label) => `${label.type}.${label.key}=${label.value}`)
      .join(",");
  }

  export async function hash(labels: IMetricResourceLabel[]): Promise<bigint> {
    if (labels.length === 0) {
      return 0n;
    }

    const canonical = canonicalize(labels);
    const { h64 } = await xxhash();
    // Negative part is to shift value to unsigned to signed
    return h64(canonical, DEFAULT_HASH_SEED) - 9223372036854775808n;
  }
}
