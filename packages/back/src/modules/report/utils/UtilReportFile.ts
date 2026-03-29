import { IStoragePath } from "@m/core/interfaces/IStoragePath";

export namespace UtilReportFile {
  export function generateReportFileDirPath(orgId: string) {
    return `/org-data/${orgId}/report/attachments/` as IStoragePath;
  }
  export function generateReportFilePath(orgId: string, id: string) {
    return `${generateReportFileDirPath(orgId)}${id}.pdf` as IStoragePath;
  }
}
