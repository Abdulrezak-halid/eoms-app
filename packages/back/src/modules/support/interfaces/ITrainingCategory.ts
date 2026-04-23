export const DataTrainingCategory = ["AWARENESS","COMPETENCE"] as const;
export type ITrainingCategory = (typeof DataTrainingCategory)[number];
