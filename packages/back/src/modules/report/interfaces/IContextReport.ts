/**
 * @file: IContextReport.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 04.10.2025
 * Last Modified Date: 04.10.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IContextOrg } from "@m/core/interfaces/IContext";
import { II18n } from "@m/core/interfaces/II18n";

export interface IContextReport extends IContextOrg {
  tzOffset: number;
  i18n: II18n;
  config: {
    datetimeStart: string;
    datetimeEnd: string;
  };
}
