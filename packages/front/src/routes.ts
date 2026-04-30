import { ReactElement } from "react";

import { CAgentsList } from "@m/agent-management/pages/CAgentsList";
import manualEnpiEn from "@m/analysis/manuals/energy-performance-indicators.en.md";
import manualEnpiTr from "@m/analysis/manuals/energy-performance-indicators.tr.md";
import manualExploratoryAnalysesCorrelationEn from "@m/analysis/manuals/exploratory-analyses-correlation.en.md";
import manualExploratoryAnalysesCorrelationTr from "@m/analysis/manuals/exploratory-analyses-correlation.tr.md";
import manualExploratoryAnalysesRegressionEn from "@m/analysis/manuals/exploratory-analyses-regression.en.md";
import manualExploratoryAnalysesRegressionTr from "@m/analysis/manuals/exploratory-analyses-regression.tr.md";
import { CEnpiAddForm } from "@m/analysis/pages/CEnergyPerformanceIndicatorsAddForm";
import { CEnpiEditForm } from "@m/analysis/pages/CEnergyPerformanceIndicatorsEditForm";
import { CEnpitList } from "@m/analysis/pages/CEnergyPerformanceIndicatorsList";
import { CExploratoryAnalyses } from "@m/analysis/pages/CExploratoryAnalyses";
import { CRegressionAnalysesAddForm } from "@m/analysis/pages/CRegressionAnalysesAddForm";
import { CRegressionAnalysesCloneForm } from "@m/analysis/pages/CRegressionAnalysesCloneForm";
import { CRegressionAnalysesResultList } from "@m/analysis/pages/CRegressionAnalysesResultList";
import { CRegressionAnalysesValue } from "@m/analysis/pages/CRegressionAnalysesValue";
import { CRegressionSuggestAddForm } from "@m/analysis/pages/CRegressionSuggestAddForm";
import { CRegressionSuggestList } from "@m/analysis/pages/CRegressionSuggestList";
import { CRegressionSuggestionUseForm } from "@m/analysis/pages/CRegressionSuggestionUseForm";
import { IRouteExtraData } from "@m/base/interfaces/IRouteExtraData";
import manualDepartmentEn from "@m/base/manuals/department.en.md";
import manualDepartmentTr from "@m/base/manuals/department.tr.md";
import manualPartnersEn from "@m/base/manuals/partners.en.md";
import manualPartnersTr from "@m/base/manuals/partners.tr.md";
import { CAccessTokenAddForm } from "@m/base/pages/CAccessTokenAddForm";
import { CAccessTokenEditForm } from "@m/base/pages/CAccessTokenEditForm";
import { CAccessTokenList } from "@m/base/pages/CAccessTokenList";
import { CChangelog } from "@m/base/pages/CChangelog";
import { CDepartmentAddForm } from "@m/base/pages/CDepartmentAddForm";
import { CDepartmentEditForm } from "@m/base/pages/CDepartmentEditForm";
import { CDepartmentList } from "@m/base/pages/CDepartmentList";
import { CIssueReportRequest } from "@m/base/pages/CIssueReportRequest";
import { CCrudGuidePage } from "@m/base/pages/CCrudGuidePage";
import { CMyOrganization } from "@m/base/pages/CMyOrganization";
import { CMyProfile } from "@m/base/pages/CMyProfile";
import CNotificationPage from "@m/base/pages/CNotificationPage";
import { COrganizationPartnerList } from "@m/base/pages/COrganizationPartnerList";
import { CPersonalTokenAddForm } from "@m/base/pages/CPersonalTokenAddForm";
import { CPersonalTokenEditForm } from "@m/base/pages/CPersonalTokenEditForm";
import { CPersonalTokenList } from "@m/base/pages/CPersonalTokenList";
import CQuickNavigationPage from "@m/base/pages/CQuickNavigationPage";
import { CUserAddForm } from "@m/base/pages/CUserAddForm";
import { CUserEditForm } from "@m/base/pages/CUserEditForm";
import { CUserList } from "@m/base/pages/CUserList";
import { CUserPermission } from "@m/base/pages/CUserPermission";
import manualcomplianceObligationEn from "@m/commitment/manuals/compliance-obligation.en.md";
import manualcomplianceObligationTr from "@m/commitment/manuals/compliance-obligation.tr.md";
import manualEnergyPoliciesEn from "@m/commitment/manuals/energy-policies.en.md";
import manualEnergyPoliciesTr from "@m/commitment/manuals/energy-policies.tr.md";
import manualInternalExternalConsiderationEn from "@m/commitment/manuals/internal-external-consideration.en.md";
import manualInternalExternalConsiderationTr from "@m/commitment/manuals/internal-external-consideration.tr.md";
import manualNeedAndExpectationEn from "@m/commitment/manuals/need-and-expectation.en.md";
import manualNeedAndExpectationTr from "@m/commitment/manuals/need-and-expectation.tr.md";
import manualScopeAndLimitEn from "@m/commitment/manuals/scope-and-limits.en.md";
import manualScopeAndLimitTr from "@m/commitment/manuals/scope-and-limits.tr.md";
import { CComplianceObligationAddForm } from "@m/commitment/pages/CComplianceObligationAddForm";
import { CComplianceObligationeomscleAddForm } from "@m/commitment/pages/CComplianceObligationeomscleAddForm";
import { CComplianceObligationeomscleEditForm } from "@m/commitment/pages/CComplianceObligationeomscleEditForm";
import { CComplianceObligationeomscleList } from "@m/commitment/pages/CComplianceObligationeomscleList";
import { CComplianceObligationEditForm } from "@m/commitment/pages/CComplianceObligationEditForm";
import { CComplianceObligationList } from "@m/commitment/pages/CComplianceObligationList";
import { CEnergyPolicyAddForm } from "@m/commitment/pages/CEnergyPolicyAddForm";
import { CEnergyPolicyEditForm } from "@m/commitment/pages/CEnergyPolicyEditForm";
import { CEnergyPolicyList } from "@m/commitment/pages/CEnergyPolicyList";
import { CInternalExternalConsiderationAddForm } from "@m/commitment/pages/CInternalExternalConsiderationAddForm";
import { CInternalExternalConsiderationEditForm } from "@m/commitment/pages/CInternalExternalConsiderationEditForm";
import { CInternalExternalConsiderationHistoryList } from "@m/commitment/pages/CInternalExternalConsiderationHistoryList";
import { CInternalExternalConsiderationList } from "@m/commitment/pages/CInternalExternalConsiderationList";
import { CNeedAndExpectationAddForm } from "@m/commitment/pages/CNeedAndExpectationAddForm";
import { CNeedAndExpectationEditForm } from "@m/commitment/pages/CNeedAndExpectationEditForm";
import { CNeedAndExpectationList } from "@m/commitment/pages/CNeedAndExpectationList";
import { CScopeAndLimitsAddForm } from "@m/commitment/pages/CScopeAndLimitsAddForm";
import { CScopeAndLimitsEditForm } from "@m/commitment/pages/CScopeAndLimitsEditForm";
import { CScopeAndLimitsList } from "@m/commitment/pages/CScopeAndLimitsList";
import { CDashboardPage } from "@m/dashboard/pages/CDashboardPage";
import { CDevApi } from "@m/dev/pages/CDevApi";
import { CDevApiLoaderExample } from "@m/dev/pages/CDevApiLoaderExample";
import { CDevAsyncLoader } from "@m/dev/pages/CDevAsyncLoader";
import { CDevBreakpoints } from "@m/dev/pages/CDevBreakpoints";
import { CDevCalendar } from "@m/dev/pages/CDevCalendar";
import { CDevChart } from "@m/dev/pages/CDevChart";
import { CDevChartCheck } from "@m/dev/pages/CDevChartCheck";
import { CDevComponentDocumentSpecial } from "@m/dev/pages/CDevComponentDocumentSpecial";
import { CDevComponents } from "@m/dev/pages/CDevComponents";
import { CDevEmpty } from "@m/dev/pages/CDevEmpty";
import { CDevForm } from "@m/dev/pages/CDevForm";
import { CDevFormExample } from "@m/dev/pages/CDevFormExample";
import { CDevInputStateTest } from "@m/dev/pages/CDevInputStateTest";
import { CDevLogin } from "@m/dev/pages/CDevLogin";
import { CDevMap } from "@m/dev/pages/CDevMap";
import { CDevMarkdown } from "@m/dev/pages/CDevMarkdown";
import { CDevMockIntegrationSource } from "@m/dev/pages/CDevMockIntegrationSource";
import { CDevModal } from "@m/dev/pages/CDevModal";
import { CDevNotificationBalloon } from "@m/dev/pages/CDevNotificationBalloon";
import { CDevTable } from "@m/dev/pages/CDevTable";
import { CDevToast } from "@m/dev/pages/CDevToast";
import { CDevWebSocketHandling } from "@m/dev/pages/CDevWebSocketHandling";
import manualQdmsIntegrationEn from "@m/document-management/manuals/qdms-integration.en.md";
import manualQdmsIntegrationTr from "@m/document-management/manuals/qdms-integration.tr.md";
import { CQdmsIntegrationAddForm } from "@m/document-management/pages/CQdmsIntegrationAddForm";
import { CQdmsIntegrationEditForm } from "@m/document-management/pages/CQdmsIntegrationEditForm";
import { CQdmsIntegrationFile } from "@m/document-management/pages/CQdmsIntegrationFile";
import { CQdmsIntegrationList } from "@m/document-management/pages/CQdmsIntegrationList";
import manualNonconformityEn from "@m/internal-audit/manuals/nonconformity.en.md";
import manualNonconformityTr from "@m/internal-audit/manuals/nonconformity.tr.md";
import manualPlanEn from "@m/internal-audit/manuals/plan.en.md";
import manualPlanTr from "@m/internal-audit/manuals/plan.tr.md";
import manualWorkflowEn from "@m/internal-audit/manuals/workflow.en.md";
import manualWorkflowTr from "@m/internal-audit/manuals/workflow.tr.md";
import { CNonconformityAddForm } from "@m/internal-audit/pages/CNonconformityAddForm";
import { CNonconformityEditForm } from "@m/internal-audit/pages/CNonconformityEditForm";
import { CNonconformityList } from "@m/internal-audit/pages/CNonconformityList";
import { CPlansAddForm } from "@m/internal-audit/pages/CPlanAddForm";
import { CPlansEditForm } from "@m/internal-audit/pages/CPlanEditForm";
import { CPlansList } from "@m/internal-audit/pages/CPlanList";
import { CWorkflowAddForm } from "@m/internal-audit/pages/CWorkflowAddForm";
import { CWorkflowEditForm } from "@m/internal-audit/pages/CWorkflowEditForm";
import { CWorkflowList } from "@m/internal-audit/pages/CWorkflowList";
import manualDataViewEn from "@m/analysis/manuals/data-view.en.md";
import manualDataViewTr from "@m/analysis/manuals/data-view.tr.md";
import manualIntegrationInboundEn from "@m/measurement/manuals/integration-inbound.en.md";
import manualIntegrationInboundTr from "@m/measurement/manuals/integration-inbound.tr.md";
import manualIntegrationOutboundEn from "@m/measurement/manuals/integration-outbound.en.md";
import manualIntegrationOutboundTr from "@m/measurement/manuals/integration-outbound.tr.md";
import manualMeterEn from "@m/measurement/manuals/meter.en.md";
import manualMeterTr from "@m/measurement/manuals/meter.tr.md";
import manualMetricEn from "@m/measurement/manuals/metric.en.md";
import manualMetricTr from "@m/measurement/manuals/metric.tr.md";
import manualSeuAddEn from "@m/measurement/manuals/seu-add.en.md";
import manualSeuAddTr from "@m/measurement/manuals/seu-add.tr.md";
import manualSeuEn from "@m/measurement/manuals/seu.en.md";
import manualSeuTr from "@m/measurement/manuals/seu.tr.md";
import { CDataViewProfileAddForm } from "@m/analysis/pages/CDataViewProfileAddForm";
import { CDataViewProfileEditForm } from "@m/analysis/pages/CDataViewProfileEditForm";
import { CDataViewProfileList } from "@m/analysis/pages/CDataViewProfileList";
import { CDataViewProfileValue } from "@m/analysis/pages/CDataViewProfileValue";
import { CInboundIntegrationAddForm } from "@m/measurement/pages/CInboundIntegrationAddForm";
import { CInboundIntegrationEditForm } from "@m/measurement/pages/CInboundIntegrationEditForm";
import { CInboundIntegrationList } from "@m/measurement/pages/CInboundIntegrationList";
import { CMeterAddForm } from "@m/measurement/pages/CMeterAddForm";
import { CMeterEditForm } from "@m/measurement/pages/CMeterEditForm";
import { CMeterList } from "@m/measurement/pages/CMeterList";
import { CMeterSliceSaveForm } from "@m/measurement/pages/CMeterSliceSaveForm";
import { CMetricAddForm } from "@m/measurement/pages/CMetricAddForm";
import { CMetricEditForm } from "@m/measurement/pages/CMetricEditForm";
import { CMetricList } from "@m/measurement/pages/CMetricList";
import { CMetricValue } from "@m/measurement/pages/CMetricValue";
import { CMetricValueExcelImportPage } from "@m/measurement/pages/CMetricValueExcelImportPage";
import { COutboundIntegrationAddForm } from "@m/measurement/pages/COutboundIntegrationAddForm";
import { COutboundIntegrationEditForm } from "@m/measurement/pages/COutboundIntegrationEditForm";
import { COutboundIntegrationList } from "@m/measurement/pages/COutboundIntegrationList";
import { CSeuAddForm } from "@m/measurement/pages/CSeuAddForm";
import { CSeuEditForm } from "@m/measurement/pages/CSeuEditForm";
import { CSeuList } from "@m/measurement/pages/CSeuList";
import { CSeuValue } from "@m/measurement/pages/CSeuValue";
import manualActionPlanEn from "@m/planning/manuals/action-plan.en.md";
import manualActionPlanTr from "@m/planning/manuals/action-plan.tr.md";
import manualDesignEn from "@m/planning/manuals/design.en.md";
import manualDesignTr from "@m/planning/manuals/design.tr.md";
import manualEnergySavingOpportunityEn from "@m/planning/manuals/energy-saving-opportunity.en.md";
import manualEnergySavingOpportunityTr from "@m/planning/manuals/energy-saving-opportunity.tr.md";
import manualRiskForceFieldAnalysisEn from "@m/planning/manuals/risk-force-field-analysis.en.md";
import manualRiskForceFieldAnalysisTr from "@m/planning/manuals/risk-force-field-analysis.tr.md";
import manualRiskGapAnalysisEn from "@m/planning/manuals/risk-gap-analysis.en.md";
import manualRiskGapAnalysisTr from "@m/planning/manuals/risk-gap-analysis.tr.md";
import manualRiskSwotAnalysisEn from "@m/planning/manuals/risk-swot-analysis.en.md";
import manualRiskSwotAnalysisTr from "@m/planning/manuals/risk-swot-analysis.tr.md";
import manualTargetEn from "@m/planning/manuals/target.en.md";
import manualTargetTr from "@m/planning/manuals/target.tr.md";
import { CActionPlanAddForm } from "@m/planning/pages/CActionPlanAddForm";
import { CActionPlanEditForm } from "@m/planning/pages/CActionPlanEditForm";
import { CActionPlanList } from "@m/planning/pages/CActionPlanList";
import { CDesignAddForm } from "@m/planning/pages/CDesignAddForm";
import { CDesignEditForm } from "@m/planning/pages/CDesignEditForm";
import { CDesignIdeaAddForm } from "@m/planning/pages/CDesignIdeaAddForm";
import { CDesignIdeaEditForm } from "@m/planning/pages/CDesignIdeaEditForm";
import { CDesignIdeaList } from "@m/planning/pages/CDesignIdeaList";
import { CDesignList } from "@m/planning/pages/CDesignList";
import { CEnergySavingOpportunityAddForm } from "@m/planning/pages/CEnergySavingOpportunityAddForm";
import { CEnergySavingOpportunityEditForm } from "@m/planning/pages/CEnergySavingOpportunityEditForm";
import { CEnergySavingOpportunityList } from "@m/planning/pages/CEnergySavingOpportunityList";
import { CRiskForceFieldAnalysisAddForm } from "@m/planning/pages/CRiskForceFieldAnalysisAddForm";
import { CRiskForceFieldAnalysisEditForm } from "@m/planning/pages/CRiskForceFieldAnalysisEditForm";
import { CRiskForceFieldAnalysisList } from "@m/planning/pages/CRiskForceFieldAnalysisList";
import { CRiskSwotAnalysisAddForm } from "@m/planning/pages/CRiskSwotAnalysisAddForm";
import { CRiskSwotAnalysisEditForm } from "@m/planning/pages/CRiskSwotAnalysisEditForm";
import { CRiskSwotAnalysisList } from "@m/planning/pages/CRiskSwotAnalysisList";
import { CRisksGapAnalysesAddForm } from "@m/planning/pages/CRisksGapAnalysesAddForm";
import { CRisksGapAnalysesEditForm } from "@m/planning/pages/CRisksGapAnalysesEditForm";
import { CRisksGapAnalysesList } from "@m/planning/pages/CRisksGapAnalysesList";
import { CTargetAddForm } from "@m/planning/pages/CTargetAddForm";
import { CTargetEditForm } from "@m/planning/pages/CTargetEditForm";
import { CTargetList } from "@m/planning/pages/CTargetList";
import { CProductAddForm } from "@m/product-base/pages/CProductAddForm";
import { CProductEditForm } from "@m/product-base/pages/CProductEditForm";
import { CProductList } from "@m/product-base/pages/CProductList";
import { CReportAttachmentList } from "@m/report/pages/CReportAttachmentList";
import { CReportAttachmentUpload } from "@m/report/pages/CReportAttachmentUpload";
import { CReportAttachmentView } from "@m/report/pages/CReportAttachmentView";
import { CReportCloneForm } from "@m/report/pages/CReportCloneForm";
import { CReportCreateForm } from "@m/report/pages/CReportCreateForm";
import { CReportCreateTemplateForm } from "@m/report/pages/CReportCreateTemplateForm";
import { CReportEditTemplateForm } from "@m/report/pages/CReportEditTemplateForm";
import { CReportList } from "@m/report/pages/CReportList";
import { CReportOutputFile } from "@m/report/pages/CReportOutputFile";
import { CReportTemplateList } from "@m/report/pages/CReportTemplateList";
import { CReportUseTemplateForm } from "@m/report/pages/CReportUseTemplateForm";
import { COperationAddForm } from "@m/supply-chain/pages/COperationAddForm";
import { COperationEditForm } from "@m/supply-chain/pages/COperationEditForm";
import { COperationList } from "@m/supply-chain/pages/COperationList";
import { CPipelineAddForm } from "@m/supply-chain/pages/CPipelineAddForm";
import { CPipelineEditForm } from "@m/supply-chain/pages/CPipelineEditForm";
import { CPipelineList } from "@m/supply-chain/pages/CPipelineList";
import manualCommunicationAndAwarenessPlanEn from "@m/support/manuals/communication-and-awareness-plan.en.md";
import manualCommunicationAndAwarenessPlanTr from "@m/support/manuals/communication-and-awareness-plan.tr.md";
import manualCriticalOperationalParameterEn from "@m/support/manuals/critical-operational-parameter.en.md";
import manualCriticalOperationalParameterTr from "@m/support/manuals/critical-operational-parameter.tr.md";
import manualMaintenanceActivityEn from "@m/support/manuals/maintenance-activity.en.md";
import manualMaintenanceActivityTr from "@m/support/manuals/maintenance-activity.tr.md";
import manualMeasurementPlanCopEn from "@m/support/manuals/measurement-plan-cop.en.md";
import manualMeasurementPlanCopTr from "@m/support/manuals/measurement-plan-cop.tr.md";
import manualMeasurementPlanEnpiEn from "@m/support/manuals/measurement-plan-enpi.en.md";
import manualMeasurementPlanEnpiTr from "@m/support/manuals/measurement-plan-enpi.tr.md";
import manualProcurementProcedureEn from "@m/support/manuals/procurement-procedure.en.md";
import manualProcurementProcedureTr from "@m/support/manuals/procurement-procedure.tr.md";
import manualProcurementEn from "@m/support/manuals/procurement.en.md";
import manualProcurementTr from "@m/support/manuals/procurement.tr.md";
import manualTrainingEn from "@m/support/manuals/training.en.md";
import manualTrainingTr from "@m/support/manuals/training.tr.md";
import { CCalibrationAndVerificationPlanAddForm } from "@m/support/pages/CCalibrationAndVerificationPlanAddForm";
import { CCalibrationAndVerificationPlanEditForm } from "@m/support/pages/CCalibrationAndVerificationPlanEditForm";
import { CCalibrationAndVerificationPlanList } from "@m/support/pages/CCalibrationAndVerificationPlanList";
import { CCommunicationAndAwarenessPlanAddForm } from "@m/support/pages/CCommunicationAndAwarenessPlanAddForm";
import { CCommunicationAndAwarenessPlanEditForm } from "@m/support/pages/CCommunicationAndAwarenessPlanEditForm";
import { CCommunicationAndAwarenessPlanList } from "@m/support/pages/CCommunicationAndAwarenessPlanList";
import { CCriticalOperationalParameterAddForm } from "@m/support/pages/CCriticalOperationalParameterAddForm";
import { CCriticalOperationalParameterEditForm } from "@m/support/pages/CCriticalOperationalParameterEditForm";
import { CCriticalOperationalParameterList } from "@m/support/pages/CCriticalOperationalParameterList";
import { CMaintenanceActivityAddForm } from "@m/support/pages/CMaintenanceActivityAddForm";
import { CMaintenanceActivityEditForm } from "@m/support/pages/CMaintenanceActivityEditForm";
import { CMaintenanceActivityList } from "@m/support/pages/CMaintenanceActivityList";
import { CMeasurementPlanCopAddForm } from "@m/support/pages/CMeasurementPlanCopAddForm";
import { CMeasurementPlanCopEditForm } from "@m/support/pages/CMeasurementPlanCopEditForm";
import { CMeasurementPlanCopList } from "@m/support/pages/CMeasurementPlanCopList";
import { CMeasurementPlanEnpiAddForm } from "@m/support/pages/CMeasurementPlanEnpiAddForm";
import { CMeasurementPlanEnpiEditForm } from "@m/support/pages/CMeasurementPlanEnpiEditForm";
import { CMeasurementPlanEnpiList } from "@m/support/pages/CMeasurementPlanEnpiList";
import { CProcurementAddForm } from "@m/support/pages/CProcurementAddForm";
import { CProcurementEditForm } from "@m/support/pages/CProcurementEditForm";
import { CProcurementList } from "@m/support/pages/CProcurementList";
import { CProcurementProcedureAddForm } from "@m/support/pages/CProcurementProcedureAdd";
import { CProcurementProcedureEditForm } from "@m/support/pages/CProcurementProcedureEdit";
import { CProcurementProcedureList } from "@m/support/pages/CProcurementProcedureList";
import { CTrainingAddForm } from "@m/support/pages/CTrainingAddForm";
import { CTrainingEditForm } from "@m/support/pages/CTrainingEditForm";
import { CTrainingList } from "@m/support/pages/CTrainingList";
import { CSysOrganizationsBannerForm } from "@m/sys/components/CSysOrganizationsBannerForm";
import { CAgentRegistrationAddForm } from "@m/sys/pages/CAgentRegistrationAddForm";
import { CAgentRegistrationEditForm } from "@m/sys/pages/CAgentRegistrationEditForm";
import { CAgentRegistrationList } from "@m/sys/pages/CAgentRegistrationList";
import { CAgentRegistrationStats } from "@m/sys/pages/CAgentRegistrationStats";
import { CJobList } from "@m/sys/pages/CJobList";
import { CJobRunAddForm } from "@m/sys/pages/CJobRunAddForm";
import { CJobScheduleAddForm } from "@m/sys/pages/CJobScheduleAddForm";
import { CSysIssues } from "@m/sys/pages/CSysIssues";
import { CSysMaintenance } from "@m/sys/pages/CSysMaintenance";
import { CSysOrganizationsAddForm } from "@m/sys/pages/CSysOrganizationsAddForm";
import { CSysOrganizationsEditForm } from "@m/sys/pages/CSysOrganizationsEditForm";
import { CSysOrganizationsList } from "@m/sys/pages/CSysOrganizationsList";
import { CSysRuntimePatcher } from "@m/sys/pages/CSysRuntimePatcher";
import { CSysUsers } from "@m/sys/pages/CSysUsers";
import { CSystemInfo } from "@m/sys/pages/CSystemInfo";

