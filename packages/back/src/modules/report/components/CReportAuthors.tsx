import { EApiFailCode } from "common";
import { and, eq, inArray } from "drizzle-orm";

import { TbUser, sqlUserDisplayName } from "@m/base/orm/TbUser";
import { ApiException } from "@m/core/exceptions/ApiException";

import { IContextReport } from "../interfaces/IContextReport";

export const CReportAuthors = async ({
  c,
  authorIds,
}: {
  c: IContextReport;
  authorIds: string[];
}) => {
  const authors = await c.db
    .select({
      displayName: sqlUserDisplayName(),
    })
    .from(TbUser)
    .where(and(eq(TbUser.orgId, c.orgId), inArray(TbUser.id, authorIds)));

  if (authors.length !== authorIds.length) {
    throw new ApiException(
      EApiFailCode.BAD_REQUEST,
      "All author users cannot find.",
    );
  }

  return (
    <div id="authors">
      <h2>{c.i18n.t("authors")}:</h2>
      <ul>
        {authors.map((author) => (
          <li key={author.displayName}>{author.displayName}</li>
        ))}
      </ul>
    </div>
  );
};
