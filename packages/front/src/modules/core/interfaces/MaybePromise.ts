/**
 * @file: MaybePromise.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 10.09.2025
 * Last Modified Date: 10.09.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
export type MaybePromise<T> = Promise<T> | T;
