import { z } from "@hono/zod-openapi";

import { DataDataViewType } from "../../analysis/interfaces/IDataViewTypeOptions";

export const SchemaEDataViewType = z
  .enum(DataDataViewType)
  .openapi("IDtoEDataViewType");
