import { and, eq } from "drizzle-orm";

import { IContextCore } from "@m/core/interfaces/IContext";
import { errorToObject } from "@m/core/middlewares/ErrorHandler";

import { TbRegressionSuggestion } from "../orm/TbRegressionSuggestion";
import { TbRegressionSuggestionDriver } from "../orm/TbRegressionSuggestionDriver";
import { SchemaRegressionSuggestionDriver } from "../schemas/SchemaRegressionSuggestionDriver";

export async function MqConsumerDriverSuggestions(
  c: IContextCore,
  message: Buffer,
) {
  let targetId: string | undefined;
  try {
    const json = JSON.parse(message.toString());

    // Early parse id field to log in case of actual parse error
    if (json && typeof json === "object" && "target_id" in json) {
      targetId = json.target_id;
    }

    const parsed = SchemaRegressionSuggestionDriver.parse(json);

    await c.db.transaction(async (tx) => {
      const [suggestion] = await tx
        .update(TbRegressionSuggestion)
        .set({ status: "SUCCESS" })
        .where(
          and(
            eq(TbRegressionSuggestion.seuId, parsed.target_id),
            eq(TbRegressionSuggestion.status, "PENDING"),
          ),
        )
        .returning({
          orgId: TbRegressionSuggestion.orgId,
          id: TbRegressionSuggestion.id,
        });

      if (!suggestion) {
        c.logger.warn("No suggestion found for target");
        return;
      }

      await tx.insert(TbRegressionSuggestionDriver).values(
        parsed.selected_feature_ids.map((metricId) => ({
          orgId: suggestion.orgId,
          metricId,
          subjectId: suggestion.id,
        })),
      );
    });
  } catch (error) {
    c.logger.error(
      {
        targetId,
        error: errorToObject(error),
      },
      "Error processing suggestion for target",
    );

    if (targetId) {
      await c.db
        .update(TbRegressionSuggestion)
        .set({ status: "FAILED", failInfo: "INTERNAL" })
        .where(
          and(
            eq(TbRegressionSuggestion.seuId, targetId),
            eq(TbRegressionSuggestion.status, "PENDING"),
          ),
        );
    }

    throw error;
  }
}
