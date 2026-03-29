import type { Context } from "hono";
import { HtmlEscapedString } from "hono/utils/html";

import { IFileContent } from "../interfaces/IStorageAdaptor";

export namespace UtilHono {
  export function resNull(c: Context) {
    return c.body(null, 204);
  }

  export function resJsx(c: Context, renderedJsx: HtmlEscapedString) {
    return c.html(renderedJsx);
  }

  export function resFile(
    c: Context,
    content: IFileContent,
    options?: {
      contentType?: string;
      subject?: string;
      filename?: string;
      inline?: boolean;
    },
  ) {
    const headers: Record<string, string> = {
      "Content-Type": options?.contentType || "application/octet-stream",
    };

    if (options?.subject) {
      headers["Content-Subject"] = options.subject;
    }

    if (options?.filename) {
      headers["Content-Disposition"] =
        `${options.inline ? "inline" : "attachment"}; filename="${options.filename}"`;
    }

    if (content.etag) {
      headers.ETag = content.etag;
    }

    return c.body(Buffer.from(content.buffer), 200, headers);
  }
}
