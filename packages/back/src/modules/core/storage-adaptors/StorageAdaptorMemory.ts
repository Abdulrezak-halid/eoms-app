import { UtilDate } from "common";
import { createHash } from "node:crypto";

import { IFileContent, IStorageAdaptor } from "../interfaces/IStorageAdaptor";

export class StorageAdaptorMemory implements IStorageAdaptor {
  public readonly name = "memory";

  private map: Record<string, IFileContent> = {};

  init() {}
  shutdown() {}

  put(path: string, content: Buffer | string, contentType?: string) {
    const buffer = typeof content === "string" ? Buffer.from(content) : content;
    const etag = createHash("sha1").update(buffer).digest("hex");
    this.map[path] = {
      buffer,
      contentType,
      lastModified: UtilDate.getNowIsoDatetime(),
      etag,
    };
  }

  get(path: string): IFileContent | null {
    return this.map[path] || null;
  }

  remove(path: string) {
    if (this.map[path] === undefined) {
      throw new Error("There is no path");
    }
    delete this.map[path];
  }

  removeDir(path: string) {
    const keys = Object.keys(this.map);
    const matchingKeys = keys.some((key) => key.startsWith(path));
    if (!matchingKeys) {
      throw new Error("There is no path");
    }
    for (const key of keys) {
      if (key.startsWith(path)) {
        delete this.map[key];
      }
    }
  }

  // If path does not exists do nothing
  removeIfExists(path: string) {
    delete this.map[path];
  }

  resetStorage() {
    this.map = {};
  }

  list(path: string) {
    const normalizedPath = path.endsWith("/") ? path : path + "/";

    return Object.entries(this.map)
      .filter(([key]) => key.startsWith(normalizedPath))
      .map(([key, value]) => {
        const name = key.slice(normalizedPath.length).replace(/^\/+/, "");
        if (!name || name.includes("/")) {
          return null;
        }

        return {
          name: name,
          lastModified: value.lastModified,
        };
      })
      .filter(
        (item): item is { name: string; lastModified: string } => item !== null,
      );
  }

  exist(path: string) {
    return this.map[path] !== undefined;
  }
}
