
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
