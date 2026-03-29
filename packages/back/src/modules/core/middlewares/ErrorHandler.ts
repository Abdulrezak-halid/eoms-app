/**
 * @file: ErrorHandler.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 07.01.2025
 * Last Modified Date: 07.01.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";
import { EApiFailCode } from "common";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

import { IHonoContextCore } from "@m/core/interfaces/IContext";

// TODO refactor name to errorToLogObject
export function errorToObject(err: unknown) {
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      cause: err.cause,
      stack: err.stack?.split("\n"),
    };
  }

  return err;
}

export function ErrorHandler(err: unknown, c: Context<IHonoContextCore>) {
  // Zod errors
  // -----------------------------------------------------------------
  if (err instanceof z.ZodError) {
    c.var.logger.error(
      { name: "ErrorHandler", error: err },
      "Invalid API request.",
    );
    if (err.message.includes("Invalid uuid")) {
      return c.body(EApiFailCode.NOT_FOUND, 400);
    }
    return c.body(EApiFailCode.BAD_REQUEST, 400);
  }

  // ApiException errors
  // -----------------------------------------------------------------
  if (err instanceof HTTPException) {
    c.var.logger.error(
      {
        name: "ErrorHandler",
        status: err.status,
        error: errorToObject(err),
      },
      "Handled API exception.",
    );
    return err.getResponse();
  }

  // Any other errors
  // Auto detects db errors and convert it to meaningful errors.
  // -----------------------------------------------------------------
  if (err instanceof Error) {
    // Note: pg.DatabaseError does not work in tests.
    //   Because pg client is different.
    // if (err instanceof pg.DatabaseError) {
    const pgError = (err as { cause?: { code?: string; detail?: string } })
      .cause;
    const pgErrorCode = pgError?.code;
    // Key already exists
    if (pgErrorCode === "23505") {
      c.var.logger.error(
        {
          name: "ErrorHandler",
          error: errorToObject(err),
        },
        "Unique constraint error.",
      );
      return c.body(EApiFailCode.ALREADY_EXISTS, 400);
    }

    // Foreign key not found
    if (pgErrorCode === "23503") {
      if (pgError?.detail?.includes("is still")) {
        c.var.logger.error(
          {
            name: "ErrorHandler",
            error: errorToObject(err),
          },
          "Foreign key is in use.",
        );
        return c.body(EApiFailCode.FOREIGN_KEY_IN_USE, 400);
      }

      c.var.logger.error(
        {
          name: "ErrorHandler",
          error: errorToObject(err),
        },
        "Foreign key not found.",
      );
      return c.body(EApiFailCode.FOREIGN_KEY_NOT_FOUND, 400);
    }

    c.var.logger.error(
      {
        name: "ErrorHandler",
        error: errorToObject(err),
      },
      "Unhandled error.",
    );
  } else {
    c.var.logger.error(
      { name: "ErrorHandler", error: err },
      "Unhandled error.",
    );
  }

  return c.body("Internal", 500);
}
