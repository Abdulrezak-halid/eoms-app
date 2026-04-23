export const DataWeatherQueryType = ["CITY", "LAT_LONG"] as const;
export type IWeatherQueryType = (typeof DataWeatherQueryType)[number];
