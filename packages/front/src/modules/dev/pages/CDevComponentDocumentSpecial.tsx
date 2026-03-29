import { IUnit, IUnitGroup } from "common";
import {
  IDtoEDocumentApprovementStatus,
  IDtoEEnergyResource,
  IDtoEInboundIntegrationType,
  IDtoEJobName,
  IDtoEMetricIntegrationPeriod,
  IDtoEMetricResourceValuePeriod,
  IDtoEMetricType,
  IDtoEOrganizationPlanFeature,
  IDtoEOutboundIntegrationType,
  IDtoEPeriod,
  IDtoEQdmsIntegrationBindingPage,
  IDtoMetricResource,
  IDtoMetricResourceLabel,
  IDtoPlainOrTranslatableText,
} from "common/build-api-schema";
import { useMemo, useState } from "react";

import { CBadgeAgent } from "@m/agent-management/components/CBadgeAgent";
import { CBadgeAgentStatus } from "@m/agent-management/components/CBadgeAgentStatus";
import { CComboboxAssignedAgent } from "@m/agent-management/components/CComboboxAssignedAgent";
import { CComboboxEnPi } from "@m/analysis/components/CComboboxEnPi";
import { CComboboxRegressionResult } from "@m/analysis/components/CComboboxRegressionResult";
import { CBadgeApprovementStatus } from "@m/base/components/CBadgeApprovementStatus";
import { CBadgeCity } from "@m/base/components/CBadgeCity";
import { CBadgeDepartment } from "@m/base/components/CBadgeDepertment";
import { CBadgeEnabled } from "@m/base/components/CBadgeEnabled";
import { CBadgeEnergyResource } from "@m/base/components/CBadgeEnergyResource";
import { CBadgeNotConfigured } from "@m/base/components/CBadgeNotConfigured";
import { CBadgePeriod } from "@m/base/components/CBadgePeriod";
import { CBadgeSeu } from "@m/base/components/CBadgeSeu";
import { CBadgeUnit } from "@m/base/components/CBadgeUnit";
import { CBadgeUnitGroup } from "@m/base/components/CBadgeUnitGroup";
import { CBadgeUser } from "@m/base/components/CBadgeUser";
import { CBadgeYesNo } from "@m/base/components/CBadgeYesNo";
import { CBody } from "@m/base/components/CBody";
import { CComboboxCity } from "@m/base/components/CComboboxCity";
import { CComboboxDepartment } from "@m/base/components/CComboboxDepartment";
import { CComboboxDocumentApprovementStatus } from "@m/base/components/CComboboxDocumentApprovementStatus";
import { CComboboxEnergyResource } from "@m/base/components/CComboboxEnergyResource";
import { CComboboxJobHandler } from "@m/base/components/CComboboxJobHandler";
import { CComboboxOrganizationEnergyResource } from "@m/base/components/CComboboxOrganizationEnergyResource";
import { CComboboxPeriod } from "@m/base/components/CComboboxPeriod";
import { CComboboxUnit } from "@m/base/components/CComboboxUnit";
import { CComboboxUnitGroup } from "@m/base/components/CComboboxUnitGroup";
import { CComboboxUser } from "@m/base/components/CComboboxUser";
import { CDisplayEnergyValue } from "@m/base/components/CDisplayEnergyValue";
import { CMultiSelectDepartment } from "@m/base/components/CMultiSelectDepartment";
import { CMultiSelectEnergyResource } from "@m/base/components/CMultiSelectEnergyResource";
import { CMultiSelectOrganizationEnergyResource } from "@m/base/components/CMultiSelectOrganizationEnergyResource";
import { CMultiSelectSeu } from "@m/base/components/CMultiSelectSeu";
import { CMultiSelectUser } from "@m/base/components/CMultiSelectUser";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CBadgeQdmsIntegrationBindingPage } from "@m/document-management/components/CBadgeQdmsIntegrationBindingPage";
import { CComboboxQdmsIntegrationBindingPage } from "@m/document-management/components/CComboboxQdmsIntegrationBindingPage";
import { CMultiSelectNonconformity } from "@m/internal-audit/components/CMultiSelectNonconformity";
import { CBadgeInboundIntegrationType } from "@m/measurement/components/CBadgeInboundIntegrationType";
import { CBadgeIndexSuccess } from "@m/measurement/components/CBadgeIndexSuccess";
import { CBadgeMeter } from "@m/measurement/components/CBadgeMeter";
import { CBadgeMeterSlice } from "@m/measurement/components/CBadgeMeterSlice";
import { CBadgeMetric } from "@m/measurement/components/CBadgeMetric";
import { CBadgeMetricIntegrationPeriod } from "@m/measurement/components/CBadgeMetricIntegrationPeriod";
import { CBadgeMetricResource } from "@m/measurement/components/CBadgeMetricResource";
import { CBadgeMetricResourceLabel } from "@m/measurement/components/CBadgeMetricResourceLabel";
import { CBadgeMetricResourceLabelSet } from "@m/measurement/components/CBadgeMetricResourceLabelSet";
import { CBadgeMetricResourceValuePeriod } from "@m/measurement/components/CBadgeMetricResourceValuePeriod";
import { CBadgeMetricType } from "@m/measurement/components/CBadgeMetricType";
import { CBadgeOutboundIntegrationType } from "@m/measurement/components/CBadgeOutboundIntegrationType";
import { CComboboxDataView } from "@m/measurement/components/CComboboxDataView";
import { CComboboxDataViewType } from "@m/measurement/components/CComboboxDataViewType";
import { CComboboxInboundIntegrationType } from "@m/measurement/components/CComboboxInboundIntegrationType";
import { CComboboxMeter } from "@m/measurement/components/CComboboxMeter";
import { CComboboxMeterSlice } from "@m/measurement/components/CComboboxMeterSlice";
import { CComboboxMetric } from "@m/measurement/components/CComboboxMetric";
import { CComboboxMetricIntegrationPeriod } from "@m/measurement/components/CComboboxMetricIntegrationPeriod";
import { CComboboxMetricResource } from "@m/measurement/components/CComboboxMetricResource";
import {
  CComboboxMetricResourceValuePeriod,
  IDtoEMetricResourceValuePeriodWithRaw,
} from "@m/measurement/components/CComboboxMetricResourceValuePeriod";
import { CComboboxMetricType } from "@m/measurement/components/CComboboxMetricType";
import { CComboboxOutboundIntegrationType } from "@m/measurement/components/CComboboxOutboundIntegrationType";
import { CComboboxSeu } from "@m/measurement/components/CComboboxSeu";
import { CComboboxWeatherApiOutputType } from "@m/measurement/components/CComboboxWeatherApiOutboundType";
import { CMetricResourceSelector } from "@m/measurement/components/CMetricResourceSelector";
import { CMultiSelectMeter } from "@m/measurement/components/CMultiSelectMeter";
import { CMultiSelectMeterSlice } from "@m/measurement/components/CMultiSelectMeterSlice";
import { CMultiSelectMetric } from "@m/measurement/components/CMultiSelectMetric";
import { CMultiSelectMetricResource } from "@m/measurement/components/CMultiSelectMetricResource";
import { IDtoEDataViewType } from "@m/measurement/interfaces/IDtoDataViewProfile";
import { IWeatherApiOutputType } from "@m/measurement/interfaces/IWeatherApiOutputType";
import { CBadgeMessageQueueTaskStatus } from "@m/report/components/CBadgeMessageQueueTaskStatus";
import { CComboboxReportSectionType } from "@m/report/components/CComboboxReportSectionType";
import { CInputStringPlainOrTranslatable } from "@m/report/components/CInputStringPlainOrTranslatable";
import { CMultiSelectReportFile } from "@m/report/components/CMultiSelectReportFile";
import { IDtoReportSectionType } from "@m/report/interfaces/IDtoReport";
import { CComboboxOrganization } from "@m/sys/components/CComboboxOrganization";
import { CMultiSelectPlanFeature } from "@m/sys/components/CMultiSelectPlanFeature";

