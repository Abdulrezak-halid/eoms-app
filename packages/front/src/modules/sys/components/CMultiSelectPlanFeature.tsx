import { IDtoEOrganizationPlanFeature } from "common/build-api-schema";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  CMultiSelect,
  ICMultiSelectProps,
} from "@m/core/components/CMultiSelect";
import { useMapToComboList } from "@m/core/hooks/useMapToComboList";

import { usePlanFeatureMap } from "../hooks/usePlanFeatureMap";

export function CMultiSelectPlanFeature(
  props: Omit<ICMultiSelectProps<IDtoEOrganizationPlanFeature>, "list">,
) {
  const { t } = useTranslation();

  const orgPlanFeature = usePlanFeatureMap();

  const list = useMapToComboList(orgPlanFeature);

  return (
    <CMultiSelect
      placeholder={t("selectPlanFeatures")}
      {...props}
      list={list}
    />
  );
}
