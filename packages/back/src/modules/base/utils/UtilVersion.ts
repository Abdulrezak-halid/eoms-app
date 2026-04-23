/**
 * @file: UtilVersion.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 02.10.2025
 * Last Modified Date: 02.10.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */

export namespace UtilVersion {
  export function checkVersion(
    major: number, // Exact major
    minor: number, // Minimum minor
    strVersionToCheck: string,
  ) {
    const versionParts = strVersionToCheck.split(".");
    const versionMajor = parseInt(versionParts[0]);
    const versionMinor = parseInt(versionParts[1]);
    if (versionMajor !== major || versionMinor < minor) {
      throw new Error(`Unsupported version. (${strVersionToCheck})`);
    }
  }
}
