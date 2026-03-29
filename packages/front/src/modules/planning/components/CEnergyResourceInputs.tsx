import { IDtoEEnergyResource } from "common/build-api-schema";
import { useCallback } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CBadgeEnergyResource } from "@m/base/components/CBadgeEnergyResource";
import { allEnergyResourceTypes } from "@m/base/utils/allEnergyResourceTypes";
import { CInputNumber } from "@m/core/components/CInputNumber";

type CEnergyResourceInputsProps = {
  availableResources: IDtoEEnergyResource[];
  values: Record<IDtoEEnergyResource, number | undefined>;
  onChange: (
    energyResource: IDtoEEnergyResource,
    value: number | undefined,
  ) => void;
  onInvalidMsg: (energyResource: IDtoEEnergyResource, msg: string) => void;
  hasError: boolean;
};

export function CEnergyResourceInputs({
  availableResources,
  values,
  onChange,
  onInvalidMsg,
}: CEnergyResourceInputsProps) {
  return (
    <div className="space-y-2 w-full">
      {allEnergyResourceTypes
        .filter((resource) => availableResources.includes(resource))
        .map((energyResource) => (
          <CEnergyResourceInputLine
            key={energyResource}
            energyResource={energyResource}
            value={values[energyResource]}
            onChange={onChange}
            onInvalidMsg={onInvalidMsg}
          />
        ))}
    </div>
  );
}

function CEnergyResourceInputLine({
  energyResource,
  value,
  onChange,
  onInvalidMsg,
}: {
  energyResource: IDtoEEnergyResource;
  value: number | undefined;
  onChange: (
    energyResource: IDtoEEnergyResource,
    value: number | undefined,
  ) => void;
  onInvalidMsg: (energyResource: IDtoEEnergyResource, msg: string) => void;
}) {
  const { t } = useTranslation();

  const handleChange = useCallback(
    (v: number | undefined) => {
      onChange(energyResource, v);
    },
    [energyResource, onChange],
  );

  const handleInvalidMsg = useCallback(
    (msg: string) => {
      onInvalidMsg(energyResource, msg);
    },
    [energyResource, onInvalidMsg],
  );

  return (
    <div key={energyResource} className="flex items-center gap-2">
      <div className="w-40">
        <CBadgeEnergyResource value={energyResource} />
      </div>
      <div className="flex-grow">
        <CInputNumber
          value={value}
          onChange={handleChange}
          onInvalidMsg={handleInvalidMsg}
          placeholder={t("value")}
          min={0}
        />
      </div>
    </div>
  );
}
