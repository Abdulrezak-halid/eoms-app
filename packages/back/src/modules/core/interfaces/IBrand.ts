
declare const __brand: unique symbol;
export type IBrand<T, TBrand> = T & { [__brand]: TBrand };
