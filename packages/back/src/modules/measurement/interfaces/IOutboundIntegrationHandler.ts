/**
 * @file: IOutboundIntegrationHandler.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 09.07.2025
 * Last Modified Date: 09.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IContextCore } from "@m/core/interfaces/IContext";
import { ITimedValue } from "@m/core/interfaces/ITimedValue";
import { MaybePromise } from "@m/core/interfaces/MaybePromise";

import { IMetricIntegrationPeriod } from "./IMetricIntegrationPeriod";

export type IOutboundIntegrationRunResultItem = {
  outputKey: string;
  // If there is no "data" fetching result is failed.
  data?: ITimedValue;
  // Contains information about the data or error
  info?: unknown;
};

export interface IOutboundIntegrationHandler<TParam> {
  get(context: IContextCore, orgId: string, id: string): Promise<TParam>;
  create(
    context: IContextCore,
    orgId: string,
    id: string,
    param: TParam,
  ): Promise<void>;
  remove(context: IContextCore, orgId: string, id: string): Promise<void>;

  run(
    context: IContextCore,
    options: {
      period: IMetricIntegrationPeriod;
      outputKeys?: string[];
    },
    param: TParam,
  ): MaybePromise<IOutboundIntegrationRunResultItem[]>;
}
