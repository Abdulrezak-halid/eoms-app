import { z } from "@hono/zod-openapi";

export function zFile(fileTypes?: string[], maxSizeKb?: number) {
  let schema = z.file();

  if (fileTypes && fileTypes.length > 0) {
    schema = schema.refine((f) => fileTypes.includes(f.type), {
      message: "File type is not correct",
    });
  }

  if (typeof maxSizeKb === "number") {
    schema = schema.refine((f) => f.size <= maxSizeKb * 1024, {
      message: "File size is too large",
    });
  }

  return schema.openapi({ type: "string", format: "binary" });
}
