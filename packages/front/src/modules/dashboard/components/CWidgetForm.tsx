import { useCallback, useEffect, useMemo, useState } from "react";

import { CComboboxRegressionResult } from "@m/analysis/components/CComboboxRegressionResult";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CMultiSelectSeu } from "@m/base/components/CMultiSelectSeu";
import { CCheckbox } from "@m/core/components/CCheckbox";
import { CCombobox } from "@m/core/components/CCombobox";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { CComboboxDataView } from "@m/analysis/components/CComboboxDataView";
import { CComboboxMetric } from "@m/measurement/components/CComboboxMetric";

import {
  IDtoWidgetConfig,
  IDtoWidgetResponse,
} from "../interfaces/IDtoDashboard";

type WidgetType = IDtoWidgetConfig["type"];

export function CWidgetForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: IDtoWidgetResponse;
  onSubmit: (data: {
    index: number;
    column: number;
    config: IDtoWidgetConfig;
  }) => Promise<void>;
  onCancel?: () => void;
}) {
  const { t } = useTranslation();

  const index = initialData?.index || 0;
  const column = initialData?.column || 0;
  const inputType = useInput<WidgetType | undefined>(
    initialData?.config.type ?? "GRAPH_SEU_VALUE",
  );

  const initialSeuIds = useMemo(
    () =>
      initialData?.config.type === "GRAPH_SEU_VALUE" ||
      initialData?.config.type === "SEU_PIE_CHART"
        ? initialData.config.seuIds
        : [],
    [initialData],
  );
  const initialDataViewId = useMemo(
    () =>
      initialData?.config.type === "GRAPH_DATA_VIEW_VALUE"
        ? initialData.config.dataViewId
        : undefined,
    [initialData],
  );
  const initialRegressionResultId = useMemo(
    () =>
      initialData?.config.type === "GRAPH_ADVANCED_REGRESSION_RESULT"
        ? initialData.config.regressionResultId || undefined
        : undefined,
    [initialData],
  );

  const [useLatestResult, setUseLatestResult] = useState(
    initialData?.config.type === "GRAPH_ADVANCED_REGRESSION_RESULT"
      ? initialData.config.regressionResultId === null
      : true,
  );

  const initialMetricId = useMemo(
    () =>
      initialData?.config.type === "GRAPH_METRIC"
        ? initialData.config.metricId
        : undefined,
    [initialData],
  );

  const inputSeuIds = useInput(initialSeuIds);
  const inputDataViewId = useInput(initialDataViewId);
  const inputRegressionResultId = useInput(initialRegressionResultId);
  const inputMetricId = useInput(initialMetricId);

  useEffect(() => {
    if (useLatestResult) {
      const onChange = inputRegressionResultId.onChange;
      onChange(undefined);
    }
  }, [useLatestResult, inputRegressionResultId.onChange]);

  useEffect(() => {
    if (initialData?.config.type === inputType.value) {
      return;
    }
    const setSeuIds = inputSeuIds.onChange;
    const setDataViewId = inputDataViewId.onChange;
    const setRegressionResultId = inputRegressionResultId.onChange;
    const setMetricId = inputMetricId.onChange;
    setSeuIds([]);
    setDataViewId(undefined);
    setRegressionResultId(undefined);
    setUseLatestResult(true);
    setMetricId(undefined);
  }, [
    inputType.value,
    inputDataViewId.onChange,
    inputRegressionResultId.onChange,
    inputSeuIds.onChange,
    inputMetricId.onChange,
    initialData?.config.type,
  ]);

  const WIDGET_TYPES = useMemo(
    () => [
      {
        value: "GRAPH_SEU_VALUE" as const,
        label: t("seuValues"),
      },
      {
        value: "GRAPH_DATA_VIEW_VALUE" as const,
        label: t("dataViewValues"),
      },
      {
        value: "GRAPH_ADVANCED_REGRESSION_RESULT" as const,
        label: t("regressionResult"),
      },
      {
        value: "GRAPH_METRIC" as const,
        label: t("metricValues"),
      },
      {
        value: "ENERGY_POLICY" as const,
        label: t("energyPolicies"),
      },
      {
        value: "SEU_PIE_CHART" as const,
        label: t("seuTotalConsumptionPieChart"),
      },
      {
        value: "ENERGY_RESOURCE_PIE_CHART" as const,
        label: t("energyConsumptionPieChart"),
      },
    ],
    [t],
  );

  const invalidBase = useInputInvalid(inputType);
  const invalidSeuForm = useInputInvalid(inputSeuIds);
  const invalidDataViewForm = useInputInvalid(inputDataViewId);
  const invalidRegressionResultForm = useInputInvalid(inputRegressionResultId);
  const invalidMetricForm = useInputInvalid(inputMetricId);

  const invalid = useMemo(() => {
    if (invalidBase) {
      return true;
    }

    switch (inputType.value) {
      case "GRAPH_SEU_VALUE":
      case "SEU_PIE_CHART":
        return invalidSeuForm;
      case "GRAPH_DATA_VIEW_VALUE":
        return invalidDataViewForm;
      case "GRAPH_ADVANCED_REGRESSION_RESULT":
        return invalidRegressionResultForm;
      case "GRAPH_METRIC":
        return invalidMetricForm;
      case "ENERGY_POLICY":
      case "ENERGY_RESOURCE_PIE_CHART":
        return false;
      case undefined:
      default:
        return true;
    }
  }, [
    inputType.value,
    invalidBase,
    invalidDataViewForm,
    invalidRegressionResultForm,
    invalidSeuForm,
    invalidMetricForm,
  ]);

  const handleSubmit = useCallback(async () => {
    if (invalid || !inputType.value) {
      return;
    }

    let config: IDtoWidgetConfig;
    switch (inputType.value) {
      case "GRAPH_SEU_VALUE":
        config = {
          type: "GRAPH_SEU_VALUE",
          seuIds: inputSeuIds.value || [],
        };
        break;
      case "SEU_PIE_CHART":
        config = {
          type: "SEU_PIE_CHART",
          seuIds: inputSeuIds.value || [],
        };
        break;
      case "GRAPH_DATA_VIEW_VALUE":
        if (!inputDataViewId.value) {
          return;
        }
        config = {
          type: "GRAPH_DATA_VIEW_VALUE",
          dataViewId: inputDataViewId.value,
        };
        break;
      case "GRAPH_ADVANCED_REGRESSION_RESULT":
        config = {
          type: "GRAPH_ADVANCED_REGRESSION_RESULT",
          regressionResultId: inputRegressionResultId.value || null,
        };
        break;
      case "ENERGY_POLICY":
        config = {
          type: "ENERGY_POLICY",
        };
        break;
      case "ENERGY_RESOURCE_PIE_CHART":
        config = {
          type: "ENERGY_RESOURCE_PIE_CHART",
        };
        break;
      case "GRAPH_METRIC":
        config = {
          type: "GRAPH_METRIC",
          metricId: inputMetricId.value || "",
        };
        break;
      default:
        return;
    }

    await onSubmit({
      index,
      config,
      column,
    });
  }, [
    invalid,
    index,
    column,
    inputType.value,
    inputSeuIds.value,
    inputDataViewId.value,
    inputRegressionResultId.value,
    inputMetricId.value,
    onSubmit,
  ]);

  const renderConfigFields = () => {
    switch (inputType.value) {
      case "GRAPH_SEU_VALUE":
      case "SEU_PIE_CHART":
        return (
          <CFormLine
            label={t("significantEnergyUsers")}
            invalidMsg={inputSeuIds.invalidMsg}
          >
            <CMultiSelectSeu {...inputSeuIds} required />
          </CFormLine>
        );

      case "GRAPH_DATA_VIEW_VALUE":
        return (
          <CFormLine
            label={t("dataViews")}
            invalidMsg={inputDataViewId.invalidMsg}
          >
            <CComboboxDataView {...inputDataViewId} required />
          </CFormLine>
        );

      case "GRAPH_ADVANCED_REGRESSION_RESULT":
        return (
          <>
            <CFormLine
              label={t("regressionResult")}
              invalidMsg={inputRegressionResultId.invalidMsg}
            >
              <div className="space-y-2">
                <CCheckbox
                  label={t("useLatestResult")}
                  selected={useLatestResult}
                  onChange={setUseLatestResult}
                />
                <CComboboxRegressionResult
                  {...inputRegressionResultId}
                  disabled={useLatestResult}
                  required
                />
              </div>
            </CFormLine>
          </>
        );

      case "GRAPH_METRIC":
        return (
          <CFormLine label={t("metrics")} invalidMsg={inputMetricId.invalidMsg}>
            <CComboboxMetric {...inputMetricId} required />
          </CFormLine>
        );

      case "ENERGY_POLICY":
      case "ENERGY_RESOURCE_PIE_CHART":
      case undefined:
      default:
        return null;
    }
  };

  return (
    <div className="px-5 py-3">
      <CForm onSubmit={handleSubmit}>
        <CFormPanel>
          <CFormLine label={t("widgetType")} invalidMsg={inputType.invalidMsg}>
            <CCombobox {...inputType} list={WIDGET_TYPES} required />
          </CFormLine>

          {renderConfigFields()}

          <CFormFooterSaveUpdate
            isUpdate={Boolean(initialData)}
            disabled={invalid}
            onCancel={onCancel}
          />
        </CFormPanel>
      </CForm>
    </div>
  );
}
