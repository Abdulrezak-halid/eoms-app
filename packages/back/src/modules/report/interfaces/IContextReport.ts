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
