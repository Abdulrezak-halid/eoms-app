/**
 * @file: initModules.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 21.01.2025
 * Last Modified Date: 22.01.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { RouterAgent } from "@m/agent/routers/RouterAgent";
import { MqConsumerDriverSuggestions } from "@m/analysis/mq-consumers/MqConsumerDriverSuggestions";
import { RouterAnalysis } from "@m/analysis/routers/RouterAnalysis";
import { PatchExampleJob } from "@m/base/patches/PatchExampleJob";
import { PatchExampleOrgAndUser } from "@m/base/patches/PatchExampleOrgAndUser";
import { PatchSysOrgAndUser } from "@m/base/patches/PatchSysOrgAndUser";
import { RouterBase } from "@m/base/routers/RouterBase";
import { RouterGOrganizationBanner } from "@m/base/routers/RouterGOrganizationBanner";
import { RouterOrganization } from "@m/base/routers/RouterOrganization";
import { RouterCommitment } from "@m/commitment/routers/RouterCommitment";
import { IEnv } from "@m/core/interfaces/IEnv";
import { RouterCore } from "@m/core/routers/RouterCore";
import { SchemaWsServerMessage } from "@m/core/schemas/SchemaWsServerMessage";
import { ServiceEnv } from "@m/core/services/ServiceEnv";
import { ServiceJob } from "@m/core/services/ServiceJob";
import { ServiceMessageQueue } from "@m/core/services/ServiceMessageQueue";
import { ServiceRouteManager } from "@m/core/services/ServiceRouteManager";
import { ServiceRuntimePatcher } from "@m/core/services/ServiceRuntimePatcher";
import { RouterDashboard } from "@m/dashboard/routers/RouterDashboard";
import { JobExample } from "@m/dev/jobs/JobExample";
import {
  PatchDemoSeedStage1,
  PatchDemoSeedStage2,
} from "@m/dev/patches/PatchDemoSeed";
import {
  PatchDevSeedStage1,
  PatchDevSeedStage2,
} from "@m/dev/patches/PatchDevSeed";
import { RouterDev } from "@m/dev/route/RouterDev";
import { ServiceOpenApiDoc } from "@m/dev/services/ServiceOpenApiDoc";
import { RouterDms } from "@m/dms/routers/RouterDms";
import { RouterInternalAudit } from "@m/internal-audit/routers/RouterInternalAudit";
import { JobOutboundIntegrationRunner } from "@m/measurement/jobs/JobOutboundIntegrationRunner";
import { MqConsumerAgentReading } from "@m/measurement/mq-consumers/MqConsumerAgentReading";
import { MqConsumerAgentStat } from "@m/measurement/mq-consumers/MqConsumerAgentStat";
import { PatchMetricResourceValueAggregatedTable } from "@m/measurement/patches/PatchMetricResourceValueAggregatedTable";
import { RouterAMeter } from "@m/measurement/routers/RouterAMeter";
import { RouterAMeterSlice } from "@m/measurement/routers/RouterAMeterSlice";
import { RouterAMetric } from "@m/measurement/routers/RouterAMetric";
import { RouterASeu } from "@m/measurement/routers/RouterASeu";
import { RouterMeasurement } from "@m/measurement/routers/RouterMeasurement";
import { RouterPlanning } from "@m/planning/routers/RouterPlanning";
import { RouterProductBase } from "@m/product-base/routers/RouterProductBase";
import { MqConsumerReport } from "@m/report/mq-consumers/MqConsumerReport";
import { PatchReportTemplateDev } from "@m/report/patches/PatchReportTemplateDev";
import { PatchReportTemplateEnergyReview } from "@m/report/patches/PatchReportTemplateEnergyReview";
import { PatchReportTemplateIndustrialBusinessNotification } from "@m/report/patches/PatchReportTemplateIndustrialBusinessNotification";
import { PatchReportTemplateManagementReview } from "@m/report/patches/PatchReportTemplateManagementReview";
import { PatchReportTemplatePreliminary } from "@m/report/patches/PatchReportTemplatePreliminary";
import { RouterReport } from "@m/report/routers/RouterReport";
import { RouterSupplyChain } from "@m/supply-chain/routers/RouterSupplyChain";
import { RouterSupport } from "@m/support/routers/RouterSupport";
import { RouterUSys } from "@m/sys/routers/RouterUSys";

export function initModules(env: IEnv) {
  if (!ServiceEnv.isProd()) {
    ServiceJob.registerHandler("EXAMPLE", JobExample);
  }
  ServiceJob.registerHandler(
    "METRIC_OUTBOUND_INTEGRATION_RUNNER",
    JobOutboundIntegrationRunner,
  );

  if (env.QUEUE_AGENT_READINGS) {
    ServiceMessageQueue.registerConsumer(
      env.QUEUE_AGENT_READINGS,
      MqConsumerAgentReading,
      { isTopic: true },
    );
  }

  if (env.QUEUE_AGENT_STATS) {
    ServiceMessageQueue.registerConsumer(
      env.QUEUE_AGENT_STATS,
      MqConsumerAgentStat,
      {
        isTopic: true,
        isTransient: true,
      },
    );
  }

  if (env.QUEUE_REPORT_PDF) {
    ServiceMessageQueue.registerConsumer(
      env.QUEUE_REPORT_PDF,
      MqConsumerReport,
    );
  }

  if (env.QUEUE_ANALYZER_FEATURE_ELIMINATION_RESULT) {
    ServiceMessageQueue.registerConsumer(
      env.QUEUE_ANALYZER_FEATURE_ELIMINATION_RESULT,
      MqConsumerDriverSuggestions,
    );
  }

  ServiceRuntimePatcher.register(PatchSysOrgAndUser);
  // Must be after sys org and user
  ServiceRuntimePatcher.register(PatchMetricResourceValueAggregatedTable);
  ServiceRuntimePatcher.register(PatchReportTemplatePreliminary);
  ServiceRuntimePatcher.register(PatchReportTemplateEnergyReview);
  ServiceRuntimePatcher.register(
    PatchReportTemplateIndustrialBusinessNotification,
  );

  ServiceRuntimePatcher.register(PatchReportTemplateManagementReview);
  if (!ServiceEnv.isProd()) {
    ServiceRuntimePatcher.register(PatchExampleOrgAndUser);
  }
  // Do not run seed on prod and test envs
  if (!ServiceEnv.isProd() && !ServiceEnv.isTest()) {
    ServiceRuntimePatcher.register(PatchExampleJob);
    if (!env.DEMO) {
      ServiceRuntimePatcher.register(PatchDevSeedStage1);
      ServiceRuntimePatcher.register(PatchDevSeedStage2);
    }
    ServiceRuntimePatcher.register(PatchReportTemplateDev);
  }
  if (env.DEMO) {
    ServiceRuntimePatcher.register(PatchDemoSeedStage1);
    ServiceRuntimePatcher.register(PatchDemoSeedStage2);
  }

  if (!ServiceEnv.isProd()) {
    ServiceRouteManager.addGuestRoute("/dev", RouterDev);
  }
  ServiceRouteManager.addGuestRoute(
    "/organization-banner",
    RouterGOrganizationBanner,
  );
  ServiceRouteManager.addUserRoute("/sys", RouterUSys);

  ServiceRouteManager.addAccessTokenRoute("/metric", RouterAMetric);
  ServiceRouteManager.addAccessTokenRoute("/meter", RouterAMeter);
  ServiceRouteManager.addAccessTokenRoute("/meter-slice", RouterAMeterSlice);
  ServiceRouteManager.addAccessTokenRoute("/seu", RouterASeu);

  ServiceRouteManager.addUserRoute("/core", RouterCore);
  ServiceRouteManager.addUserRoute("/base", RouterBase);
  ServiceRouteManager.addUserRoute("/organization", RouterOrganization);

  ServiceRouteManager.addUserRoute("/commitment", RouterCommitment);
  ServiceRouteManager.addUserRoute("/planning", RouterPlanning);
  ServiceRouteManager.addUserRoute("/support", RouterSupport);
  ServiceRouteManager.addUserRoute("/measurement", RouterMeasurement);
  ServiceRouteManager.addUserRoute("/internal-audit", RouterInternalAudit);
  ServiceRouteManager.addUserRoute("/product-base", RouterProductBase);
  ServiceRouteManager.addUserRoute("/analysis", RouterAnalysis);
  ServiceRouteManager.addUserRoute("/agent", RouterAgent);
  ServiceRouteManager.addUserRoute("/dashboard", RouterDashboard);
  ServiceRouteManager.addUserRoute("/report", RouterReport);
  ServiceRouteManager.addUserRoute("/dms", RouterDms);
  ServiceRouteManager.addUserRoute("/supply-chain", RouterSupplyChain);

  ServiceOpenApiDoc.registerSchema(
    "IDtoWsServerMessage",
    SchemaWsServerMessage,
  );
}
