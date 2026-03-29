import { UtilDate } from "common";
import { createHash } from "crypto";
import {
  access,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  unlink,
  writeFile,
} from "fs/promises";
import { dirname, join } from "path";

import { IStorageAdaptor } from "../interfaces/IStorageAdaptor";

export class StorageAdaptorDisk implements IStorageAdaptor {
  public readonly name = "disk";

  constructor(private storagePath: string) {}

  async init() {
    try {
      await access(this.storagePath);
    } catch (e) {
      void e;
      await mkdir(this.storagePath);
    }
  }

  async shutdown() {}

  async put(path: string, content: Buffer | string) {
    const filepath = dirname(join(this.storagePath, path));
    // Ensure the directory exists before writing the file.
    // If the directory does not exist, create it recursively.
    await access(filepath).catch(async () => {
      await mkdir(filepath, { recursive: true });
    });

    await writeFile(join(this.storagePath, path), content);
  }

  async get(path: string) {
    try {
      const fullPath = join(this.storagePath, path);
      const buffer = await readFile(fullPath);
      const etag = createHash("sha1").update(buffer).digest("hex");
      const fileStats = await stat(fullPath);
      return {
        buffer,
        etag,
        lastModified: UtilDate.objToIsoDatetime(fileStats.mtime),
      };
    } catch (e) {
      // TODO
      if (e instanceof Error && (e as { code?: string }).code === "ENOENT") {
        return null;
      }
      throw e;
    }
  }

  async remove(path: string) {
    await unlink(join(this.storagePath, path));
  }

  async removeDir(path: string) {
    await rm(join(this.storagePath, path), { recursive: true });
  }

  // If path does not exists do nothing
  async removeIfExists(path: string) {
    try {
      await this.remove(path);
    } catch (e) {
      if (e instanceof Error && (e as { code?: string }).code === "ENOENT") {
        return;
      }
      throw e;
    }
  }

  async resetStorage() {
    await rm(this.storagePath, { recursive: true, force: true });
    await mkdir(this.storagePath, { recursive: true });
  }

  async list(path: string) {
    const fullPath = join(this.storagePath, path);
    const files = await readdir(fullPath, {
      withFileTypes: true,
    });

    const fileStats = await Promise.all(
      files
        .filter((file) => file.isFile())
        .map(async (file) => {
          const stats = await stat(join(fullPath, file.name));
          return {
            name: file.name,
            lastModified: UtilDate.objToIsoDatetime(stats.mtime),
          };
        }),
    );

    return fileStats;
  }

  async exist(path: string) {
    try {
      await access(join(this.storagePath, path));
      return true;
    } catch (e) {
      void e;
      return false;
    }
  }
}