/**
 * Note: Dynamic routes must be defined like;
 * `/path/to/${":varName" as string}`
 */

export const routes = [
  {
    path: "/quick-navigation",
    component: CQuickNavigationPage,
  },
  {
    path: "/crud-guide",
    component: CCrudGuidePage,
  },
  {
    path: "/notifications",
    component: CNotificationPage,
  },
  {
    path: "/",
    component: CDashboardPage,
  },

  // User ------------------------------------------------------------------
  {
    path: "/conf/user",
    component: CUserList,
    permission: "/BASE/USER",
    orgPlanFeature: "USER_MANAGEMENT",
  },
  {
    path: "/conf/user/item-add",
    component: CUserAddForm,
    permission: "/BASE/USER",
    orgPlanFeature: "USER_MANAGEMENT",
  },
  {
    path: `/conf/user/item/${":id" as string}`,
    component: CUserEditForm,
    permission: "/BASE/USER",
    orgPlanFeature: "USER_MANAGEMENT",
  },
  {
    path: `/conf/user/permission/${":userId" as string}`,
    component: CUserPermission,
    permission: "/BASE/USER",
    orgPlanFeature: "USER_MANAGEMENT",
  },

  // Analysis ------------------------------------------------------------------
  {
    path: "/analysis/enpi/item-add",
    component: CEnpiAddForm,
    permission: "/ANALYSIS",
    orgPlanFeature: "ANALYSES",
    manuals: {
      en: manualEnpiEn,
      "tr-TR": manualEnpiTr,
    },
  },
  {
    path: `/analysis/enpi/item/${":id" as string}`,
    component: CEnpiEditForm,
    permission: "/ANALYSIS",
    orgPlanFeature: "ANALYSES",
    manuals: {
      en: manualEnpiEn,
      "tr-TR": manualEnpiTr,
    },
  },
  {
    path: "/analysis/enpi",
    component: CEnpitList,
    permission: "/ANALYSIS",
    orgPlanFeature: "ANALYSES",
    manuals: {
      en: manualEnpiEn,
      "tr-TR": manualEnpiTr,
    },
  },
  {
    path: "/analysis/exploratory-analyses/correlation",
    component: CExploratoryAnalyses,
    permission: "/ANALYSIS",
    orgPlanFeature: "ANALYSES",
    manuals: {
      en: manualExploratoryAnalysesCorrelationEn,
      "tr-TR": manualExploratoryAnalysesCorrelationTr,
    },
  },
  {
    path: "/analysis/exploratory-analyses/regression",
    component: CExploratoryAnalyses,
    permission: "/ANALYSIS",
    orgPlanFeature: "ANALYSES",
    manuals: {
      en: manualExploratoryAnalysesRegressionEn,
      "tr-TR": manualExploratoryAnalysesRegressionTr,
    },
  },
  {
    path: "/analysis/advanced-regression/item-add",
    component: CRegressionAnalysesAddForm,
    permission: "/ANALYSIS",
    orgPlanFeature: "ANALYSES",
  },

  {
    path: `/analysis/advanced-regression/clone/${":id" as string}`,
    component: CRegressionAnalysesCloneForm,
    permission: "/ANALYSIS",
    orgPlanFeature: "ANALYSES",
  },
  {
    path: "/analysis/advanced-regression",
    component: CRegressionAnalysesResultList,
    permission: "/ANALYSIS",
    orgPlanFeature: "ANALYSES",
  },
  {
    path: "/analysis/advanced-regression/suggestions",
    component: CRegressionSuggestList,
    permission: "/ANALYSIS",
    orgPlanFeature: "ANALYSES",
  },
  {
    path: "/analysis/advanced-regression/suggestion-add",
    component: CRegressionSuggestAddForm,
    permission: "/ANALYSIS",
    orgPlanFeature: "ANALYSES",
  },
  {
    path: `/analysis/advanced-regression/item-add-from-suggestion/${":suggestionId" as string}`,
    component: CRegressionSuggestionUseForm,
    permission: "/ANALYSIS",
    orgPlanFeature: "ANALYSES",
  },
  {
    path: `/analysis/advanced-regression/values/${":id" as string}`,
    component: CRegressionAnalysesValue,
    permission: "/ANALYSIS",
    orgPlanFeature: "ANALYSES",
  },

  // Commitment ------------------------------------------------------------------
  {
    path: "/commitment/energy-policies/item-add",
    component: CEnergyPolicyAddForm,
    permission: "/COMMITMENT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualEnergyPoliciesEn,
      "tr-TR": manualEnergyPoliciesTr,
    },
  },
  {
    path: `/commitment/energy-policies/item/${":id" as string}`,
    component: CEnergyPolicyEditForm,
    permission: "/COMMITMENT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualEnergyPoliciesEn,
      "tr-TR": manualEnergyPoliciesTr,
    },
  },
  {
    path: "/commitment/energy-policies",
    component: CEnergyPolicyList,
    permission: "/COMMITMENT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualEnergyPoliciesEn,
      "tr-TR": manualEnergyPoliciesTr,
    },
  },
  {
    path: "/commitment/internal-external-considerations/item-add",
    component: CInternalExternalConsiderationAddForm,
    permission: "/COMMITMENT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualInternalExternalConsiderationEn,
      "tr-TR": manualInternalExternalConsiderationTr,
    },
  },
  {
    path: `/commitment/internal-external-considerations/item/${":id" as string}`,
    component: CInternalExternalConsiderationEditForm,
    permission: "/COMMITMENT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualInternalExternalConsiderationEn,
      "tr-TR": manualInternalExternalConsiderationTr,
    },
  },
  {
    path: `/commitment/internal-external-considerations/item/${":id" as string}/history`,
    component: CInternalExternalConsiderationHistoryList,
    permission: "/COMMITMENT",
    orgPlanFeature: "ISO50001",
  },
  {
    path: "/commitment/internal-external-considerations",
    component: CInternalExternalConsiderationList,
    permission: "/COMMITMENT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualInternalExternalConsiderationEn,
      "tr-TR": manualInternalExternalConsiderationTr,
    },
  },
  {
    path: "/commitment/needs-and-expectations/item-add",
    component: CNeedAndExpectationAddForm,
    permission: "/COMMITMENT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualNeedAndExpectationEn,
      "tr-TR": manualNeedAndExpectationTr,
    },
  },
  {
    path: `/commitment/needs-and-expectations/item/${":id" as string}`,
    component: CNeedAndExpectationEditForm,
    permission: "/COMMITMENT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualNeedAndExpectationEn,
      "tr-TR": manualNeedAndExpectationTr,
    },
  },
  {
    path: "/commitment/needs-and-expectations",
    component: CNeedAndExpectationList,
    permission: "/COMMITMENT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualNeedAndExpectationEn,
      "tr-TR": manualNeedAndExpectationTr,
    },
  },
  {
    path: "/commitment/compliance-obligation/item-add",
    component: CComplianceObligationAddForm,
    permission: "/COMMITMENT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualcomplianceObligationEn,
      "tr-TR": manualcomplianceObligationTr,
    },
  },
  {
    path: `/commitment/compliance-obligation/item/${":id" as string}`,
    component: CComplianceObligationEditForm,
    permission: "/COMMITMENT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualcomplianceObligationEn,
      "tr-TR": manualcomplianceObligationTr,
    },
  },
  {
    path: "/commitment/compliance-obligation",
    component: CComplianceObligationList,
    permission: "/COMMITMENT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualcomplianceObligationEn,
      "tr-TR": manualcomplianceObligationTr,
    },
  },
  {
    path: `/commitment/compliance-obligation/item/${":subjectId" as string}/eomscle/item-add`,
    component: CComplianceObligationeomscleAddForm,
    permission: "/COMMITMENT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualcomplianceObligationEn,
      "tr-TR": manualcomplianceObligationTr,
    },
  },
  {
    path: `/commitment/compliance-obligation/item/${":subjectId" as string}/eomscle/item/${":id" as string}`,
    component: CComplianceObligationeomscleEditForm,
    permission: "/COMMITMENT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualcomplianceObligationEn,
      "tr-TR": manualcomplianceObligationTr,
    },
  },
  {
    path: `/commitment/compliance-obligation/item/${":subjectId" as string}/eomscle`,
    component: CComplianceObligationeomscleList,
    permission: "/COMMITMENT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualcomplianceObligationEn,
      "tr-TR": manualcomplianceObligationTr,
    },
  },
  {
    path: "/commitment/scope-and-limit/item-add",
    component: CScopeAndLimitsAddForm,
    permission: "/COMMITMENT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualScopeAndLimitEn,
      "tr-TR": manualScopeAndLimitTr,
    },
  },
  {
    path: `/commitment/scope-and-limit/item/${":id" as string}`,
    component: CScopeAndLimitsEditForm,
    permission: "/COMMITMENT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualScopeAndLimitEn,
      "tr-TR": manualScopeAndLimitTr,
    },
  },
  {
    path: "/commitment/scope-and-limit",
    component: CScopeAndLimitsList,
    permission: "/COMMITMENT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualScopeAndLimitEn,
      "tr-TR": manualScopeAndLimitTr,
    },
  },

  // Measurements > Seu ------------------------------------------------------------------
  {
    path: "/measurements/significant-energy-user/item-add",
    component: CSeuAddForm,
    permission: "/MEASUREMENT",
    orgPlanFeature: "MEASUREMENT",
    manuals: {
      en: manualSeuAddEn,
      "tr-TR": manualSeuAddTr,
    },
  },
  {
    path: `/measurements/significant-energy-user/item/${":id" as string}`,
    component: CSeuEditForm,
    permission: "/MEASUREMENT",
    orgPlanFeature: "MEASUREMENT",
    manuals: {
      en: manualSeuEn,
      "tr-TR": manualSeuTr,
    },
  },
  {
    path: "/measurements/significant-energy-user",
    component: CSeuList,
    permission: "/MEASUREMENT",
    orgPlanFeature: "MEASUREMENT",
    manuals: {
      en: manualSeuEn,
      "tr-TR": manualSeuTr,
    },
  },
  {
    path: `/measurements/significant-energy-user/values/${
      ":type" as "table" | "graph"
    }/${":seuId" as string}`,
    component: CSeuValue,
    permission: "/MEASUREMENT",
    orgPlanFeature: "MEASUREMENT",
  },

  // Measurements > Metric ------------------------------------------------------------------
  {
    path: "/measurements/metric/item-add",
    component: CMetricAddForm,
    permission: "/MEASUREMENT",
    orgPlanFeature: "MEASUREMENT",
    manuals: {
      en: manualMetricEn,
      "tr-TR": manualMetricTr,
    },
  },
  {
    path: `/measurements/metric/item/${":id" as string}`,
    component: CMetricEditForm,
    permission: "/MEASUREMENT",
    orgPlanFeature: "MEASUREMENT",
    manuals: {
      en: manualMetricEn,
      "tr-TR": manualMetricTr,
    },
  },
  {
    path: "/measurements/metric",
    component: CMetricList,
    permission: "/MEASUREMENT",
    orgPlanFeature: "MEASUREMENT",
    manuals: {
      en: manualMetricEn,
      "tr-TR": manualMetricTr,
    },
  },
  {
    path: `/measurements/metric/values/${
      ":type" as "table" | "graph"
    }/${":id" as string}`,
    component: CMetricValue,
    permission: "/MEASUREMENT",
    orgPlanFeature: "MEASUREMENT",
  },
  {
    path: `/measurement/metric/values/import/${":id" as string}`,
    component: CMetricValueExcelImportPage,
    permission: "/MEASUREMENT",
    orgPlanFeature: "MEASUREMENT",
  },

  // Measurements > Integration ------------------------------------------------------------------
  {
    path: "/measurements/metric-integration/outbound",
    component: COutboundIntegrationList,
    permission: "/MEASUREMENT",
    orgPlanFeature: "MEASUREMENT",
    manuals: {
      en: manualIntegrationOutboundEn,
      "tr-TR": manualIntegrationOutboundTr,
    },
  },
  {
    path: "/measurements/metric-integration/outbound/item-add",
    component: COutboundIntegrationAddForm,
    permission: "/MEASUREMENT",
    orgPlanFeature: "MEASUREMENT",
    manuals: {
      en: manualIntegrationOutboundEn,
      "tr-TR": manualIntegrationOutboundTr,
    },
  },
  {
    path: `/measurements/metric-integration/outbound/item/${":id" as string}`,
    component: COutboundIntegrationEditForm,
    permission: "/MEASUREMENT",
    orgPlanFeature: "MEASUREMENT",
    manuals: {
      en: manualIntegrationOutboundEn,
      "tr-TR": manualIntegrationOutboundTr,
    },
  },
  {
    path: "/measurements/metric-integration/inbound",
    component: CInboundIntegrationList,
    permission: "/MEASUREMENT",
    orgPlanFeature: "MEASUREMENT",
    manuals: {
      en: manualIntegrationInboundEn,
      "tr-TR": manualIntegrationInboundTr,
    },
  },
  {
    path: "/measurements/metric-integration/inbound/item-add",
    component: CInboundIntegrationAddForm,
    permission: "/MEASUREMENT",
    orgPlanFeature: "MEASUREMENT",
    manuals: {
      en: manualIntegrationInboundEn,
      "tr-TR": manualIntegrationInboundTr,
    },
  },
  {
    path: `/measurements/metric-integration/inbound/item/${":id" as string}`,
    component: CInboundIntegrationEditForm,
    permission: "/MEASUREMENT",
    orgPlanFeature: "MEASUREMENT",
    manuals: {
      en: manualIntegrationInboundEn,
      "tr-TR": manualIntegrationInboundTr,
    },
  },

  // Measurements > Meter ------------------------------------------------------------------
  {
    path: "/measurements/meter",
    component: CMeterList,
    permission: "/MEASUREMENT",
    orgPlanFeature: "MEASUREMENT",
    manuals: {
      en: manualMeterEn,
      "tr-TR": manualMeterTr,
    },
  },
  {
    path: "/measurements/meter/item-add",
    component: CMeterAddForm,
    permission: "/MEASUREMENT",
    orgPlanFeature: "MEASUREMENT",
    manuals: {
      en: manualMeterEn,
      "tr-TR": manualMeterTr,
    },
  },
  {
    path: `/measurements/meter/item/${":id" as string}`,
    component: CMeterEditForm,
    permission: "/MEASUREMENT",
    orgPlanFeature: "MEASUREMENT",
    manuals: {
      en: manualMeterEn,
      "tr-TR": manualMeterTr,
    },
  },
  {
    path: `/measurements/meter/item/${":id" as string}/slices`,
    component: CMeterSliceSaveForm,
    permission: "/MEASUREMENT",
    orgPlanFeature: "MEASUREMENT",
  },

  // Analyses > Data View ------------------------------------------------------------------
  {
    path: "/analyses/data-view/profile/item-add",
    component: CDataViewProfileAddForm,
    permission: "/MEASUREMENT",
    orgPlanFeature: "MEASUREMENT",
    manuals: {
      en: manualDataViewEn,
      "tr-TR": manualDataViewTr,
    },
  },
  {
    path: `/analyses/data-view/profile/item/${":id" as string}`,
    component: CDataViewProfileEditForm,
    permission: "/MEASUREMENT",
    orgPlanFeature: "MEASUREMENT",
    manuals: {
      en: manualDataViewEn,
      "tr-TR": manualDataViewTr,
    },
  },
  {
    path: "/analyses/data-view/profile",
    component: CDataViewProfileList,
    permission: "/MEASUREMENT",
    orgPlanFeature: "MEASUREMENT",
    manuals: {
      en: manualDataViewEn,
      "tr-TR": manualDataViewTr,
    },
  },
  {
    path: `/analyses/data-view/values/${":profileId" as string}`,
    component: CDataViewProfileValue,
    permission: "/MEASUREMENT",
    orgPlanFeature: "MEASUREMENT",
  },

  // Planning ------------------------------------------------------------------
  {
    path: "/planning/risks/swot-analyses/item-add",
    component: CRiskSwotAnalysisAddForm,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualRiskSwotAnalysisEn,
      "tr-TR": manualRiskSwotAnalysisTr,
    },
  },
  {
    path: `/planning/risks/swot-analyses/item/${":id" as string}`,
    component: CRiskSwotAnalysisEditForm,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualRiskSwotAnalysisEn,
      "tr-TR": manualRiskSwotAnalysisTr,
    },
  },
  {
    path: "/planning/risks/swot-analyses",
    component: CRiskSwotAnalysisList,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualRiskSwotAnalysisEn,
      "tr-TR": manualRiskSwotAnalysisTr,
    },
  },
  {
    path: "/planning/risks/force-field-analyses/item-add",
    component: CRiskForceFieldAnalysisAddForm,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualRiskForceFieldAnalysisEn,
      "tr-TR": manualRiskForceFieldAnalysisTr,
    },
  },
  {
    path: `/planning/risks/force-field-analyses/item/${":id" as string}`,
    component: CRiskForceFieldAnalysisEditForm,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualRiskForceFieldAnalysisEn,
      "tr-TR": manualRiskForceFieldAnalysisTr,
    },
  },
  {
    path: "/planning/risks/force-field-analyses",
    component: CRiskForceFieldAnalysisList,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualRiskForceFieldAnalysisEn,
      "tr-TR": manualRiskForceFieldAnalysisTr,
    },
  },
  {
    path: "/planning/risks/gap-analyses/item-add",
    component: CRisksGapAnalysesAddForm,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualRiskGapAnalysisEn,
      "tr-TR": manualRiskGapAnalysisTr,
    },
  },
  {
    path: `/planning/risks/gap-analyses/item/${":id" as string}`,
    component: CRisksGapAnalysesEditForm,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualRiskGapAnalysisEn,
      "tr-TR": manualRiskGapAnalysisTr,
    },
  },
  {
    path: "/planning/risks/gap-analyses",
    component: CRisksGapAnalysesList,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualRiskGapAnalysisEn,
      "tr-TR": manualRiskGapAnalysisTr,
    },
  },
  {
    path: "/planning/energy-saving-opportunity/item-add",
    component: CEnergySavingOpportunityAddForm,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualEnergySavingOpportunityEn,
      "tr-TR": manualEnergySavingOpportunityTr,
    },
  },
  {
    path: `/planning/energy-saving-opportunity/item/${":id" as string}`,
    component: CEnergySavingOpportunityEditForm,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualEnergySavingOpportunityEn,
      "tr-TR": manualEnergySavingOpportunityTr,
    },
  },
  {
    path: "/planning/energy-saving-opportunity",
    component: CEnergySavingOpportunityList,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualEnergySavingOpportunityEn,
      "tr-TR": manualEnergySavingOpportunityTr,
    },
  },
  {
    path: "/planning/action-plan/item-add",
    component: CActionPlanAddForm,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualActionPlanEn,
      "tr-TR": manualActionPlanTr,
    },
  },
  {
    path: `/planning/action-plan/item/${":id" as string}`,
    component: CActionPlanEditForm,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualActionPlanEn,
      "tr-TR": manualActionPlanTr,
    },
  },
  {
    path: "/planning/action-plan",
    component: CActionPlanList,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualActionPlanEn,
      "tr-TR": manualActionPlanTr,
    },
  },
  {
    path: "/planning/design/item-add",
    component: CDesignAddForm,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualDesignEn,
      "tr-TR": manualDesignTr,
    },
  },
  {
    path: `/planning/design/item/${":id" as string}`,
    component: CDesignEditForm,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualDesignEn,
      "tr-TR": manualDesignTr,
    },
  },
  {
    path: "/planning/design",
    component: CDesignList,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualDesignEn,
      "tr-TR": manualDesignTr,
    },
  },
  {
    path: `/planning/design/item/${":designId" as string}/idea/item-add`,
    component: CDesignIdeaAddForm,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualDesignEn,
      "tr-TR": manualDesignTr,
    },
  },
  {
    path: `/planning/design/item/${":designId" as string}/idea/item/${":id" as string}`,
    component: CDesignIdeaEditForm,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualDesignEn,
      "tr-TR": manualDesignTr,
    },
  },
  {
    path: `/planning/design/item/${":designId" as string}/idea`,
    component: CDesignIdeaList,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualDesignEn,
      "tr-TR": manualDesignTr,
    },
  },

  {
    path: "/planning/target/item-add",
    component: CTargetAddForm,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualTargetEn,
      "tr-TR": manualTargetTr,
    },
  },
  {
    path: `/planning/target/item/${":id" as string}`,
    component: CTargetEditForm,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualTargetEn,
      "tr-TR": manualTargetTr,
    },
  },
  {
    path: "/planning/target",
    component: CTargetList,
    permission: "/PLANNING",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualTargetEn,
      "tr-TR": manualTargetTr,
    },
  },

  // Product Base ------------------------------------------------------------------
  {
    path: "/product-base/product/item-add",
    component: CProductAddForm,
    permission: "/PRODUCT",
    orgPlanFeature: "PRODUCT",
  },
  {
    path: `/product-base/product/item/${":id" as string}`,
    component: CProductEditForm,
    permission: "/PRODUCT",
    orgPlanFeature: "PRODUCT",
  },
  {
    path: "/product-base/product",
    component: CProductList,
    permission: "/PRODUCT",
    orgPlanFeature: "PRODUCT",
  },

  // Supporting ------------------------------------------------------------------
  {
    path: "/supporting-operations/calibration-verification-plan/item-add",
    component: CCalibrationAndVerificationPlanAddForm,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
  },
  {
    path: `/supporting-operations/calibration-verification-plan/item/${":id" as string}`,
    component: CCalibrationAndVerificationPlanEditForm,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
  },
  {
    path: "/supporting-operations/calibration-verification-plan",
    component: CCalibrationAndVerificationPlanList,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
  },
  {
    path: "/supporting-operations/training/item-add",
    component: CTrainingAddForm,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualTrainingEn,
      "tr-TR": manualTrainingTr,
    },
  },
  {
    path: `/supporting-operations/training/item/${":id" as string}`,
    component: CTrainingEditForm,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualTrainingEn,
      "tr-TR": manualTrainingTr,
    },
  },
  {
    path: "/supporting-operations/training",
    component: CTrainingList,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualTrainingEn,
      "tr-TR": manualTrainingTr,
    },
  },
  {
    path: "/supporting-operations/procurement/item-add",
    component: CProcurementAddForm,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualProcurementEn,
      "tr-TR": manualProcurementTr,
    },
  },
  {
    path: `/supporting-operations/procurement/item/${":id" as string}`,
    component: CProcurementEditForm,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualProcurementEn,
      "tr-TR": manualProcurementTr,
    },
  },
  {
    path: "/supporting-operations/procurement",
    component: CProcurementList,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualProcurementEn,
      "tr-TR": manualProcurementTr,
    },
  },
  {
    path: "/supporting-operations/procurement-procedure/item-add",
    component: CProcurementProcedureAddForm,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualProcurementProcedureEn,
      "tr-TR": manualProcurementProcedureTr,
    },
  },
  {
    path: `/supporting-operations/procurement-procedure/item/${":id" as string}`,
    component: CProcurementProcedureEditForm,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualProcurementProcedureEn,
      "tr-TR": manualProcurementProcedureTr,
    },
  },
  {
    path: "/supporting-operations/procurement-procedure",
    component: CProcurementProcedureList,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualProcurementProcedureEn,
      "tr-TR": manualProcurementProcedureTr,
    },
  },
  {
    path: "/supporting-operations/communication-awareness-plan/item-add",
    component: CCommunicationAndAwarenessPlanAddForm,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualCommunicationAndAwarenessPlanEn,
      "tr-TR": manualCommunicationAndAwarenessPlanTr,
    },
  },
  {
    path: `/supporting-operations/communication-awareness-plan/item/${":id" as string}`,
    component: CCommunicationAndAwarenessPlanEditForm,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualCommunicationAndAwarenessPlanEn,
      "tr-TR": manualCommunicationAndAwarenessPlanTr,
    },
  },
  {
    path: "/supporting-operations/communication-awareness-plan",
    component: CCommunicationAndAwarenessPlanList,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualCommunicationAndAwarenessPlanEn,
      "tr-TR": manualCommunicationAndAwarenessPlanTr,
    },
  },
  {
    path: "/supporting-operations/maintenance-activity/item-add",
    component: CMaintenanceActivityAddForm,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualMaintenanceActivityEn,
      "tr-TR": manualMaintenanceActivityTr,
    },
  },
  {
    path: `/supporting-operations/maintenance-activity/item/${":id" as string}`,
    component: CMaintenanceActivityEditForm,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualMaintenanceActivityEn,
      "tr-TR": manualMaintenanceActivityTr,
    },
  },
  {
    path: "/supporting-operations/maintenance-activity",
    component: CMaintenanceActivityList,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualMaintenanceActivityEn,
      "tr-TR": manualMaintenanceActivityTr,
    },
  },
  {
    path: "/supporting-operations/measurement-plan-enpi/item-add",
    component: CMeasurementPlanEnpiAddForm,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualMeasurementPlanEnpiEn,
      "tr-TR": manualMeasurementPlanEnpiTr,
    },
  },
  {
    path: `/supporting-operations/measurement-plan-enpi/item/${":id" as string}`,
    component: CMeasurementPlanEnpiEditForm,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualMeasurementPlanEnpiEn,
      "tr-TR": manualMeasurementPlanEnpiTr,
    },
  },
  {
    path: "/supporting-operations/measurement-plan-enpi",
    component: CMeasurementPlanEnpiList,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualMeasurementPlanEnpiEn,
      "tr-TR": manualMeasurementPlanEnpiTr,
    },
  },
  {
    path: "/supporting-operations/measurement-plan-cop/item-add",
    component: CMeasurementPlanCopAddForm,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualMeasurementPlanCopEn,
      "tr-TR": manualMeasurementPlanCopTr,
    },
  },
  {
    path: `/supporting-operations/measurement-plan-cop/item/${":id" as string}`,
    component: CMeasurementPlanCopEditForm,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualMeasurementPlanCopEn,
      "tr-TR": manualMeasurementPlanCopTr,
    },
  },
  {
    path: "/supporting-operations/measurement-plan-cop",
    component: CMeasurementPlanCopList,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualMeasurementPlanCopEn,
      "tr-TR": manualMeasurementPlanCopTr,
    },
  },
  {
    path: "/supporting-operations/critical-operational-parameter/item-add",
    component: CCriticalOperationalParameterAddForm,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualCriticalOperationalParameterEn,
      "tr-TR": manualCriticalOperationalParameterTr,
    },
  },
  {
    path: `/supporting-operations/critical-operational-parameter/item/${":id" as string}`,
    component: CCriticalOperationalParameterEditForm,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualCriticalOperationalParameterEn,
      "tr-TR": manualCriticalOperationalParameterTr,
    },
  },
  {
    path: "/supporting-operations/critical-operational-parameter",
    component: CCriticalOperationalParameterList,
    permission: "/SUPPORT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualCriticalOperationalParameterEn,
      "tr-TR": manualCriticalOperationalParameterTr,
    },
  },

  // Internal Audit ------------------------------------------------------------------
  {
    path: "/internal-audit/plan/item-add",
    component: CPlansAddForm,
    permission: "/INTERNAL_AUDIT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualPlanEn,
      "tr-TR": manualPlanTr,
    },
  },
  {
    path: `/internal-audit/plan/item/${":id" as string}`,
    component: CPlansEditForm,
    permission: "/INTERNAL_AUDIT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualPlanEn,
      "tr-TR": manualPlanTr,
    },
  },
  {
    path: "/internal-audit/plan",
    component: CPlansList,
    permission: "/INTERNAL_AUDIT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualPlanEn,
      "tr-TR": manualPlanTr,
    },
  },
  {
    path: "/internal-audit/nonconformity/item-add",
    component: CNonconformityAddForm,
    permission: "/INTERNAL_AUDIT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualNonconformityEn,
      "tr-TR": manualNonconformityTr,
    },
  },
  {
    path: `/internal-audit/nonconformity/item/${":id" as string}`,
    component: CNonconformityEditForm,
    permission: "/INTERNAL_AUDIT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualNonconformityEn,
      "tr-TR": manualNonconformityTr,
    },
  },
  {
    path: "/internal-audit/nonconformity",
    component: CNonconformityList,
    permission: "/INTERNAL_AUDIT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualNonconformityEn,
      "tr-TR": manualNonconformityTr,
    },
  },
  {
    path: "/internal-audit/workflow/item-add",
    component: CWorkflowAddForm,
    permission: "/INTERNAL_AUDIT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualWorkflowEn,
      "tr-TR": manualWorkflowTr,
    },
  },
  {
    path: `/internal-audit/workflow/item/${":id" as string}`,
    component: CWorkflowEditForm,
    permission: "/INTERNAL_AUDIT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualWorkflowEn,
      "tr-TR": manualWorkflowTr,
    },
  },
  {
    path: "/internal-audit/workflow",
    component: CWorkflowList,
    permission: "/INTERNAL_AUDIT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualWorkflowEn,
      "tr-TR": manualWorkflowTr,
    },
  },

  // Agent Management ------------------------------------------------------------------
  {
    path: "/agent-management/agents",
    component: CAgentsList,
    permission: "/AGENT",
    orgPlanFeature: "eoms_AGENT",
  },

  // Supply Chain ------------------------------------------------------------------
  {
    path: "/supply-chain/pipeline/item-add",
    component: CPipelineAddForm,
    permission: "/SUPPLY_CHAIN",
    orgPlanFeature: "SUPPLY_CHAIN",
  },
  {
    path: `/supply-chain/pipeline/item/${":id" as string}`,
    component: CPipelineEditForm,
    permission: "/SUPPLY_CHAIN",
    orgPlanFeature: "SUPPLY_CHAIN",
  },
  {
    path: "/supply-chain/pipeline",
    component: CPipelineList,
    permission: "/SUPPLY_CHAIN",
    orgPlanFeature: "SUPPLY_CHAIN",
  },
  {
    path: `/supply-chain/pipeline/item/${":pipelineId" as string}/operation/item-add`,
    component: COperationAddForm,
    permission: "/SUPPLY_CHAIN",
    orgPlanFeature: "SUPPLY_CHAIN",
  },
  {
    path: `/supply-chain/pipeline/item/${":pipelineId" as string}/operation/item/${":id" as string}`,
    component: COperationEditForm,
    permission: "/SUPPLY_CHAIN",
    orgPlanFeature: "SUPPLY_CHAIN",
  },
  {
    path: `/supply-chain/pipeline/item/${":pipelineId" as string}/operation`,
    component: COperationList,
    permission: "/SUPPLY_CHAIN",
    orgPlanFeature: "SUPPLY_CHAIN",
  },

  // Base ------------------------------------------------------------------
  {
    path: "/configuration/departments/item-add",
    component: CDepartmentAddForm,
    permission: "/BASE/DEPARTMENT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualDepartmentEn,
      "tr-TR": manualDepartmentTr,
    },
  },
  {
    path: `/configuration/departments/item/${":id" as string}`,
    component: CDepartmentEditForm,
    permission: "/BASE/DEPARTMENT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualDepartmentEn,
      "tr-TR": manualDepartmentTr,
    },
  },
  {
    path: "/configuration/departments",
    component: CDepartmentList,
    permission: "/BASE/DEPARTMENT",
    orgPlanFeature: "ISO50001",
    manuals: {
      en: manualDepartmentEn,
      "tr-TR": manualDepartmentTr,
    },
  },
  {
    path: "/configuration/my-organization",
    component: CMyOrganization,
  },
  {
    path: "/configuration/organization-partners",
    component: COrganizationPartnerList,
    permission: "/BASE/ORGANIZATION_PARTNER",
    orgPlanFeature: "ORGANIZATION_PARTNER",
    manuals: {
      en: manualPartnersEn,
      "tr-TR": manualPartnersTr,
    },
  },
  {
    path: "/configuration/access-token",
    component: CAccessTokenList,
    permission: "/BASE/ACCESS_TOKEN",
    orgPlanFeature: "ACCESS_TOKEN",
  },
  {
    path: "/configuration/access-token/item-add",
    component: CAccessTokenAddForm,
    permission: "/BASE/ACCESS_TOKEN",
    orgPlanFeature: "ACCESS_TOKEN",
  },
  {
    path: `/configuration/access-token/item/${":id" as string}`,
    component: CAccessTokenEditForm,
    permission: "/BASE/ACCESS_TOKEN",
    orgPlanFeature: "ACCESS_TOKEN",
  },

  // Personal tokens -------------------------------------------------------
  {
    path: "/my-profile/personal-tokens",
    component: CPersonalTokenList,
    permission: "/BASE/USER_TOKEN",
    orgPlanFeature: "USER_TOKEN",
  },
  {
    path: "/my-profile/personal-tokens/item-add",
    component: CPersonalTokenAddForm,
    permission: "/BASE/USER_TOKEN",
    orgPlanFeature: "USER_TOKEN",
  },
  {
    path: `/my-profile/personal-tokens/item/${":id" as string}`,
    component: CPersonalTokenEditForm,
    permission: "/BASE/USER_TOKEN",
    orgPlanFeature: "USER_TOKEN",
  },

  // Qdms ------------------------------------------------------------------
  {
    path: "/dms/qdms-integration",
    component: CQdmsIntegrationList,
    permission: "/DMS/QDMS_INTEGRATION",
    orgPlanFeature: "QDMS",
    manuals: {
      en: manualQdmsIntegrationEn,
      "tr-TR": manualQdmsIntegrationTr,
    },
  },
  {
    path: "/dms/qdms-integration/item-add",
    component: CQdmsIntegrationAddForm,
    permission: "/DMS/QDMS_INTEGRATION",
    orgPlanFeature: "QDMS",
    manuals: {
      en: manualQdmsIntegrationEn,
      "tr-TR": manualQdmsIntegrationTr,
    },
  },
  {
    path: `/dms/qdms-integration/item/${":id" as string}`,
    component: CQdmsIntegrationEditForm,
    permission: "/DMS/QDMS_INTEGRATION",
    orgPlanFeature: "QDMS",
    manuals: {
      en: manualQdmsIntegrationEn,
      "tr-TR": manualQdmsIntegrationTr,
    },
  },
  {
    path: `/dms/qdms-integration/item/${":id" as string}/file`,
    component: CQdmsIntegrationFile,
    permission: "/DMS/QDMS_INTEGRATION",
    orgPlanFeature: "QDMS",
  },

  // Report ------------------------------------------------------------------
  {
    path: "/report/attachments",
    component: CReportAttachmentList,
    permission: "/REPORT",
    orgPlanFeature: "REPORT",
  },
  {
    path: "/report/attachments/upload",
    component: CReportAttachmentUpload,
    permission: "/REPORT",
    orgPlanFeature: "REPORT",
  },
  {
    path: `/report/attachments/item/${":id" as string}`,
    component: CReportAttachmentView,
    permission: "/REPORT",
    orgPlanFeature: "REPORT",
  },
  {
    path: "/report/template",
    component: CReportTemplateList,
    permission: "/REPORT",
    orgPlanFeature: "REPORT",
  },
  {
    path: "/report/template-add",
    component: CReportCreateTemplateForm,
    permission: "/REPORT",
    orgPlanFeature: "REPORT",
  },
  {
    path: `/report/template/${":id" as string}`,
    component: CReportEditTemplateForm,
    permission: "/REPORT",
    orgPlanFeature: "REPORT",
  },
  {
    path: "/report/item-add",
    component: CReportCreateForm,
    permission: "/REPORT",
    orgPlanFeature: "REPORT",
  },
  {
    path: `/report/item-clone/${":id" as string}`,
    component: CReportCloneForm,
    permission: "/REPORT",
    orgPlanFeature: "REPORT",
  },
  {
    path: "/report/item",
    component: CReportList,
    permission: "/REPORT",
    orgPlanFeature: "REPORT",
  },
  {
    path: `/report/item-use-template/${":templateId" as string}`,
    component: CReportUseTemplateForm,
    permission: "/REPORT",
    orgPlanFeature: "REPORT",
  },
  {
    path: `/report/output-file/item/${":id" as string}`,
    component: CReportOutputFile,
    permission: "/REPORT",
    orgPlanFeature: "REPORT",
  },

  // My Profile ------------------------------------------------------------------
  {
    path: "/my-profile",
    component: CMyProfile,
  },
  {
    path: "/issue-report-request",
    component: CIssueReportRequest,
  },

  // TODO remove dev check when real changelog is implemented */}
  ...(import.meta.env.VITE_DEV_PAGES
    ? ([
        {
          path: "/changelog",
          component: CChangelog,
        },
      ] as const)
    : []),

  // Sys ------------------------------------------------------------------
  {
    path: `/sys/organizations/item/${":id" as string}/banner`,
    component: CSysOrganizationsBannerForm,
    orgPlanFeature: "SYSTEM",
  },
  {
    path: `/sys/organizations/item/${":id" as string}`,
    component: CSysOrganizationsEditForm,
    orgPlanFeature: "SYSTEM",
  },
  {
    path: "/sys/organizations/item-add",
    component: CSysOrganizationsAddForm,
    orgPlanFeature: "SYSTEM",
  },
  {
    path: "/sys/organizations",
    component: CSysOrganizationsList,
    orgPlanFeature: "SYSTEM",
  },
  {
    path: "/sys/users",
    component: CSysUsers,
    orgPlanFeature: "SYSTEM",
  },
  {
    path: "/sys/runtime-patcher",
    component: CSysRuntimePatcher,
    orgPlanFeature: "SYSTEM",
  },
  {
    path: "/sys/system-info",
    component: CSystemInfo,
    orgPlanFeature: "SYSTEM",
  },
  {
    path: "/sys/maintenance",
    component: CSysMaintenance,
    orgPlanFeature: "SYSTEM",
  },
  {
    path: "/sys/issues",
    component: CSysIssues,
    orgPlanFeature: "SYSTEM",
  },
  {
    path: "/sys/job-schedule/add",
    component: CJobScheduleAddForm,
    orgPlanFeature: "SYSTEM",
  },
  {
    path: "/sys/job-run/add",
    component: CJobRunAddForm,
    orgPlanFeature: "SYSTEM",
  },
  {
    path: "/sys/job",
    component: CJobList,
    orgPlanFeature: "SYSTEM",
  },
  {
    path: "/sys/agent-registration/item-add",
    component: CAgentRegistrationAddForm,
    orgPlanFeature: "SYSTEM",
  },
  {
    path: `/sys/agent-registration/item-stats/${":id" as string}`,
    component: CAgentRegistrationStats,
    orgPlanFeature: "SYSTEM",
  },
  {
    path: `/sys/agent-registration/item/${":id" as string}`,
    component: CAgentRegistrationEditForm,
    orgPlanFeature: "SYSTEM",
  },
  {
    path: "/sys/agent-registration",
    component: CAgentRegistrationList,
    orgPlanFeature: "SYSTEM",
  },

  // Dev ------------------------------------------------------------------

  ...(import.meta.env.VITE_DEV_PAGES
    ? ([
        {
          path: "/dev/empty",
          component: CDevEmpty,
        },
        {
          path: "/dev/login",
          component: CDevLogin,
        },
        {
          path: "/dev/components",
          component: CDevComponents,
        },
        {
          path: "/dev/input-state-test",
          component: CDevInputStateTest,
        },
        {
          path: "/dev/component-doc-special",
          component: CDevComponentDocumentSpecial,
        },
        {
          path: "/dev/form",
          component: CDevForm,
        },
        {
          path: "/dev/form-example",
          component: CDevFormExample,
        },
        {
          path: "/dev/table",
          component: CDevTable,
        },
        {
          path: "/dev/chart",
          component: CDevChart,
        },
        {
          path: "/dev/chart-check",
          component: CDevChartCheck,
        },
        {
          path: "/dev/notification-balloon",
          component: CDevNotificationBalloon,
        },
        {
          path: "/dev/toast",
          component: CDevToast,
        },
        {
          path: "/dev/modal",
          component: CDevModal,
        },
        {
          path: "/dev/calendar",
          component: CDevCalendar,
        },
        {
          path: "/dev/map",
          component: CDevMap,
        },
        {
          path: "/dev/breakpints",
          component: CDevBreakpoints,
        },
        {
          path: "/dev/async-loader",
          component: CDevAsyncLoader,
        },
        {
          path: "/dev/api",
          component: CDevApi,
        },
        {
          path: "/dev/api-loader-example",
          component: CDevApiLoaderExample,
        },
        {
          path: "/dev/websocket-handling",
          component: CDevWebSocketHandling,
        },
        {
          path: "/dev/mock-integration-source",
          component: CDevMockIntegrationSource,
        },
        {
          path: "/dev/markdown",
          component: CDevMarkdown,
        },
      ] as const)
    : []),
] as const satisfies ({
  path: string;
  component: () => ReactElement;
} & IRouteExtraData)[];
