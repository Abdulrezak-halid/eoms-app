import { IRoutePath } from "@m/core/interfaces/IRoutePath";

export interface IBreadCrumb {
  label?: string;
  path?: IRoutePath;
  onClick?: () => void;
  hideSm?: boolean;
}
