import { IDtoScopeAndLimitsResponse } from "@m/commitment/interfaces/IDtoScopeAndLimits";
import { TranslationFunc } from "@m/core/hooks/useTranslation";

import { IVerticalTableData } from "../interfaces/IVerticalTableData";
import { getEnergyResourceTranslationKey } from "./getEnergyResourceTranslationKey";

export function customTableConverterScopeAndLimits(
  records: IDtoScopeAndLimitsResponse[],
  t: TranslationFunc,
): IVerticalTableData {
  return {
    headers: [
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "departments",
        },
      },
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "excludedResources",
        },
      },
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "excludedResourceReason",
        },
      },
    ],
    rows: records.map((record) => [
      {
        type: "PLAIN",
        value: record.departments.map((dept) => dept.name).join(", "),
      },
      {
        type: "PLAIN",
        value: record.excludedResources
          .map((resource) => t(getEnergyResourceTranslationKey(resource)))
          .join(", "),
      },
      {
        type: "PLAIN",
        value: record.excludedResourceReason,
      },
    ]),
  };
}
