export const DataCalendarEntryType = ["CUSTOM"] as const;
export type ICalendarEntryType = (typeof DataCalendarEntryType)[number];
