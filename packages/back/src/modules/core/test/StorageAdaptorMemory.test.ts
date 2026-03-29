import { beforeEach, describe, expect, it } from "vitest";

import { StorageAdaptorMemory } from "../storage-adaptors/StorageAdaptorMemory";

describe("StorageAdaptorMemory", () => {
  let adaptor: StorageAdaptorMemory;

  beforeEach(() => {
    adaptor = new StorageAdaptorMemory();
  });

  it("Store and retrieve string", () => {
    adaptor.put("string.txt", "hello world");
    const result = adaptor.get("string.txt");
    expect(result?.buffer.toString()).toStrictEqual("hello world");
  });

  it("Store and retrieve a buffer", () => {
    const buffer = Buffer.from("buffer content");
    adaptor.put("buffer.txt", buffer);
    const result = adaptor.get("buffer.txt");
    expect(result?.buffer.equals(buffer)).toBe(true);
  });

  it("Return null for non-existent file", () => {
    const result = adaptor.get("non-existent.txt");
    expect(result).toBeNull();
  });

  it("Remove a file", () => {
    adaptor.put("file.txt", "data");
    adaptor.remove("file.txt");
    expect(adaptor.get("file.txt")).toBeNull();
  });

  it("Return false on remove for non-existent file", () => {
    expect(() => adaptor.remove("file.txt")).toThrowError("There is no path");
  });

  it("Do nothing if there is non-existent file", () => {
    expect(() => adaptor.removeIfExists("file.txt")).not.toThrow();
  });

  it("Remove files in a directory", () => {
    adaptor.put("dir/file1.txt", "file1");
    adaptor.put("dir/file2.txt", "file2");
    adaptor.put("other/file3.txt", "file3");

    adaptor.removeDir("dir/");
    expect(adaptor.get("dir/file1.txt")).toBeNull();
    expect(adaptor.get("dir/file2.txt")).toBeNull();
    expect(adaptor.get("other/file3.txt")?.buffer.toString()).toBe("file3");
  });

  it("List files in a directory", () => {
    adaptor.put("dir/file1.txt", "file1");
    adaptor.put("dir/file2.txt", "file2");
    adaptor.put("other/file3.txt", "file3");
    adaptor.put("dir/subDir/file4.txt", "file4");

    const abc = adaptor.list("dir/");
    expect(abc).toStrictEqual([
      { name: "file1.txt", lastModified: expect.any(String) },
      { name: "file2.txt", lastModified: expect.any(String) },
    ]);
  });

  it("When removeDir finds no match", () => {
    expect(() => adaptor.removeDir("non-existent-dir")).toThrowError(
      "There is no path",
    );
  });

  it("Reset storage", () => {
    adaptor.put("dir/file1.txt", "file1");
    adaptor.resetStorage();
    expect(adaptor.get("dir/file1.txt")).toBeNull();
  });

  it("List only files in a directory", () => {
    adaptor.put("path/sub-file.txt", "wrong");
    adaptor.put("path/sub/b.txt", "correct");

    const result = adaptor.list("path/sub/");

    expect(result).toStrictEqual([
      { name: "b.txt", lastModified: expect.any(String) },
    ]);
  });

  it("File must exist.", () => {
    adaptor.put("file.txt", "content");

    const result = adaptor.exist("file.txt");

    expect(result).toStrictEqual(true);
  });

  it("List only files in a directory without '/' ", () => {
    adaptor.put("path/sub-file.txt", "wrong");
    adaptor.put("path/sub/b.txt", "correct");

    const result = adaptor.list("path/sub");

    expect(result).toStrictEqual([
      { name: "b.txt", lastModified: expect.any(String) },
    ]);
  });
});
