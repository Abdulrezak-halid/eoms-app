import { IUnit } from "common";
import { FileUp, HardDriveDownload, Save, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { useParams } from "wouter";

import exampleMetricDataXlsxUrl from "@/modules/measurement/assets/example_metric_data.xlsx?url";
import exampleMetricDataDraftXlsxUrl from "@/modules/measurement/assets/example_metric_file_draft.xlsx?url";

import { Api } from "@m/base/api/Api";
import { CComboboxTimezone } from "@m/base/components/CComboboxTimezone";
import { CComboboxUnit } from "@m/base/components/CComboboxUnit";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { getCurrentTimezone } from "@m/base/hooks/useTimezoneList";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CButton } from "@m/core/components/CButton";
import { CExternalLink } from "@m/core/components/CExternalLink";
import { CForm } from "@m/core/components/CForm";
import {
  CFormFooter,
  CFormLine,
  CFormPanel,
} from "@m/core/components/CFormPanel";
import { CFormTitle } from "@m/core/components/CFormTitle";
import { CHr } from "@m/core/components/CHr";
import { CInputFile } from "@m/core/components/CInputFile";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useLoader } from "@m/core/hooks/useLoader";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  EXCEL_ACCEPT,
  MAX_FILE_SIZE,
} from "../constants/MetricValueExcelImport";
import { IDtoMetricResponse } from "../interfaces/IDtoMetric";
import { CMetricFileDraftTable } from "./CMetricFileDraftTable";

export function CMetricValueExcelImportForm({
  record,
}: {
  record: IDtoMetricResponse;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const apiToast = useApiToast();
  const { id: metricId } = useParams<{ id: string }>();

  const inputFile = useInput<File[]>([]);
  const inputUnit = useInput<IUnit | undefined>(undefined);
  const inputTimezone = useInput<string | undefined>(getCurrentTimezone());

  const draftFetcher = useCallback(
    () =>
      Api.GET("/u/measurement/metric/file-draft/item/{id}", {
        params: { path: { id: metricId } },
      }),
    [metricId],
  );

  const [draftData, draftLoad] = useLoader(draftFetcher);

  const invalid = useInputInvalid(inputFile);

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      inputFile.value.length === 0 ||
      !metricId ||
      !inputTimezone.value
    ) {
      return;
    }

    const res = await Api.PUT(
      "/u/measurement/metric/file-draft/item/{id}/upload",
      {
        params: { path: { id: metricId } },
        body: {
          file: "",
          tz: inputTimezone.value,
        },

        bodySerializer(data) {
          const fd = new FormData();
          fd.append("file", inputFile.value[0]);
          fd.append("tz", String(data.tz));
          return fd;
        },
      },
    );

    apiToast(res);

    if (!res.error) {
      await draftLoad();
    }
  }, [
    invalid,
    inputFile.value,
    metricId,
    inputTimezone.value,
    apiToast,
    draftLoad,
  ]);

  const handleDraftSave = useCallback(async () => {
    if (!inputUnit.value) {
      return;
    }

    const res = await Api.POST(
      "/u/measurement/metric/file-draft/item/{id}/save",
      {
        params: { path: { id: metricId } },
        body: {
          unit: inputUnit.value,
        },
      },
    );

    apiToast(res);

    if (!res.error) {
      navigate(`/measurements/metric/values/graph/${metricId}`);
    }
  }, [metricId, inputUnit.value, apiToast, navigate]);

  const handleDraftDiscard = useCallback(async () => {
    const res = await Api.POST(
      "/u/measurement/metric/file-draft/item/{id}/cancel",
      { params: { path: { id: metricId } } },
    );

    apiToast(res);

    if (!res.error) {
      inputFile.setValue([]);
      await draftLoad();
    }
  }, [metricId, apiToast, inputFile, draftLoad]);

  return (
    <div className="space-y-4">
      <CForm onSubmit={handleSubmit}>
        <CFormPanel>
          <CFormLine label={t("templates")}>
            <div className="flex gap-2">
              <CExternalLink
                icon={HardDriveDownload}
                iconRight={null}
                href={exampleMetricDataXlsxUrl}
                label={t("simpleMetric")}
                download="example_metric_data"
              />
              <CExternalLink
                icon={HardDriveDownload}
                iconRight={null}
                href={exampleMetricDataDraftXlsxUrl}
                label={t("metricWithLabels")}
                download="example_metric_data_draft"
              />
            </div>
          </CFormLine>

          <CFormLine label={t("excelFile")} invalidMsg={inputFile.invalidMsg}>
            <CInputFile
              {...inputFile}
              placeholder={t("selectExcelFile")}
              accept={EXCEL_ACCEPT}
              maxSize={MAX_FILE_SIZE}
              multiple={false}
              required
            />
          </CFormLine>

          <CFormLine
            label={t("timezone")}
            invalidMsg={inputTimezone.invalidMsg}
          >
            <CComboboxTimezone {...inputTimezone} required />
          </CFormLine>

          <CFormFooter>
            <CButton
              submit
              disabled={invalid}
              icon={FileUp}
              label={t("uploadAndPreview")}
            />
          </CFormFooter>
        </CFormPanel>
      </CForm>

      <CAsyncLoader data={draftData} hideOnNotFound>
        {(payload) => (
          <div className="space-y-2">
            <CFormPanel>
              <div>
                <CFormTitle value={t("draftPreview")} />
                <CMetricFileDraftTable content={payload.content} />
              </div>

              <CFormLine label={t("unit")} invalidMsg={inputUnit.invalidMsg}>
                <CComboboxUnit
                  {...inputUnit}
                  required
                  unitGroup={record.unitGroup}
                />
              </CFormLine>

              <CHr />

              <div className="flex justify-end space-x-2">
                <CButton
                  icon={Trash2}
                  label={t("discardDraft")}
                  onClick={handleDraftDiscard}
                />
                <CButton
                  label={t("save")}
                  primary
                  icon={Save}
                  onClick={handleDraftSave}
                  disabled={!inputUnit.value}
                />
              </div>
            </CFormPanel>
          </div>
        )}
      </CAsyncLoader>
    </div>
  );
}
