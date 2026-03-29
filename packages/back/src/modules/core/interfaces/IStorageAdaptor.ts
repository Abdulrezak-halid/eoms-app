import { IStoragePath } from "./IStoragePath";
import { MaybePromise } from "./MaybePromise";

export type IFileContent = {
  buffer: Buffer;
  etag?: string;
  contentType?: string;
  lastModified?: string;
};

export interface IStorageAdaptor {
  readonly name: string;

  /**
   * Initializes the storage adaptor.
   * This method should prepare the storage for use (e.g., create directories or buckets).
   */
  init(): MaybePromise<void>;

  /**
   *
   *
   */
  shutdown(): MaybePromise<void>;

  /**
   * Stores content at the specified path.
   * @param path - The path where the content will be stored.
   * @param content - The content to store (Buffer or string).
   */
  put(
    path: IStoragePath,
    content: Buffer | string,
    contentType?: string,
  ): MaybePromise<void>;

  /**
   * Retrieves content from the specified path.
   * @param path - The path to retrieve content from.
   * @returns The content as a Buffer, or null if the content does not exist.
   */
  get(path: IStoragePath): MaybePromise<IFileContent | null>;

  /**
   * Removes the file at the specified path.
   * @param path - The path of the file to remove.
   * @throws An error if the file does not exist or cannot be removed.
   */
  remove(path: IStoragePath): MaybePromise<void>;

  /**
   * Removes the directory and all its contents at the specified path.
   * @param path - The path of the directory to remove.
   * @throws An error if the directory does not exist or cannot be removed.
   */
  removeDir(path: IStoragePath): MaybePromise<void>;

  /**
   * Removes the file at the specified path if it exists.
   * @param path - The path of the file to remove.
   * @throws An error if the file does not be removed.
   */
  removeIfExists(path: IStoragePath): MaybePromise<void>;

  /**
   * Resets the storage by clearing all contents.
   * This method should remove all files and directories and prepare the storage for reuse.
   * @throws An error if the reset operation fails.
   */
  resetStorage(): MaybePromise<void>;

  /**
   * Lists the contents of the directory at the specified path.
   * @param path - The path of the directory to list.
   * @returns An array of file names in the directory.
   * @throws An error if the directory does not exist or cannot be listed.
   */
  list(
    path: IStoragePath,
  ): MaybePromise<{ name: string; lastModified?: string }[]>;

  /**
   * Checks whether a file or directory exists at the specified path.
   * @param path - The path to check.
   * @returns True if the path exists, false otherwise.
   */
  exist(path: IStoragePath): MaybePromise<boolean>;
}
