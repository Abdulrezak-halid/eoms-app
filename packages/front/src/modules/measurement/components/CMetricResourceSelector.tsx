import { IDtoEMetricType } from "common/build-api-schema";
import { useCallback, useEffect, useState } from "react";

import { CComboboxMetric } from "./CComboboxMetric";
import { CMultiSelectMetricResource } from "./CMultiSelectMetricResource";

export interface ICMetricResourceSelectorProps {
  value?: string[];
  onChange?: (resourceIds: string[] | undefined) => void;
  onInvalidMsg?: (msg: string) => void;
  metricType?: IDtoEMetricType;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
}

export function CMetricResourceSelector({
  value,
  onChange,
  onInvalidMsg,
  metricType,
  disabled,
  invalid,
  required,
}: ICMetricResourceSelectorProps) {
  const [selectedMetricId, setSelectedMetricId] = useState<
    string | undefined
  >();

  const handleMetricChange = useCallback(
    (metricId: string | undefined) => {
      setSelectedMetricId(metricId);
      onChange?.(undefined);
    },
    [onChange],
  );

  const [invalidMsgMetric, setInvalidMsgMetric] = useState("");
  const [invalidMsgMetricResource, setInvalidMsgMetricResource] = useState("");

  useEffect(() => {
    onInvalidMsg?.(invalidMsgMetric || invalidMsgMetricResource);
  }, [invalidMsgMetric, invalidMsgMetricResource, onInvalidMsg]);

  return (
    <div className="space-y-2">
      <CComboboxMetric
        type={metricType}
        value={selectedMetricId}
        onChange={handleMetricChange}
        required={required}
        disabled={disabled}
        invalid={invalid}
        onInvalidMsg={setInvalidMsgMetric}
      />
      <CMultiSelectMetricResource
        metricId={selectedMetricId}
        metricType={metricType}
        value={value}
        onChange={onChange}
        disabled={disabled || !selectedMetricId}
        invalid={invalid}
        required={required}
        onInvalidMsg={setInvalidMsgMetricResource}
      />
    </div>
  );
}
