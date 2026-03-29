import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoJobScheduleRequest = InferApiRequest<
  "/u/sys/job/schedule",
  "post"
>;
export type IDtoJobRunRequest = InferApiRequest<"/u/sys/job/run", "post">;

export type IDtoJobListResponse = InferApiResponse<
  "/u/sys/job",
  "get"
>["records"][number];

export type IDtoEJobType = IDtoJobScheduleRequest["type"];
