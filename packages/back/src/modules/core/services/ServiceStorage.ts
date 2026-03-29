import { Logger } from "pino";

import { IEnv } from "../interfaces/IEnv";
import { IStorageAdaptor } from "../interfaces/IStorageAdaptor";
import { StorageAdaptorDisk } from "../storage-adaptors/StorageAdaptorDisk";
import { StorageAdaptorS3 } from "../storage-adaptors/StorageAdaptorS3";
import { ServiceLog } from "./ServiceLog";

export namespace ServiceStorage {
  let adaptor: IStorageAdaptor | undefined;
  let logger: Logger | undefined;

  function createAdaptor(env: IEnv) {
    if (env.STORAGE_DISK_PATH && env.STORAGE_S3_ENDPOINT) {
      throw new Error(
        "Both STORAGE_DISK_PATH and STORAGE_S3_ENDPOINT are set.",
      );
    }

    if (env.STORAGE_DISK_PATH) {
      return new StorageAdaptorDisk(env.STORAGE_DISK_PATH);
    } else if (env.STORAGE_S3_ENDPOINT) {
      if (
        !env.STORAGE_S3_REGION ||
        !env.STORAGE_S3_BUCKET ||
        !env.STORAGE_S3_ACCESS_KEY_ID ||
        !env.STORAGE_S3_SECRET_ACCESS_KEY
      ) {
        throw new Error(
          "STORAGE_S3_ENDPOINT is set but other S3 paramters are not set.",
        );
      }
      return new StorageAdaptorS3({
        endPoint: env.STORAGE_S3_ENDPOINT,
        region: env.STORAGE_S3_REGION,
        bucket: env.STORAGE_S3_BUCKET,
        accessKeyId: env.STORAGE_S3_ACCESS_KEY_ID,
        secretAccessKey: env.STORAGE_S3_SECRET_ACCESS_KEY,
      });
    } else {
      throw new Error("Please set STORAGE_DISK_PATH or STORAGE_S3_ENDPOINT");
    }
  }

  export async function init(env: IEnv) {
    logger = ServiceLog.getLogger().child({ name: "ServiceStorage" });

    adaptor = createAdaptor(env);
    await adaptor.init();
    logger.info({ adaptor: adaptor.name }, "Storage service is inited.");
  }

  export async function shutdown() {
    await adaptor?.shutdown();
    logger?.info("Storage service is shutdown.");
  }

  export function getAdaptor() {
    if (!adaptor) {
      throw new Error("Adaptor is not inited yet.");
    }
    return adaptor;
  }

  export async function recreate(env: IEnv) {
    const adaptorTemp = createAdaptor(env);
    await adaptorTemp.resetStorage();
    logger?.info({ adaptor: adaptorTemp.name }, "Storage is recreated.");
  }
}
