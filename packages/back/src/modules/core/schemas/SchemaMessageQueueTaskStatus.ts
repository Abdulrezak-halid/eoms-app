import { z } from "zod";

import { DataMessageQueueTaskStatus } from "../interfaces/IMessageQueueTaskStatus";

export const SchemaMessageQueueTaskStatus = z
  .enum(DataMessageQueueTaskStatus)
  .openapi("IDtoEMessageQueueTaskStatus");
