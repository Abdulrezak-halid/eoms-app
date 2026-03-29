import { z } from "@hono/zod-openapi";

export namespace UtilArray {
  export function zUniqueArray<T>(
    schema: z.ZodType<T>,
    options?: { min?: number; max?: number; key?: keyof T },
  ) {
    let result = z.array(schema);

    if (options?.min !== undefined) {
      result = result.min(options.min);
    }

    if (options?.max !== undefined) {
      result = result.max(options.max);
    }

    return result.refine(
      (items) => {
        const uniqueCount = options?.key
          ? new Set(items.map((item) => item?.[options.key!])).size
          : new Set(items).size;

        return uniqueCount === items.length;
      },
      { message: "All items or only one item must be unique" },
    );
  }
}
