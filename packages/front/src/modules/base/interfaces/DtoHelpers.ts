/**
 * @file: DtoHelpers.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 12.02.2025
 * Last Modified Date: 12.02.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */

export type WithId<T> = T & { id: string };
export type WithoutId<T> = Omit<T, "id">;
