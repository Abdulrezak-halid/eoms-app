/**
 * @file: COutboundIntegrationForm.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 15.07.2025
 * Last Modified Date: 15.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { UtilUnit } from "common";
import {
  IDtoEMetricIntegrationPeriod,
  IDtoEOutboundIntegrationType,
} from "common/build-api-schema";
import { Play } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Api } from "@m/base/api/Api";
import { CDisplayDatetime } from "@m/base/components/CDisplayDatetime";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CButton } from "@m/core/components/CButton";
import { CDisplayNumber } from "@m/core/components/CDisplayNumber";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CFormTitle } from "@m/core/components/CFormTitle";
import { CHr } from "@m/core/components/CHr";
import { CInputString } from "@m/core/components/CInputString";
import { CMutedText } from "@m/core/components/CMutedText";
import { CSelectorBigButton } from "@m/core/components/CSelectorBigButton";
import { CSyntaxHighlighter } from "@m/core/components/CSyntaxHighlighter";
import { CTable } from "@m/core/components/CTable";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useMapToComboList } from "@m/core/hooks/useMapToComboList";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { useOutboundIntegrationTypeMap } from "../hooks/useOutboundIntegrationTypeMap";
import { useWeatherApiOutputTypeMap } from "../hooks/useWeatherApiOutputTypeMap";
import {
  IDtoOutboundIntegrationConfig,
  IDtoOutboundIntegrationParamAvevaPi,
  IDtoOutboundIntegrationParamMockSource,
  IDtoOutboundIntegrationParamOpenWeather,
  IDtoOutboundIntegrationParamWeatherApi,
  IDtoOutboundIntegrationRequest,
  IDtoOutboundIntegrationResponse,
  IDtoOutboundIntegrationRunResultItem,
} from "../interfaces/IDtoOutboundIntegration";
import { IWeatherApiOutputType } from "../interfaces/IWeatherApiOutputType";
import { CBadgeIndexSuccess } from "./CBadgeIndexSuccess";
import { CComboboxMetricIntegrationPeriod } from "./CComboboxMetricIntegrationPeriod";
import { CMetricIntegrationOutputForm } from "./CMetricIntegrationOutputForm";
import { IIntegrationOutput } from "./CMetricIntegrationOutputFormLine";
import { COutboundIntegrationSubFormAvevaPi } from "./COutboundIntegrationSubFormAvevaPi";
import { COutboundIntegrationSubFormMockSource } from "./COutboundIntegrationSubFormMockSource";
import { COutboundIntegrationSubFormWeatherApi } from "./COutboundIntegrationSubFormWeatherApi";

export function COutboundIntegrationForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoOutboundIntegrationResponse;
  onSubmit: (data: IDtoOutboundIntegrationRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const [type, setType] = useState(initialData?.config.type);

  const inputName = useInput(initialData?.name);

  const inputPeriod = useInput(initialData?.config.period);
  const [param, setParam] = useState(initialData?.config.param);

  const [outputs, setOutputs] = useState<IIntegrationOutput[]>([]);

  const typeMap = useOutboundIntegrationTypeMap();
  const typeList = useMapToComboList(typeMap);
  const isWeatherLikeIntegration =
    type === "WEATHER_API" || type === "OPEN_WEATHER";

  useEffect(() => {
    // TODO need to use initial data if initial type is same as selected type.
    if (isWeatherLikeIntegration) {
      setOutputs([
        {
          id: "CDD",
          label: t("cdd"),
          outputKey: "CDD",
          metricId: initialData?.outputs.find((d) => d.outputKey === "CDD")
            ?.metricId,
          unit: "TEMPERATURE_CELSIUS",
          isFixedUnit: true,
        },
        {
          id: "HDD",
          label: t("hdd"),
          outputKey: "HDD",
          metricId: initialData?.outputs.find((d) => d.outputKey === "HDD")
            ?.metricId,
          unit: "TEMPERATURE_CELSIUS",
          isFixedUnit: true,
        },
        {
          id: "HUMIDITY",
          label: t("humidity"),
          outputKey: "HUMIDITY",
          metricId: initialData?.outputs.find((d) => d.outputKey === "HUMIDITY")
            ?.metricId,
          unit: "RATE_PERCENTAGE",
          isFixedUnit: true,
        },
        {
          id: "TEMPERATURE",
          label: t("temperature"),
          outputKey: "TEMPERATURE",
          metricId: initialData?.outputs.find(
            (d) => d.outputKey === "TEMPERATURE",
          )?.metricId,
          unit: "TEMPERATURE_CELSIUS",
          isFixedUnit: true,
        },
        {
          id: "RAIN",
          label: t("rain"),
          outputKey: "RAIN",
          metricId: initialData?.outputs.find((d) => d.outputKey === "RAIN")
            ?.metricId,
          unit: "PRECIPITATION_MILIMETER_PER_METRE_SQUARE",
          isFixedUnit: true,
        },
      ]);
    } else if (type === "AVEVA_PI") {
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
      const defaultOutput = initialData?.outputs.find(
        (d) => d.outputKey === "default",
      );

      setOutputs([
        {
          id: "default",
          label: t("metric"),
          outputKey: "default",
          metricId: defaultOutput?.metricId,
          unit: defaultOutput?.unit,
        },
      ]);
    }
  }, [initialData, isWeatherLikeIntegration, type, t]);

  const invalidForm = useInputInvalid(inputPeriod, inputName);

  const [isSubFormInvalid, setSubFormInvalid] = useState(false);
  const [isOutputFormInvalid, setOutputFormInvalid] = useState(false);

  const invalid =
    invalidForm || !type || isSubFormInvalid || isOutputFormInvalid;

  const getConfig = useCallback(() => {
    if (!inputPeriod.value || !type || !param) {
      return null;
    }

    return {
      period: inputPeriod.value,
      type,
      param,
    } as IDtoOutboundIntegrationConfig;
  }, [inputPeriod.value, type, param]);

  const handleSubmit = useCallback(async () => {
    if (invalid) {
      return;
    }

    if (!inputName.value) {
      return;
    }

    const config = getConfig();

    if (!config) {
      return;
    }

    await onSubmit({
      name: inputName.value,
      config,
      outputs: outputs
        .filter((output) => output.outputKey && output.metricId && output.unit)
        .map((output) => ({
          outputKey: output.outputKey,
          metricId: output.metricId!,
          unit: output.unit!,
        })),
    });
  }, [getConfig, inputName.value, invalid, onSubmit, outputs]);

  const enabledPeriods = useMemo<IDtoEMetricIntegrationPeriod[] | undefined>(
    () => (isWeatherLikeIntegration ? ["MINUTELY_15", "DAILY"] : undefined),
    [isWeatherLikeIntegration],
  );

  // This effect is to reset period value when integration type is changed,
  //   and the integration does not support pre selected period.
  useEffect(() => {
    if (
      enabledPeriods &&
      inputPeriod.value &&
      !enabledPeriods.includes(inputPeriod.value)
    ) {
      inputPeriod.setValue(undefined);
    }
  }, [enabledPeriods, inputPeriod]);

  const apiToast = useApiToast();

  const [runResult, setRunResult] = useState<{
    integrationType: IDtoEOutboundIntegrationType;
    outputs: (IDtoOutboundIntegrationRunResultItem & { info?: string })[];
  }>();

  const handleTestRun = useCallback(async () => {
    if (invalid) {
      return;
    }

    const config = getConfig();
    if (!config) {
      return;
    }

    // Unique output keys with the user defined order
    const outputKeys: string[] = [];
    for (const output of outputs) {
      if (outputKeys.includes(output.outputKey)) {
        continue;
      }
      outputKeys.push(output.outputKey);
    }

    const res = await Api.POST("/u/measurement/outbound-integration/run", {
      body: { config, outputKeys },
    });

    apiToast(res);

    if (!res.data) {
      setRunResult(undefined);
      return;
    }

    // Flatten all arrays in the object into a single array
    setRunResult({
      integrationType: config.type,
      outputs: res.data.result.map((d) => ({
        ...d,
        info: d.info ? JSON.stringify(d.info, null, 2) : undefined,
      })),
    });
  }, [apiToast, getConfig, invalid, outputs]);

  const testRunTableHeader = useMemo(
    () => [
      {},
      { label: t("output") },
      { label: t("value") },
      { label: t("datetime") },
      { label: t("details") },
    ],
    [t],
  );

  const meteorologyOutputMap = useWeatherApiOutputTypeMap();
  const outputKeyToUnitAbbrMap = useMemo(() => {
    const map = new Map<string, string | undefined>();
    for (const output of outputs) {
      if (!output.unit) {
        continue;
      }
      map.set(output.outputKey, UtilUnit.getAbbreviation(output.unit, t));
    }
    return map;
  }, [outputs, t]);

  const outputSucessStatuses = useMemo(
    () =>
      runResult && runResult.integrationType === type
        ? new Map(runResult.outputs.map((d) => [d.outputKey, Boolean(d.data)]))
        : undefined,
    [type, runResult],
  );

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

          <CFormLine label={t("period")} invalidMsg={inputPeriod.invalidMsg}>
            <CComboboxMetricIntegrationPeriod
              {...inputPeriod}
              enabledValues={enabledPeriods}
              required
            />
          </CFormLine>

          {type === "MOCK_SOURCE" ? (
            <COutboundIntegrationSubFormMockSource
              value={param as IDtoOutboundIntegrationParamMockSource}
              onChange={setParam}
              onChangeInvalid={setSubFormInvalid}
            />
          ) : type === "WEATHER_API" ? (
            <COutboundIntegrationSubFormWeatherApi
              value={param as IDtoOutboundIntegrationParamWeatherApi}
              onChange={setParam}
              onChangeInvalid={setSubFormInvalid}
            />
          ) : type === "OPEN_WEATHER" ? (
            <COutboundIntegrationSubFormWeatherApi
              value={param as IDtoOutboundIntegrationParamOpenWeather}
              onChange={setParam}
              onChangeInvalid={setSubFormInvalid}
            />
          ) : (
            type === "AVEVA_PI" && (
              <COutboundIntegrationSubFormAvevaPi
                value={param as IDtoOutboundIntegrationParamAvevaPi}
                onChange={setParam}
                onChangeInvalid={setSubFormInvalid}
              />
            )
          )}
        </CFormPanel>

        <div className="space-y-4 mt-4">
          {type && (
            <CMetricIntegrationOutputForm
              outputs={outputs}
              setOutputs={setOutputs}
              successStatuses={outputSucessStatuses}
              isSingleOutput={type === "MOCK_SOURCE"}
              noAdd={isWeatherLikeIntegration}
              onInvalidChange={setOutputFormInvalid}
              keyPlaceholder={
                // It is special name, that's why there is no translation.
                type === "AVEVA_PI" ? "Web ID" : undefined
              }
            />
          )}

          <CHr />
          <CFormFooterSaveUpdate
            isUpdate={Boolean(initialData)}
            disabled={invalid}
          >
            <div className="grow">
              <CButton
                icon={Play}
                onClick={handleTestRun}
                label={t("testConfiguration")}
                disabled={invalid}
                hideLabelSm
              />
            </div>
          </CFormFooterSaveUpdate>
        </div>
      </CForm>

      {runResult !== undefined && (
        <div className="space-y-2">
          <CFormTitle value={t("testResult")} />

          <CTable header={testRunTableHeader}>
            {runResult.outputs.map((d, index) => [
              <div key="index">
                <CBadgeIndexSuccess index={index} isSuccess={Boolean(d.data)} />
              </div>,

              <div key="outputKey" className="wrap-anywhere line-clamp-6">
                {runResult.integrationType === "WEATHER_API" ||
                runResult.integrationType === "OPEN_WEATHER"
                  ? meteorologyOutputMap[d.outputKey as IWeatherApiOutputType]
                      ?.label
                  : runResult.integrationType === "MOCK_SOURCE"
                    ? t("metric")
                    : d.outputKey}
              </div>,

              <CDisplayNumber
                key="value"
                value={d.data?.value}
                minDecimals={2}
                unitStr={outputKeyToUnitAbbrMap.get(d.outputKey)}
              />,

              <div key="datetime">
                {d.data ? (
                  <CDisplayDatetime key="datetime" value={d.data.datetime} />
                ) : (
                  <CMutedText value="-" />
                )}
              </div>,

              <div key="detail">
                {d.info ? (
                  <CSyntaxHighlighter
                    language="typescript"
                    code={d.info}
                    hideLineNumbers
                    wrap
                  />
                ) : (
                  <CMutedText value="-" />
                )}
              </div>,
            ])}
          </CTable>
        </div>
      )}
    </div>
  );
}
