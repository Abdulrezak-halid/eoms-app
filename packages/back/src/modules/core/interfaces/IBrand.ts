/**
 * @file: IBrand.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 04.09.2025
 * Last Modified Date: 04.09.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */

declare const __brand: unique symbol;
export type IBrand<T, TBrand> = T & { [__brand]: TBrand };
