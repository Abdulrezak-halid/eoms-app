import { IUnit } from "common";
import { useCallback, useEffect, useState } from "react";

import { CComboboxAssignedAgent } from "@m/agent-management/components/CComboboxAssignedAgent";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CHr } from "@m/core/components/CHr";
import { CInputString } from "@m/core/components/CInputString";
import { CSelectorBigButton } from "@m/core/components/CSelectorBigButton";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useMapToComboList } from "@m/core/hooks/useMapToComboList";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { useInboundIntegrationTypeMap } from "../hooks/useInboundIntegrationTypeMap";
import {
  IDtoInboundIntegrationRequest,
  IDtoInboundIntegrationResponse,
} from "../interfaces/IDtoInboundIntegration";
import { CMetricIntegrationOutputForm } from "./CMetricIntegrationOutputForm";
import { IIntegrationOutput } from "./CMetricIntegrationOutputFormLine";

export function CInboundIntegrationForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoInboundIntegrationResponse;
  onSubmit: (data: IDtoInboundIntegrationRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputName = useInput(initialData?.name);
  const [type, setType] = useState(initialData?.config.type);

  const inputParamAgentId = useInput(
    initialData?.config.type === "AGENT"
      ? initialData.config.agent.id
      : undefined,
  );

  const [outputs, setOutputs] = useState<IIntegrationOutput[]>([]);

  const typeMap = useInboundIntegrationTypeMap();
  const typeList = useMapToComboList(typeMap);

  const isSingleOutput = type === "WEBHOOK";

  useEffect(() => {
    if (type === "AGENT") {
      setOutputs(
        initialData?.outputs &&
          initialData.config.type === type &&
          initialData.outputs.length
          ? initialData.outputs.map((d, i) => ({
              id: `output-${i}`,
              outputKey: d.outputKey,
              metricId: d.metricId,
              unit: d.unit,
            }))
          : [
              {
                id: "output-0",
                outputKey: "",
                metricId: undefined,
                unit: undefined,
              },
            ],
      );
    } else {
      const defaultOutput =
        initialData && initialData.config.type === type
          ? initialData.outputs.find((d) => d.outputKey === "default")
          : undefined;

      setOutputs([
        {
          id: "default",
          label: isSingleOutput ? t("metric") : undefined,
          outputKey: isSingleOutput ? "default" : "",
          metricId: defaultOutput?.metricId,
          unit: defaultOutput?.unit,
        },
      ]);
    }
  }, [initialData, type, isSingleOutput, t]);

  const invalidBase = useInputInvalid(inputName);
  const invalidParamAgent = useInputInvalid(inputParamAgentId);

  const [isOutputFormInvalid, setOutputFormInvalid] = useState(false);

  const invalid =
    invalidBase ||
    !type ||
    (type === "AGENT" && invalidParamAgent) ||
    isOutputFormInvalid;

  const handleSubmit = useCallback(async () => {
    if (invalid || !inputName.value || !type) {
      return;
    }

    const outputValues = outputs
      .filter((output) => output.outputKey && output.metricId && output.unit)
      .map((output) => ({
        outputKey: output.outputKey,
        metricId: output.metricId as string,
        unit: output.unit as IUnit,
      }));

    switch (type) {
      case "WEBHOOK": {
        await onSubmit({
          name: inputName.value,
          config: { type },
          outputs: outputValues,
        });
        return;
      }

      case "AGENT": {
        if (!inputParamAgentId.value) {
          return;
        }

        await onSubmit({
          name: inputName.value,
          config: {
            type,
            agentId: inputParamAgentId.value,
          },
          outputs: outputValues,
        });
        return;
      }
    }
  }, [
    invalid,
    inputName.value,
    type,
    outputs,
    onSubmit,
    inputParamAgentId.value,
  ]);

  return (
    <div className="space-y-4">
      <CForm onSubmit={handleSubmit}>
        <CFormPanel>
          <CFormLine label={t("name")} invalidMsg={inputName.invalidMsg}>
            <CInputString {...inputName} placeholder={t("name")} required />
          </CFormLine>

          <CFormLine
            label={t("integration")}
            invalidMsg={!type ? t("required") : undefined}
          >
            <CSelectorBigButton
              list={typeList}
              value={type}
              onChange={setType}
            />
          </CFormLine>

          {type === "AGENT" && (
            <CFormLine
              label={t("agent")}
              invalidMsg={inputParamAgentId.invalidMsg}
            >
              <CComboboxAssignedAgent {...inputParamAgentId} required />
            </CFormLine>
          )}
        </CFormPanel>

        <div className="space-y-4">
          {type && (
            <CMetricIntegrationOutputForm
              outputs={outputs}
              setOutputs={setOutputs}
              isSingleOutput={isSingleOutput}
              onInvalidChange={setOutputFormInvalid}
              keyPlaceholder={type === "AGENT" ? t("code") : undefined}
            />
          )}

          <CHr />
          <CFormFooterSaveUpdate
            isUpdate={Boolean(initialData)}
            disabled={invalid}
          />
        </div>
      </CForm>
    </div>
  );
}
