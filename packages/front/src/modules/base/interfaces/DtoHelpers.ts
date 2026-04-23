
export type WithId<T> = T & { id: string };
export type WithoutId<T> = Omit<T, "id">;