import { CDevComponentLine, CDevComponentPanel } from "./CDevComponentPanel";

export function CDevComponentDocumentSpecial() {
  const [selectedEnergyResource, setSelectedEnergyResource] = useState<
    IDtoEEnergyResource | undefined
  >("ELECTRIC");
  const [selectedPeriod, setSelectedPeriod] = useState<IDtoEPeriod | undefined>(
    "MONTHLY",
  );
  const [selectedApprovementStatus, setselectedApprovementStatus] = useState<
    IDtoEDocumentApprovementStatus | undefined
  >("APPROVED");
  const [selectedJobHandler, setSelectedJobHandler] = useState<IDtoEJobName>();
  const [selectedOutboundType, setSelectedOutboundType] =
    useState<IDtoEOutboundIntegrationType>();
  const [selectedInboundType, setSelectedInboundType] =
    useState<IDtoEInboundIntegrationType>();
  const [selectedDepartment, setSelectedDepartment] = useState<string>();
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string[]>([]);
  const [selectedSeu, setSelectedSeu] = useState<string>();
  const [selectedSeus, setSelectedSeus] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedNonconformities, setSelectedNonconformities] = useState<
    string[]
  >([]);
  const [selectEnergyResource, setSelectEnergyResource] = useState<
    IDtoEEnergyResource[]
  >([]);
  const [selectPlanFeature, setSelectPlanFeature] = useState<
    IDtoEOrganizationPlanFeature[]
  >([]);
  const [selectedUnit, setSelectedUnit] = useState<IUnit | undefined>("PIECE");
  const [selectedFiltredUnit, setSelectedFiltredUnit] = useState<
    IUnit | undefined
  >("ENERGY_KWH");
  const [selectedUnitGroup, setSelectedUnitGroup] = useState<
    IUnitGroup | undefined
  >("ENERGY");
  const [selectedMeter, setSelectedMeter] = useState<string>();
  const [selectedMetric, setSelectedMetric] = useState<string>();
  const [selectedMeters, setSelectedMeters] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedMetricType, setSelectedMetricType] =
    useState<IDtoEMetricType>();
  const [selectMetricResourceValuePeriod, setSelectMetricResourceValuePeriod] =
    useState<IDtoEMetricResourceValuePeriod>();
  const [
    selectMetricResourceValuePeriodWithRaw,
    setSelectMetricResourceValuePeriodWithRaw,
  ] = useState<IDtoEMetricResourceValuePeriodWithRaw>();
  const [selectMetricIntegrationPeriod, setSelectMetricIntegrationPeriod] =
    useState<IDtoEMetricIntegrationPeriod>();
  const [selectedMetricResource, setSelectedMetricResource] =
    useState<string>();
  const [selectedMetricResources, setSelectedMetricResources] = useState<
    string[]
  >([]);
  const [selectedCity, setSelectedCity] = useState<string>();
  const [selectedOrganization, setSelectedOrganization] = useState<string>();
  const [selectedEnPi, setSelectedEnPi] = useState<string>();
  const [selectedDataView, setSelectedDataView] = useState<string>();

  const [selectedMeteorologytype, setSelectedMeteorologytype] =
    useState<IWeatherApiOutputType>();

  const [
    selectedOrganizationEnergyResources,
    setSelectedOrganizationEnergyResources,
  ] = useState<IDtoEEnergyResource>();

  const [
    selectedOrganizationEnergyResource,
    setSelectedOrganizationEnergyResource,
  ] = useState<IDtoEEnergyResource[]>([]);
  const [selectedMeterSlices1, setSelectedMeterSlices1] = useState<string[]>(
    [],
  );
  const [selectedMeterSlices2, setSelectedMeterSlices2] = useState<string[]>(
    [],
  );
  const [selectedMeterSlices3, setSelectedMeterSlices3] = useState<string[]>(
    [],
  );
  const [selectedMeterSlice1, setSelectedMeterSlice1] = useState<string>();
  const [selectedMeterSlice2, setSelectedMeterSlice2] = useState<string>();
  const [selectedMeterSlice3, setSelectedMeterSlice3] = useState<string>();

  const [selectedViewType, setSelectedViewType] = useState<IDtoEDataViewType>();
  const [selectedRegressionResult, setSelectedRegressionResult] =
    useState<string>();

  const [selectedMetricResourcesSelector, setSelectedMetricResourcesSelector] =
    useState<string[]>();

  const [
    selectedQdmsIntenrationBindingPage,
    setSelectedQdmsIntenrationBindingPage,
  ] = useState<IDtoEQdmsIntegrationBindingPage | undefined>("DESIGNS");

  const [selectedAgentId, setSelectedAgentId] = useState<string>();

  const [sectionType, setSectionType] = useState<IDtoReportSectionType>();

  const [plainText, setPlainText] = useState<IDtoPlainOrTranslatableText>({
    type: "PLAIN",
    value: "This is plain text",
  });

  const [translatedText, setTranslatedText] =
    useState<IDtoPlainOrTranslatableText>({
      type: "TRANSLATED",
      value: "consumption",
    });
  const defaultTranslatedText = useMemo<IDtoPlainOrTranslatableText>(
    () => ({
      type: "TRANSLATED",
      value: "consumption",
    }),
    [],
  );
  const [translatedText2, setTranslatedText2] =
    useState<IDtoPlainOrTranslatableText>();

  const [emptyText, setEmptyText] = useState<IDtoPlainOrTranslatableText>({
    type: "PLAIN",
    value: "",
  });

  const [multilineText, setMultilineText] =
    useState<IDtoPlainOrTranslatableText>({
      type: "PLAIN",
      value: "Line 1\nLine 2\nLine 3",
    });

  const metricResourcesLabelSets = useMemo<IDtoMetricResourceLabel[][]>(
    () => [
      [
        {
          type: "INTERNAL",
          key: "SOURCE",
          value: "EXCEL",
        },
        {
          type: "INTERNAL",
          key: "SOURCE",
          value: "DEV_SEED",
        },
      ],
      [
        {
          type: "INTERNAL",
          key: "SOURCE",
          value: "INBOUND_INTEGRATION",
        },
        {
          type: "INTERNAL",
          key: "INBOUND_INTEGRATION_TYPE",
          value: "AGENT",
        },
      ],
      [
        {
          type: "INTERNAL",
          key: "SOURCE",
          value: "OUTBOUND_INTEGRATION",
        },
        {
          type: "INTERNAL",
          key: "OUTBOUND_INTEGRATION_TYPE",
          value: "MOCK_SOURCE",
        },
      ],
      [
        {
          type: "USER_DEFINED",
          key: "User Key",
          value: "User Value",
        },
      ],
    ],
    [],
  );

  const metricResources = useMemo<IDtoMetricResource[]>(
    () =>
      metricResourcesLabelSets.map((d) => ({
        id: "",
        metric: {
          id: "",
          name: "Test Metric",
          type: "GAUGE",
          unitGroup: "TEMPERATURE",
        },
        labels: d,
      })),
    [metricResourcesLabelSets],
  );

  return (
    <CBody title="Dev - Special Components">
      <CDevComponentPanel>
        <CDevComponentLine label="CComboboxDepartment">
          <CComboboxDepartment
            value={selectedDepartment}
            onChange={setSelectedDepartment}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxUser">
          <CComboboxUser value={selectedUser} onChange={setSelectedUser} />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxSeu">
          <CComboboxSeu value={selectedSeu} onChange={setSelectedSeu} />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxSeu (with Energy Resource Filter)">
          <CComboboxSeu
            filterByEnergyResource={"ELECTRIC"}
            value={selectedSeu}
            onChange={setSelectedSeu}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxEnergyResource">
          <CComboboxEnergyResource
            value={selectedEnergyResource}
            onChange={setSelectedEnergyResource}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxPeriod">
          <CComboboxPeriod
            value={selectedPeriod}
            onChange={setSelectedPeriod}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxDocumentApprovementStatus">
          <CComboboxDocumentApprovementStatus
            value={selectedApprovementStatus}
            onChange={setselectedApprovementStatus}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxUnit">
          <CComboboxUnit value={selectedUnit} onChange={setSelectedUnit} />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxUnit (Filtered By Unit Group)">
          <CComboboxUnit
            value={selectedFiltredUnit}
            unitGroup={"ENERGY"}
            onChange={setSelectedFiltredUnit}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxUnitGroup">
          <CComboboxUnitGroup
            value={selectedUnitGroup}
            onChange={setSelectedUnitGroup}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxUnitGroup (With Filter List)">
          <CComboboxUnitGroup
            value={selectedUnitGroup}
            onChange={setSelectedUnitGroup}
            unitGroups={["ENERGY", "VOLUME"]}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxJobHandler">
          <CComboboxJobHandler
            value={selectedJobHandler}
            onChange={setSelectedJobHandler}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxOutboundIntegrationType">
          <CComboboxOutboundIntegrationType
            value={selectedOutboundType}
            onChange={setSelectedOutboundType}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxInboundIntegrationType">
          <CComboboxInboundIntegrationType
            value={selectedInboundType}
            onChange={setSelectedInboundType}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxMeter">
          <CComboboxMeter value={selectedMeter} onChange={setSelectedMeter} />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxCity">
          <CComboboxCity value={selectedCity} onChange={setSelectedCity} />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxCity (searchable)">
          <CComboboxCity
            value={selectedCity}
            onChange={setSelectedCity}
            searchable
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxMetric">
          <CComboboxMetric
            value={selectedMetric}
            onChange={setSelectedMetric}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxMetric (type: COUNTER)">
          <CComboboxMetric
            value={selectedMetric}
            onChange={setSelectedMetric}
            type="COUNTER"
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxMetric (unitGroup: ENERGY)">
          <CComboboxMetric
            value={selectedMetric}
            onChange={setSelectedMetric}
            unitGroup="ENERGY"
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxMetric (excludeUnitGroup: ENERGY)">
          <CComboboxMetric
            value={selectedMetric}
            onChange={setSelectedMetric}
            excludeUnitGroup="ENERGY"
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxMetricType">
          <CComboboxMetricType
            value={selectedMetricType}
            onChange={setSelectedMetricType}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxMetricResource">
          <CComboboxMetricResource
            metricId={selectedMetric}
            value={selectedMetricResource}
            onChange={setSelectedMetricResource}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxMetricResource (listWithMetrics)">
          <CComboboxMetricResource
            listWithMetrics
            value={selectedMetricResource}
            onChange={setSelectedMetricResource}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxMetricResource (listWithMetrics metricType: COUNTER)">
          <CComboboxMetricResource
            listWithMetrics
            metricType="COUNTER"
            value={selectedMetricResource}
            onChange={setSelectedMetricResource}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxOrganizationEnergyResource">
          <CComboboxOrganizationEnergyResource
            value={selectedOrganizationEnergyResources}
            onChange={setSelectedOrganizationEnergyResources}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxMetricResourceValuePeriod">
          <CComboboxMetricResourceValuePeriod
            value={selectMetricResourceValuePeriod}
            onChange={setSelectMetricResourceValuePeriod}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxMetricResourceValuePeriod (includeRaw)">
          <CComboboxMetricResourceValuePeriod
            value={selectMetricResourceValuePeriodWithRaw}
            onChange={setSelectMetricResourceValuePeriodWithRaw}
            includeRaw
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxMetricIntegrationPeriod">
          <CComboboxMetricIntegrationPeriod
            value={selectMetricIntegrationPeriod}
            onChange={setSelectMetricIntegrationPeriod}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMetricResourceSelector">
          <CMetricResourceSelector
            value={selectedMetricResourcesSelector}
            onChange={setSelectedMetricResourcesSelector}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMetricResourceSelector (metricType: GAUGE)">
          <CMetricResourceSelector
            metricType="GAUGE"
            value={selectedMetricResourcesSelector}
            onChange={setSelectedMetricResourcesSelector}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMetricResourceSelector (metricType: COUNTER)">
          <CMetricResourceSelector
            metricType="COUNTER"
            value={selectedMetricResourcesSelector}
            onChange={setSelectedMetricResourcesSelector}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMetricResourceSelector (required)">
          <CMetricResourceSelector
            required
            value={selectedMetricResourcesSelector}
            onChange={setSelectedMetricResourcesSelector}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxMeterSlice (energyResource: ELECTRIC)">
          <CComboboxMeterSlice
            energyResource={"ELECTRIC"}
            value={selectedMeterSlice1}
            onChange={setSelectedMeterSlice1}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxMeterSlice (allEnergyResources)">
          <CComboboxMeterSlice
            allEnergyResources
            value={selectedMeterSlice2}
            onChange={setSelectedMeterSlice2}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxMeterSlice (disabled - no energy resource)">
          <CComboboxMeterSlice
            value={selectedMeterSlice3}
            onChange={setSelectedMeterSlice3}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxMeterSlice (includeMains)">
          <CComboboxMeterSlice allEnergyResources includeMains />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxMeteorologyOutputType">
          <CComboboxWeatherApiOutputType
            value={selectedMeteorologytype}
            onChange={setSelectedMeteorologytype}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxDataViewType">
          <CComboboxDataViewType
            value={selectedViewType}
            onChange={setSelectedViewType}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxOrganization">
          <CComboboxOrganization
            value={selectedOrganization}
            onChange={setSelectedOrganization}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxEnPi">
          <CComboboxEnPi value={selectedEnPi} onChange={setSelectedEnPi} />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxDataView">
          <CComboboxDataView
            value={selectedDataView}
            onChange={setSelectedDataView}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxRegressionResult">
          <CComboboxRegressionResult
            value={selectedRegressionResult}
            onChange={setSelectedRegressionResult}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxQdmsIntegrationBindingPage">
          <CComboboxQdmsIntegrationBindingPage
            value={selectedQdmsIntenrationBindingPage}
            onChange={setSelectedQdmsIntenrationBindingPage}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxAssignedAgent">
          <CComboboxAssignedAgent
            value={selectedAgentId}
            onChange={setSelectedAgentId}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CComboboxReportSectionType">
          <CComboboxReportSectionType
            value={sectionType}
            onChange={setSectionType}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMultiSelectDepartment">
          <CMultiSelectDepartment
            value={selectedDepartments}
            onChange={setSelectedDepartments}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMultiSelectSeu">
          <CMultiSelectSeu value={selectedSeus} onChange={setSelectedSeus} />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMultiSelectSeu (with Energy Resource Filter)">
          <CMultiSelectSeu
            filterByEnergyResource={"ELECTRIC"}
            value={selectedSeus}
            onChange={setSelectedSeus}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMultiSelectUser">
          <CMultiSelectUser value={selectedUsers} onChange={setSelectedUsers} />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMultiSelectNonconformity">
          <CMultiSelectNonconformity
            value={selectedNonconformities}
            onChange={setSelectedNonconformities}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMultiSelectEnergyResource">
          <CMultiSelectEnergyResource
            value={selectEnergyResource}
            onChange={setSelectEnergyResource}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMultiSelectPlanFeature">
          <CMultiSelectPlanFeature
            value={selectPlanFeature}
            onChange={setSelectPlanFeature}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMultiSelectMeter">
          <CMultiSelectMeter
            value={selectedMeters}
            onChange={setSelectedMeters}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMultiSelectMetric">
          <CMultiSelectMetric
            value={selectedMetrics}
            onChange={setSelectedMetrics}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMultiSelectMetric (type: COUNTER)">
          <CMultiSelectMetric
            value={selectedMetrics}
            onChange={setSelectedMetrics}
            type="COUNTER"
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMultiSelectMetric (unitGroup: ENERGY)">
          <CMultiSelectMetric
            value={selectedMetrics}
            onChange={setSelectedMetrics}
            unitGroup="ENERGY"
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMultiSelectMetric (excludeUnitGroup: ENERGY)">
          <CMultiSelectMetric
            value={selectedMetrics}
            onChange={setSelectedMetrics}
            excludeUnitGroup="ENERGY"
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMultiSelectMetricResource">
          <CMultiSelectMetricResource
            metricId={selectedMetric}
            value={selectedMetricResources}
            onChange={setSelectedMetricResources}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMultiSelectMetricResource (listWithMetrics)">
          <CMultiSelectMetricResource
            listWithMetrics
            value={selectedMetricResources}
            onChange={setSelectedMetricResources}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMultiSelectMetricResource (listWithMetrics metricType: COUNTER)">
          <CMultiSelectMetricResource
            listWithMetrics
            metricType="COUNTER"
            value={selectedMetricResources}
            onChange={setSelectedMetricResources}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMultiSelectOrganizationEnergyResource">
          <CMultiSelectOrganizationEnergyResource
            value={selectedOrganizationEnergyResource}
            onChange={setSelectedOrganizationEnergyResource}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMultiSelectMeterSlice (energyResource: ELECTRIC)">
          <CMultiSelectMeterSlice
            energyResource={"ELECTRIC"}
            value={selectedMeterSlices1}
            onChange={setSelectedMeterSlices1}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMultiSelectMeterSlice (allEnergyResources)">
          <CMultiSelectMeterSlice
            allEnergyResources
            value={selectedMeterSlices2}
            onChange={setSelectedMeterSlices2}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMultiSelectMeterSlice (disabled - no energy resource)">
          <CMultiSelectMeterSlice
            value={selectedMeterSlices3}
            onChange={setSelectedMeterSlices3}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMultiSelectMeterSlice (includeMains)">
          <CMultiSelectMeterSlice allEnergyResources includeMains />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CMultiSelectReportFile">
          <CMultiSelectReportFile
            value={selectedFile}
            onChange={setSelectedFile}
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CInputStringPlainOrTranslatable - PLAIN">
          <CInputStringPlainOrTranslatable
            value={plainText}
            onChange={setPlainText}
            placeholder="Enter text"
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CInputStringPlainOrTranslatable - TRANSLATED">
          <CInputStringPlainOrTranslatable
            value={translatedText}
            onChange={setTranslatedText}
            placeholder="Enter text"
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CInputStringPlainOrTranslatable - defaultValue">
          <CInputStringPlainOrTranslatable
            value={translatedText2}
            defaultValue={defaultTranslatedText}
            onChange={setTranslatedText2}
            placeholder="Enter text"
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CInputStringPlainOrTranslatable - Empty">
          <CInputStringPlainOrTranslatable
            value={emptyText}
            onChange={setEmptyText}
            placeholder="Enter text"
            required
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CInputStringPlainOrTranslatable - Disabled">
          <CInputStringPlainOrTranslatable
            value={translatedText}
            onChange={setTranslatedText}
            disabled
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CInputStringPlainOrTranslatable - multiline - PLAIN">
          <CInputStringPlainOrTranslatable
            value={multilineText}
            onChange={setMultilineText}
            placeholder="Enter text"
            multiline
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CInputStringPlainOrTranslatable - multiline - TRANSLATED">
          <CInputStringPlainOrTranslatable
            value={translatedText}
            onChange={setTranslatedText}
            placeholder="Enter text"
            multiline
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CInputStringPlainOrTranslatable - multiline - defaultValue">
          <CInputStringPlainOrTranslatable
            value={translatedText2}
            defaultValue={defaultTranslatedText}
            onChange={setTranslatedText2}
            placeholder="Enter text"
            multiline
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CInputStringPlainOrTranslatable - multiline - Empty">
          <CInputStringPlainOrTranslatable
            value={emptyText}
            onChange={setEmptyText}
            placeholder="Enter text"
            multiline
            required
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CInputStringPlainOrTranslatable - multiline - Disabled">
          <CInputStringPlainOrTranslatable
            value={translatedText}
            onChange={setTranslatedText}
            disabled
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CDisplayEnergyValue - 100 kWh">
          <CDisplayEnergyValue value={100} />
        </CDevComponentLine>

        <CDevComponentLine label="CDisplayEnergyValue - 999 kWh (below MWh)">
          <CDisplayEnergyValue value={999} />
        </CDevComponentLine>

        <CDevComponentLine label="CDisplayEnergyValue - 1000 -> MWh (boundary)">
          <CDisplayEnergyValue value={1_000} />
        </CDevComponentLine>

        <CDevComponentLine label="CDisplayEnergyValue - 10000 -> MWh">
          <CDisplayEnergyValue value={10_000} />
        </CDevComponentLine>

        <CDevComponentLine label="CDisplayEnergyValue - 999999 MWh (below GWh)">
          <CDisplayEnergyValue value={999_999} />
        </CDevComponentLine>

        <CDevComponentLine label="CDisplayEnergyValue - 1000000 -> GWh (boundary)">
          <CDisplayEnergyValue value={1_000_000} />
        </CDevComponentLine>

        <CDevComponentLine label="CDisplayEnergyValue - 10000000 -> GWh">
          <CDisplayEnergyValue value={10_000_000} />
        </CDevComponentLine>

        <CDevComponentLine label="CDisplayEnergyValue - 1000000000 -> TWh (boundary)">
          <CDisplayEnergyValue value={1_000_000_000} />
        </CDevComponentLine>

        <CDevComponentLine label="CDisplayEnergyValue - negative">
          <CDisplayEnergyValue value={-5_000} />
        </CDevComponentLine>

        <CDevComponentLine label="CDisplayEnergyValue - empty value">
          <CDisplayEnergyValue value={undefined} />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeUser">
          <CBadgeUser value="Example User" />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeDepartment">
          <CBadgeDepartment value="Example Department" />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgePeriod">
          <CBadgePeriod value={"MONTHLY"} />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeSeu">
          <CBadgeSeu value="Example SEU" />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeApprovementStatus">
          <CGridBadge>
            <CBadgeApprovementStatus value={"APPROVED"} />
            <CBadgeApprovementStatus value={"PENDING"} />
            <CBadgeApprovementStatus value={"REJECTED"} />
          </CGridBadge>
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeUnit">
          <CGridBadge>
            <CBadgeUnit value="CURRENT_A" />
            <CBadgeUnit value="CURRENT_MA" />
            <CBadgeUnit value="ENERGY_KWH" />
            <CBadgeUnit value="ENERGY_MWH" />
            <CBadgeUnit value="ENERGY_WH" />
            <CBadgeUnit value="ENERGY_GWH" />
            <CBadgeUnit value="ENERGY_TWH" />
            <CBadgeUnit value="FREQUENCY_HZ" />
            <CBadgeUnit value="PIECE" />
            <CBadgeUnit value="POWER_KW" />
            <CBadgeUnit value="POWER_MW" />
            <CBadgeUnit value="POWER_W" />
            <CBadgeUnit value="APPARENT_POWER_VA" />
            <CBadgeUnit value="APPARENT_POWER_KVA" />
            <CBadgeUnit value="PRECIPITATION_MILIMETER_PER_METRE_SQUARE" />
            <CBadgeUnit value="RATE_PERCENTAGE" />
            <CBadgeUnit value="RATE_RATE" />
            <CBadgeUnit value="SCALAR" />
            <CBadgeUnit value="TEMPERATURE_CELSIUS" />
            <CBadgeUnit value="TIME_HOUR" />
            <CBadgeUnit value="TIME_MINUTE" />
            <CBadgeUnit value="TIME_SECOND" />
            <CBadgeUnit value="VOLTAGE" />
            <CBadgeUnit value="VOLUME_LITRE" />
            <CBadgeUnit value="VOLUME_METRE_CUBE" />
            <CBadgeUnit value="WEIGHT_GRAM" />
            <CBadgeUnit value="WEIGHT_KILOGRAM" />
            <CBadgeUnit value="WEIGHT_TONNE" />
          </CGridBadge>
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeUnitGroup">
          <CGridBadge>
            <CBadgeUnitGroup value="CURRENT" />
            <CBadgeUnitGroup value="ENERGY" />
            <CBadgeUnitGroup value="FREQUENCY" />
            <CBadgeUnitGroup value="PIECE" />
            <CBadgeUnitGroup value="POWER" />
            <CBadgeUnitGroup value="APPARENT_POWER" />
            <CBadgeUnitGroup value="PRECIPITATION" />
            <CBadgeUnitGroup value="RATE" />
            <CBadgeUnitGroup value="SCALAR" />
            <CBadgeUnitGroup value="TEMPERATURE" />
            <CBadgeUnitGroup value="TIME" />
            <CBadgeUnitGroup value="VOLTAGE" />
            <CBadgeUnitGroup value="VOLUME" />
            <CBadgeUnitGroup value="WEIGHT" />
          </CGridBadge>
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeEnergyResource">
          <CGridBadge>
            <CBadgeEnergyResource value={"ELECTRIC"} />
            <CBadgeEnergyResource value={"DIESEL"} />
            <CBadgeEnergyResource value={"GAS"} />
            <CBadgeEnergyResource value={"WATER"} />
            <CBadgeEnergyResource value={"SOLID_FUEL"} />
          </CGridBadge>
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeMetricResourceValuePeriod">
          <CGridBadge>
            <CBadgeMetricResourceValuePeriod value={"MINUTELY"} />
            <CBadgeMetricResourceValuePeriod value={"HOURLY"} />
            <CBadgeMetricResourceValuePeriod value={"DAILY"} />
            <CBadgeMetricResourceValuePeriod value={"MONTHLY"} />
          </CGridBadge>
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeMetricIntegrationPeriod">
          <CGridBadge>
            <CBadgeMetricIntegrationPeriod value={"MINUTELY"} />
            <CBadgeMetricIntegrationPeriod value={"MINUTELY_5"} />
            <CBadgeMetricIntegrationPeriod value={"MINUTELY_15"} />
            <CBadgeMetricIntegrationPeriod value={"HOURLY"} />
            <CBadgeMetricIntegrationPeriod value={"DAILY"} />
            <CBadgeMetricIntegrationPeriod value={"MONTHLY"} />
          </CGridBadge>
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeMetricType">
          <CGridBadge>
            <CBadgeMetricType value={"COUNTER"} />
            <CBadgeMetricType value={"GAUGE"} />
          </CGridBadge>
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeYesNo">
          <CGridBadge>
            <CBadgeYesNo value={true} />
            <CBadgeYesNo value={false} />
          </CGridBadge>
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeEnabled">
          <CGridBadge>
            <CBadgeEnabled value={true} />
            <CBadgeEnabled value={false} />
          </CGridBadge>
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeMeter / CBadgeMeterSlice / CBadgeMetric">
          <CGridBadge>
            <CBadgeMeter value="Example Meter" />
            <CBadgeMeterSlice value="Example Meter Slice" />
            <CBadgeMetric value="Example Metric" />
          </CGridBadge>
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeMetricResource">
          <CGridBadge>
            {metricResources.map((d, i) => (
              <CBadgeMetricResource key={i} value={d} />
            ))}
          </CGridBadge>
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeMetricResourceLabelSet">
          <CGridBadge>
            {metricResourcesLabelSets.map((d, i) => (
              <CBadgeMetricResourceLabelSet key={i} value={d} />
            ))}
          </CGridBadge>
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeMetricResourceLabel">
          <CGridBadge>
            {metricResourcesLabelSets.flatMap((set, iSet) =>
              set.map((d, i) => (
                <CBadgeMetricResourceLabel key={`${iSet}-${i}`} value={d} />
              )),
            )}
          </CGridBadge>
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeOutboundIntegrationType">
          <CGridBadge>
            <CBadgeOutboundIntegrationType value="MOCK_SOURCE" />
            <CBadgeOutboundIntegrationType value="WEATHER_API" />
          </CGridBadge>
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeInboundIntegrationType">
          <CGridBadge>
            <CBadgeInboundIntegrationType value="AGENT" />
            <CBadgeInboundIntegrationType value="WEBHOOK" />
          </CGridBadge>
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeCity">
          <CBadgeCity value="mersin" />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeAgent">
          <CBadgeAgent value="An Agent" />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeNotConfigured">
          <CBadgeNotConfigured />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeQdmsIntegrationBindingPage">
          <CBadgeQdmsIntegrationBindingPage value={"DESIGNS"} />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeIndexSuccess">
          <CGridBadge>
            <CBadgeIndexSuccess index={0} />
            <CBadgeIndexSuccess index={0} isSuccess={true} />
            <CBadgeIndexSuccess index={0} isSuccess={false} />
          </CGridBadge>
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeAgentStatus">
          <CGridBadge>
            <CBadgeAgentStatus value={"NEVER_CONNECTED"} />
            <CBadgeAgentStatus value={"ONLINE"} />
            <CBadgeAgentStatus value={"OFFLINE"} />
            <CBadgeAgentStatus value={"STALE"} />
          </CGridBadge>
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CBadgeMessageQueueTaskStatus">
          <CGridBadge>
            <CBadgeMessageQueueTaskStatus value={"SUCCESS"} />
            <CBadgeMessageQueueTaskStatus value={"PENDING"} />
            <CBadgeMessageQueueTaskStatus value={"FAILED"} />
            <CBadgeMessageQueueTaskStatus
              value={"FAILED"}
              failInfo={"INSUFFICIENT_DATA"}
            />
            <CBadgeMessageQueueTaskStatus
              value={"FAILED"}
              failInfo={"MESSAGE_PRODUCE_FAILED"}
            />
          </CGridBadge>
        </CDevComponentLine>
      </CDevComponentPanel>
    </CBody>
  );
}
