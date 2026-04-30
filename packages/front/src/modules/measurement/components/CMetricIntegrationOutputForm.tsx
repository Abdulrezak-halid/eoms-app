import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Plus } from "lucide-react";

import { CButton } from "@m/core/components/CButton";
import { CFormTitle } from "@m/core/components/CFormTitle";
import { CInvalidMsg } from "@m/core/components/CInvalidMsg";
import { CLine } from "@m/core/components/CLine";
import { CNoRecord } from "@m/core/components/CNoRecord";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  CMetricIntegrationOutputFormLine,
  IIntegrationOutput,
} from "./CMetricIntegrationOutputFormLine";

export function CMetricIntegrationOutputForm({
  outputs,
  setOutputs,
  successStatuses,
  isSingleOutput,
  noAdd,
  onInvalidChange,
  keyPlaceholder,
}: {
  outputs: IIntegrationOutput[];
  setOutputs: Dispatch<SetStateAction<IIntegrationOutput[]>>;
  successStatuses?: Map<string, boolean>;
  isSingleOutput?: boolean;
  noAdd?: boolean;
  onInvalidChange: (value: boolean) => void;
  keyPlaceholder?: string;
}) {
  const { t } = useTranslation();

  const handleOutputAdd = useCallback(() => {
    const newId = `output-${Date.now()}`;
    setOutputs((prev) => [
      ...prev,
      {
        id: newId,
        label: isSingleOutput ? t("metric") : undefined,
        outputKey: isSingleOutput ? "default" : "",
        metricId: undefined,
        unit: undefined,
      },
    ]);
  }, [isSingleOutput, setOutputs, t]);

  const handleOutputRemove = useCallback(
    (id: string) => {
      setOutputs((prev) => prev.filter((output) => output.id !== id));
    },
    [setOutputs],
  );

  const handleOutputUpdate = useCallback(
    (id: string, updates: Peomsal<IIntegrationOutput>) => {
      setOutputs((prev) =>
        prev.map((output) =>
          output.id === id ? { ...output, ...updates } : output,
        ),
      );
    },
    [setOutputs],
  );

  const usedMetricIds = useMemo(
    () => outputs.map((d) => d.metricId).filter(Boolean) as string[],
    [outputs],
  );

  const duplicateKeys = useMemo(() => {
    const keyCounts = outputs.reduce(
      (acc, output) => {
        if (output.outputKey) {
          acc[output.outputKey] = (acc[output.outputKey] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );
    return new Set(Object.keys(keyCounts).filter((key) => keyCounts[key] > 1));
  }, [outputs]);

  const invalidRequired = useMemo(() => {
    return outputs.some(
      (output) =>
        !output.outputKey ||
        !output.unit ||
        (!output.isFixedUnit && !output.metricId),
    );
  }, [outputs]);

  const invalidDuplicate = duplicateKeys.size > 0;

  const invalid = invalidRequired || invalidDuplicate;

  useEffect(() => {
    onInvalidChange(invalid);
  }, [invalid, onInvalidChange]);

  return (
    <div className="space-y-2">
      <CFormTitle value={t("outputs")} />

      {outputs.length === 0 ? (
        <CNoRecord className="py-3" />
      ) : (
        outputs.map((output, index) => (
          <CMetricIntegrationOutputFormLine
            key={output.id}
            output={output}
            index={index}
            isSuccess={successStatuses?.get(output.outputKey)}
            onUpdate={handleOutputUpdate}
            onRemove={handleOutputRemove}
            selectedMetricIds={usedMetricIds}
            keyPlaceholder={keyPlaceholder}
            isKeyDuplicate={duplicateKeys.has(output.outputKey)}
          />
        ))
      )}
      <CInvalidMsg
        value={
          invalidRequired
            ? t("required")
            : invalidDuplicate
              ? t("msgDuplicateOutputKey")
              : undefined
        }
      />
      <div>
        <CLine className="flex justify-end">
          {!noAdd && (!isSingleOutput || outputs.length === 0) && (
            <CButton
              icon={Plus}
              label={t("addOutput")}
              onClick={handleOutputAdd}
            />
          )}
        </CLine>
      </div>
    </div>
  );
}
