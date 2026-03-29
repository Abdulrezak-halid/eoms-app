import { EXAMPLE_USER_EMAIL, IUnit, UtilDate } from "common";
import { eq } from "drizzle-orm";

import { ROOT_ORG_ID, ROOT_ORG_USER_ID } from "@/constants";

import { TbAgent } from "@m/agent/orm/TbAgent";
import { ServiceAgent } from "@m/agent/services/ServiceAgent";
import { MqConsumerDriverSuggestions } from "@m/analysis/mq-consumers/MqConsumerDriverSuggestions";
import { ServiceAdvancedRegression } from "@m/analysis/services/ServiceAdvancedRegression";
import { ServiceEnpi } from "@m/analysis/services/ServiceEnpi";
import { TbUser } from "@m/base/orm/TbUser";
import { ServiceAccessToken } from "@m/base/services/ServiceAccessToken";
import { ServiceDepartment } from "@m/base/services/ServiceDepartment";
import { ServiceOrganizationBanner } from "@m/base/services/ServiceOrganizationBanner";
import { ServiceOrganizationPartner } from "@m/base/services/ServiceOrganizationPartner";
import { ServiceOrganizationPartnerToken } from "@m/base/services/ServiceOrganizationPartnerToken";
import { ServiceUser } from "@m/base/services/ServiceUser";
import { ServiceComplianceObligation } from "@m/commitment/services/ServiceComplianceObligation";
import { ServiceComplianceObligationArticle } from "@m/commitment/services/ServiceComplianceObligationArticle";
import { ServiceEnergyPolicy } from "@m/commitment/services/ServiceEnergyPolicy";
import { ServiceInternalExternalConsideration } from "@m/commitment/services/ServiceInternalExternalConsideration";
import { ServiceNeedAndExpectation } from "@m/commitment/services/ServiceNeedAndExpectation";
import { ServiceScopeAndLimit } from "@m/commitment/services/ServiceScopeAndLimit";
import { IContextUser } from "@m/core/interfaces/IContext";
import { ServiceCalendar } from "@m/core/services/ServiceCalendar";
import { ServiceRuntimePatcher } from "@m/core/services/ServiceRuntimePatcher";
import { UtilContext } from "@m/core/utils/UtilContext";
import { ServiceDashboardWidget } from "@m/dashboard/services/ServiceDashboardWidget";
import { ServiceQdmsIntegration } from "@m/dms/services/ServiceQdmsIntegration";
import { ServiceNonconformity } from "@m/internal-audit/services/ServiceNonconformity";
import { ServicePlan } from "@m/internal-audit/services/ServicePlan";
import { ServiceWorkflow } from "@m/internal-audit/services/ServiceWorkflow";
import { IMetricResourceLabel } from "@m/measurement/interfaces/IMetricResourceLabel";
import { MqConsumerAgentStat } from "@m/measurement/mq-consumers/MqConsumerAgentStat";
import { TbMetric } from "@m/measurement/orm/TbMetric";
import { TbSeu } from "@m/measurement/orm/TbSeu";
import { ServiceDataViewProfile } from "@m/measurement/services/ServiceDataViewProfile";
import { ServiceInboundIntegration } from "@m/measurement/services/ServiceInboundIntegration";
import { ServiceMeter } from "@m/measurement/services/ServiceMeter";
import { ServiceMeterSlice } from "@m/measurement/services/ServiceMeterSlice";
import { ServiceMetric } from "@m/measurement/services/ServiceMetric";
import { ServiceOutboundIntegration } from "@m/measurement/services/ServiceOutboundIntegration";
import { ServiceSeu } from "@m/measurement/services/ServiceSeu";
import { ServiceActionPlan } from "@m/planning/services/ServiceActionPlan";
import { ServiceDesign } from "@m/planning/services/ServiceDesign";
import { ServiceDesignIdea } from "@m/planning/services/ServiceDesignIdea";
import { ServiceEnergySavingOpportunity } from "@m/planning/services/ServiceEnergySavingOpportunity";
import { ServiceRiskForceFieldAnalysis } from "@m/planning/services/ServiceRiskForceFieldAnalysis";
import { ServiceRiskGapAnalysis } from "@m/planning/services/ServiceRiskGapAnalysis";
import { ServiceRiskSwotAnalysis } from "@m/planning/services/ServiceRiskSwotAnalysis";
import { ServiceTarget } from "@m/planning/services/ServiceTarget";
import { ServiceProduct } from "@m/product-base/services/ServiceProduct";
import { MqConsumerReport } from "@m/report/mq-consumers/MqConsumerReport";
import { ServiceReport } from "@m/report/services/ServiceReport";
import { ServiceReportAttachment } from "@m/report/services/ServiceReportAttachment";
import { ServiceOperation } from "@m/supply-chain/services/ServiceOperation";
import { ServicePipeline } from "@m/supply-chain/services/ServicePipeline";
import { ServiceCalibrationPlan } from "@m/support/services/ServiceCalibrationPlan";
import { ServiceCommunicationAwarenessPlan } from "@m/support/services/ServiceCommunicationAwarenessPlan";
import { ServiceCopMeasurementPlan } from "@m/support/services/ServiceCopMeasurementPlan";
import { ServiceCriticalOperationalParameter } from "@m/support/services/ServiceCriticalOperationalParameter";
import { ServiceEnpiMeasurementPlan } from "@m/support/services/ServiceEnpiMeasurementPlan";
import { ServiceMaintenanceActivity } from "@m/support/services/ServiceMaintenanceActivity";
import { ServiceProcurement } from "@m/support/services/ServiceProcurement";
import { ServiceProcurementProcedure } from "@m/support/services/ServiceProcurementProcedure";
import { ServiceTraining } from "@m/support/services/ServiceTraining";

import { AssetOrganizationBanner } from "../assets/AssetOrganizationBanner";
import { AssetPdf } from "../assets/AssetPdf";
import { ServiceMockSource } from "../services/ServiceMockSource";

const metricDataSeedRange = 30 * 24 * 60 * 60 * 1000; // 30 days

export const PatchDemoSeedStage1 = ServiceRuntimePatcher.create(
  "DEMO_SEED_STAGE_1",
  async (cCore) => {
    const [exampleUser] = await cCore.db
      .select({ orgId: TbUser.orgId, userId: TbUser.id })
      .from(TbUser)
      .where(eq(TbUser.email, EXAMPLE_USER_EMAIL));
    if (!exampleUser) {
      throw new Error("Example user is not found.");
    }

    const [exampleUser2] = await cCore.db
      .select({ orgId: TbUser.orgId, userId: TbUser.id })
      .from(TbUser)
      .where(eq(TbUser.email, "admin@example2.com"));

    if (!exampleUser && !exampleUser2) {
      throw new Error("Example user is not found.");
    }

    const metricDataStart = new Date(Date.now() - metricDataSeedRange);
    const metricDataStartDate = UtilDate.objToLocalIsoDate(metricDataStart);
    const metricDataStartDatetime = UtilDate.objToIsoDatetime(metricDataStart);

    const today = new Date();
    const todayDate = UtilDate.objToLocalIsoDate(today);
    const todayDatetime = UtilDate.objToIsoDatetime(today);

    const mockDataIntervalSecs = 60 * 15; // 15 min

    const cUser: IContextUser = {
      ...cCore,
      orgId: exampleUser.orgId,
      session: {
        token: "DUMMY",
        ...exampleUser,
        permissions: ["/"],
        orgPlan: { features: [], maxUserCount: 4 },
      },
    };

    const cUser2: IContextUser = {
      ...cCore,
      orgId: exampleUser2.orgId,
      session: {
        token: "DUMMY",
        ...exampleUser2,
        permissions: ["/"],
        orgPlan: { features: [], maxUserCount: 4 },
      },
    };

    await cCore.db.transaction(async (tx) => {
      const c = UtilContext.overwriteDb(cUser, tx);
      const c2 = UtilContext.overwriteDb(cUser2, tx);

      const cSys: IContextUser = {
        ...cCore,
        orgId: ROOT_ORG_ID,
        db: tx,
        session: {
          token: "DUMMY",
          orgId: ROOT_ORG_ID,
          userId: ROOT_ORG_USER_ID,
          permissions: ["/"],
          orgPlan: { features: ["SYSTEM"], maxUserCount: 4 },
        },
      };

      const anotherUser = await ServiceUser.create(c, {
        email: "m.demir@arisometal.demo",
        name: "Mehmet",
        surname: "Demir",
        password: "secret",
      });

      const reviewUser = await ServiceUser.create(c, {
        email: "e.kaya@arisometal.demo",
        name: "Elif",
        surname: "Kaya",
        password: "secret",
      });

      // Module Base --------------------------------------------------------------
      const departmentId = await ServiceDepartment.create(c, {
        name: "Production - Stamping Hall",
        description: "Steel and aluminum stamping and forming operations.",
      });

      const mainDepartmentId = await ServiceDepartment.create(c, {
        name: "Utilities & Main Infrastructure",
        description:
          "Facility-wide utility distribution and main metering points.",
      });

      const departmentId2 = await ServiceDepartment.create(c, {
        name: "Production - Assembly Line",
        description:
          "Sub-assembly and final assembly of automotive components.",
      });

      const departmentId3 = await ServiceDepartment.create(c, {
        name: "HVAC & Building Services",
        description:
          "Heating, ventilation, air conditioning and general building services.",
      });

      await ServiceDepartment.create(c, {
        name: "Warehouse & Logistics",
        description: "Raw material and finished goods storage and dispatch.",
      });

      await ServiceCalendar.create(c, {
        name: "2025 Energy Management Review Calendar",
        description:
          "Scheduled review periods for energy performance indicators and management review meetings.",
        datetime: "2025-01-01T00:00:00.000Z",
        type: "CUSTOM",
      });

      await ServiceOrganizationBanner.save(
        c,
        c.session.orgId,
        AssetOrganizationBanner.logoBase64,
      );

      const token = await ServiceOrganizationPartnerToken.save(c);
      await ServiceOrganizationPartner.create(c2, token);

      // Module Commitment ----------------------------------------------------------
      await ServiceEnergyPolicy.create(c, {
        content:
          "Aristo Metal Works commits to continuously improving energy performance by reducing specific energy consumption in stamping and assembly operations by at least 10% over the next three years through systematic monitoring, targeted investments, and personnel training.",
        period: "QUARTERLY",
        type: "Energy Consumption Reduction",
        target:
          "Reduce specific electricity consumption by 10% relative to 2023 baseline within three years.",
      });
      await ServiceEnergyPolicy.create(c, {
        content:
          "The organization is committed to achieving net-zero carbon emissions from direct energy use by 2030 through a combination of energy efficiency improvements, renewable energy procurement, and fuel switching from natural gas to green hydrogen in boiler operations.",
        period: "YEARLY",
        type: "Carbon Neutrality Commitment",
        target:
          "Achieve net-zero Scope 1 and Scope 2 emissions by 2030 with a verified reduction of 40% by 2027.",
      });

      const complianceAbligationId = await ServiceComplianceObligation.create(
        c,
        {
          complianceObligation:
            "TS EN ISO 50001:2018 - Energy Management Systems",
          officialNewspaperNo: "31026",
          officialNewspaperPublicationDate: "2019-02-11",
          reviewPeriod: "YEARLY",
          reviewDate: "2024-02-11",
          revisionNo: "3",
          revisionDate: "2024-01-15",
          isLegalActive: true,
        },
      );
      const complianceAbligationId2 = await ServiceComplianceObligation.create(
        c,
        {
          complianceObligation:
            "Electricity Market Licensing Regulation - Energy Consumption Reporting Obligation",
          officialNewspaperNo: "28539",
          officialNewspaperPublicationDate: "2013-02-02",
          reviewPeriod: "YEARLY",
          reviewDate: "2023-02-02",
          revisionNo: "7",
          revisionDate: "2023-08-21",
          isLegalActive: true,
        },
      );
      await ServiceComplianceObligationArticle.create(
        c,
        complianceAbligationId,
        {
          relatedArticleNo: "Clause 6.3",
          description:
            "Energy review and identification of significant energy uses and energy performance indicators.",
          currentApplication:
            "Applied - Annual energy review conducted by certified energy manager.",
          conformityAssessment: "Passed",
          conformityAssessmentPeriod: "YEARLY",
          lastConformityAssessment: "2024-03-10",
        },
      );
      await ServiceComplianceObligationArticle.create(
        c,
        complianceAbligationId2,
        {
          relatedArticleNo: "Article 12",
          description:
            "Annual submission of electricity consumption data to the national energy regulator including peak demand, consumption by tariff zone, and power factor values.",
          currentApplication:
            "Active - Data submitted via the regulator online portal each February.",
          conformityAssessment: "Passed",
          conformityAssessmentPeriod: "YEARLY",
          lastConformityAssessment: "2025-02-03",
        },
      );

      const internalExternalConsideration =
        await ServiceInternalExternalConsideration.create(c, {
          specific: "High energy cost share in total manufacturing cost",
          impactPoint: "Profitability and product pricing competitiveness",
          evaluationMethod:
            "Annual energy cost ratio analysis against total production cost",
          revisionDate: "2024-06-30",
          departmentIds: [departmentId],
        });

      await ServiceInternalExternalConsideration.update(
        c,
        internalExternalConsideration,
        {
          specific: "Rising electricity tariffs and grid instability risk",
          impactPoint: "Production continuity and operational cost control",
          evaluationMethod:
            "Quarterly review of utility invoices and grid outage logs",
          revisionDate: "2024-06-30",
          departmentIds: [departmentId],
        },
      );

      const internalExternalConsideration2 =
        await ServiceInternalExternalConsideration.create(c, {
          specific:
            "Customer requirement for verified carbon footprint disclosure",
          impactPoint: "Market access and OEM supply chain qualification",
          evaluationMethod:
            "Annual GHG inventory aligned with ISO 14064-1 and customer audit schedule.",
          revisionDate: "2025-03-31",
          departmentIds: [departmentId2],
        });

      await ServiceInternalExternalConsideration.update(
        c,
        internalExternalConsideration2,
        {
          specific: "OEM supply chain carbon footprint disclosure requirement",
          impactPoint: "Supply chain qualification and contract renewal",
          evaluationMethod:
            "Annual third-party verified GHG report submitted to OEM portal by March 31.",
          revisionDate: "2025-03-31",
          departmentIds: [departmentId2],
        },
      );

      await ServiceNeedAndExpectation.create(c, {
        interestedParty: "National Energy Regulatory Authority (EPDK)",
        interestedPartyNeedsAndExpectations:
          "Timely and accurate reporting of annual energy consumption and demand data.",
        isIncludedInEnms: true,
        evaluationMethod:
          "Verification against official submission records and regulator correspondence.",
        revisionDate: "2024-12-31",
        departmentIds: [departmentId],
      });
      await ServiceNeedAndExpectation.create(c, {
        interestedParty: "Tier-1 Automotive OEM Customers",
        interestedPartyNeedsAndExpectations:
          "Reduction in embodied carbon per component and implementation of renewable energy sourcing, aligned with customer Scope 3 targets.",
        isIncludedInEnms: true,
        evaluationMethod:
          "Annual sustainability questionnaire responses and third-party verified emission factor disclosures.",
        revisionDate: "2025-06-30",
        departmentIds: [departmentId2],
      });

      await ServiceScopeAndLimit.create(c, {
        physicalLimits:
          "Stamping Hall Building (Hall A) and associated utility distribution boards.",
        excludedResources: ["GAS"],
        excludedResourceReason:
          "Gas supply to Stamping Hall is metered at building level and included in Boiler Station scope.",
        products: [
          "Automotive Stamped Body Panels",
          "Structural Brackets and Reinforcements",
        ],
        departmentIds: [departmentId],
      });
      await ServiceScopeAndLimit.create(c, {
        physicalLimits:
          "Full site boundary including Stamping Hall, Assembly Line, HVAC plant rooms, warehouse, and all on-site utility infrastructure.",
        excludedResources: [],
        excludedResourceReason:
          "No energy resources are excluded from the full-site scope.",
        products: [
          "Automotive Stamped Body Panels",
          "Structural Brackets and Reinforcements",
          "Sub-assembled Door Modules",
          "Welded Frame Components",
        ],
        departmentIds: [departmentId2],
      });

      // Module Agent ---------------------------------------------------------
      const agentIdTemp = await ServiceAgent.create(cSys, {
        name: "IIoT Gateway Unit - Assembly Hall",
        serialNo: "IIOT-GW-HALL-B-2024-0042",
        description:
          "IIoT gateway deployed in the assembly hall to collect real-time power consumption data from PLC panels and forward readings to the central energy management platform.",
        assignedOrgId: exampleUser.orgId,
      });
      // Use a fixed id for agent for external tests to be convenient
      const agentId = "77777777-7777-7777-8777-777777777777";
      await cSys.db
        .update(TbAgent)
        .set({ id: agentId })
        .where(eq(TbAgent.id, agentIdTemp));

      await ServiceAgent.create(cSys, {
        name: "Smart Meter Concentrator - Stamping Hall",
        serialNo: "SMC-STAMPING-HALL-A-2025-0001",
        description: `Smart meter concentrator installed in Stamping Hall A distribution room.
Collects pulse outputs from 12 sub-meters covering press lines, ventilation, lighting, and auxiliary circuits.
Transmits aggregated 15-minute interval data to the energy management server via secured LAN connection.`,
        assignedOrgId: exampleUser.orgId,
      });

      // Module Measurement ----------------------------------------------------------

      async function seedMetricResourceValue(
        metricId: string,
        unit: IUnit,
        waves: { vMul: number; hMul: number }[],
        options?: {
          valueOffset?: number;
          labels?: IMetricResourceLabel[];
          dateRange?: number;
          intervalSecs?: number;
          dateOffset?: number;
          cumulative?: boolean;
        },
      ) {
        const valueOffset = options?.valueOffset || 0;
        const dateRange = options?.dateRange || metricDataSeedRange;
        const intervalSecs = options?.intervalSecs || mockDataIntervalSecs;
        const dateOffset = options?.dateOffset || 0;

        const dateStart = UtilDate.objToIsoDatetime(
          new Date(Date.now() - dateRange - dateOffset),
        );
        const dateEnd = UtilDate.objToIsoDatetime(
          new Date(Date.now() - dateOffset),
        );
        const data = ServiceMockSource.processWaves({
          waves,
          datetime: dateStart,
          datetimeTo: dateEnd,
          intervalSecs,
          cumulative: options?.cumulative,
        })
          .map(({ x, y }) => ({
            value: y + valueOffset,
            datetime: x,
          }))
          .filter(() => Math.random() < 0.9);

        return await ServiceMetric.addValues(
          c,
          c.session.orgId,
          metricId,
          unit,
          data,
          options?.labels || [
            {
              type: "INTERNAL",
              key: "SOURCE",
              value: "DEV_SEED",
            },
          ],
        );
      }

      // Stamping Hall main feeder – daily production cycle with shift variation
      const metricId1 = await ServiceMetric.create(c, {
        name: "Stamping Hall - Main Feeder Energy",
        description:
          "Cumulative energy reading from the main LV feeder supplying Stamping Hall press lines, ventilation, and auxiliary loads.",
        type: "COUNTER",
        unitGroup: "ENERGY",
      });

      await seedMetricResourceValue(
        metricId1,
        "ENERGY_KWH",
        [
          { vMul: 120, hMul: 24 }, // Daily production cycle
          { vMul: 40, hMul: 8 }, // Shift-level variation
        ],
        {
          valueOffset: 80,
          cumulative: true,
        },
      );

      // Boiler No.1 return line temperature
      const metricId2 = await ServiceMetric.create(c, {
        name: "Boiler No.1 - Return Line Temperature",
        description:
          "PT100 sensor reading on the hot-water return line of Industrial Boiler No.1 in the Boiler Station.",
        type: "GAUGE",
        unitGroup: "TEMPERATURE",
      });

      await seedMetricResourceValue(
        metricId2,
        "TEMPERATURE_CELSIUS",
        [
          { vMul: 12, hMul: 12 }, // Twice-daily heating cycle
          { vMul: 4, hMul: 3 }, // Short-term fluctuation
        ],
        {
          valueOffset: 72, // Baseline ~72 °C
        },
      );

      // Boiler Station natural gas flow
      const metricId3 = await ServiceMetric.create(c, {
        name: "Boiler Station - Natural Gas Flow",
        description:
          "Cumulative natural gas volume from the ultrasonic flow meter at the boiler station gas manifold. Used for boiler efficiency tracking and GHG reporting.",
        type: "COUNTER",
        unitGroup: "VOLUME",
      });

      await seedMetricResourceValue(
        metricId3,
        "VOLUME_METRE_CUBE",
        [{ vMul: 55, hMul: 12 }],
        {
          valueOffset: 30,
          cumulative: true,
        },
      );

      // Compressor Room energy (also used as meter slice source)
      const metricId4 = await ServiceMetric.create(c, {
        name: "Compressor Room - Energy Consumption",
        description:
          "Cumulative energy from the compressor room panel, covering three rotary screw compressors and the dryer units.",
        type: "COUNTER",
        unitGroup: "ENERGY",
      });

      await seedMetricResourceValue(
        metricId4,
        "ENERGY_KWH",
        [{ vMul: 45, hMul: 8 }],
        {
          valueOffset: 25,
          cumulative: true,
        },
      );

      // High-frequency press line power monitor (1-minute interval)
      const metricId5 = await ServiceMetric.create(c, {
        name: "Press Line A - High-Frequency Power Monitor",
        description:
          "1-minute interval energy readings from the power analyser on Press Line A, used for demand-profile and transient analysis.",
        type: "COUNTER",
        unitGroup: "ENERGY",
      });
      await seedMetricResourceValue(
        metricId5,
        "ENERGY_KWH",
        [
          { vMul: 35, hMul: 8 },
          { vMul: 15, hMul: 1 },
        ],
        {
          dateRange: 2 * 24 * 60 * 60 * 1000, // 2 days
          intervalSecs: 60, // Minutely
          valueOffset: 18,
          cumulative: true,
        },
      );

      // Chiller unit coolant supply flow rate
      const metricId6 = await ServiceMetric.create(c, {
        name: "Chiller Unit CH-02 - Coolant Supply Flow Rate",
        description:
          "Instantaneous volumetric flow rate of chilled water on the supply side of Chiller Unit CH-02, measured by electromagnetic flow meter.",
        type: "GAUGE",
        unitGroup: "VOLUME",
      });

      await seedMetricResourceValue(
        metricId6,
        "VOLUME_METRE_CUBE",
        [
          { vMul: 18, hMul: 8 },
          { vMul: 6, hMul: 1 },
        ],
        {
          valueOffset: 22,
        },
      );

      // Facility main electric meter
      const metricId7 = await ServiceMetric.create(c, {
        name: "Facility Main Electric Meter",
        description:
          "Cumulative active energy at the facility incoming HV/LV transformer metering point. Reference meter for all electricity balance calculations.",
        unitGroup: "ENERGY",
        type: "COUNTER",
      });

      await seedMetricResourceValue(
        metricId7,
        "ENERGY_KWH",
        [{ vMul: 280, hMul: 24 }],
        {
          valueOffset: 150,
          cumulative: true,
        },
      );

      // Facility main gas meter
      const metricId8 = await ServiceMetric.create(c, {
        name: "Facility Main Gas Meter",
        description:
          "Cumulative natural gas energy (calorific value basis) from the distribution company boundary meter. Reference meter for gas balance and GHG reporting.",
        unitGroup: "ENERGY",
        type: "COUNTER",
      });

      await seedMetricResourceValue(
        metricId8,
        "ENERGY_KWH",
        [{ vMul: 180, hMul: 24 }],
        {
          valueOffset: 90,
          cumulative: true,
        },
      );

      // Facility main water meter
      const metricId9 = await ServiceMetric.create(c, {
        name: "Facility Main Water Meter",
        description:
          "Cumulative potable water volume from the municipal supply boundary meter. Used for water intensity KPI and leak detection.",
        unitGroup: "VOLUME",
        type: "COUNTER",
      });

      await seedMetricResourceValue(
        metricId9,
        "VOLUME_METRE_CUBE",
        [{ vMul: 40, hMul: 24 }],
        {
          valueOffset: 15,
          cumulative: true,
        },
      );

      // IIoT agent integration metric (empty – data arrives via agent)
      const metricIdAgentIntegration = await ServiceMetric.create(c, {
        name: "IoT Gateway - Assembly Hall Real-Time Power",
        description: null,
        type: "COUNTER",
        unitGroup: "ENERGY",
      });

      // Heat treatment furnace multi-zone temperatures
      const metricId10 = await ServiceMetric.create(c, {
        name: "Heat Treatment Furnace - Zone Temperature",
        description: null,
        unitGroup: "TEMPERATURE",
        type: "GAUGE",
      });

      await seedMetricResourceValue(
        metricId10,
        "TEMPERATURE_CELSIUS",
        [{ vMul: 20, hMul: 6 }],
        { valueOffset: 820 }, // Zone 1 ~820 °C
      );
      await seedMetricResourceValue(
        metricId10,
        "TEMPERATURE_CELSIUS",
        [{ vMul: 18, hMul: 4 }],
        {
          valueOffset: 790, // Zone 2 slightly lower
          labels: [{ type: "USER_DEFINED", key: "Zone", value: "Zone 2" }],
        },
      );

      // Assembly Line B shift energy tracker – two overlapping resources
      const metricId11 = await ServiceMetric.create(c, {
        name: "Assembly Line B - Shift Energy Tracker",
        description: null,
        unitGroup: "ENERGY",
        type: "COUNTER",
      });

      await seedMetricResourceValue(
        metricId11,
        "ENERGY_KWH",
        [{ vMul: 55, hMul: 8 }],
        {
          valueOffset: 20,
          dateRange: 2 * 24 * 60 * 60 * 1000, // 2 days
          intervalSecs: 60 * 15, // 15 min
          dateOffset: 2 * 24 * 60 * 60 * 1000, // 2 days ago
          cumulative: true,
        },
      );
      await seedMetricResourceValue(
        metricId11,
        "ENERGY_KWH",
        [{ vMul: 55, hMul: 8 }],
        {
          valueOffset: 20,
          labels: [
            { type: "USER_DEFINED", key: "Shift", value: "Night Shift" },
          ],
          dateRange: 2 * 24 * 60 * 60 * 1000, // 2 days
          intervalSecs: 60 * 15, // 15 min
          cumulative: true,
        },
      );

      // Metric > Meter
      const stampingMeter = await ServiceMeter.create(c, {
        name: "Stamping Hall Main Feeder",
        energyResource: "ELECTRIC",
        metricId: metricId1,
        departmentId,
        energyConversionRate: 1,
        isMain: false,
      });
      const meterId = stampingMeter.id;

      const gasMeter = await ServiceMeter.create(c, {
        name: "Boiler Station Gas Meter",
        energyResource: "GAS",
        metricId: metricId3,
        departmentId,
        energyConversionRate: 10.55, // kWh per Nm³ (natural gas HHV)
        isMain: false,
      });
      const meterId2 = gasMeter.id;

      const compressorMeter = await ServiceMeter.create(c, {
        name: "Compressor Room Meter",
        energyResource: "ELECTRIC",
        metricId: metricId4,
        departmentId: departmentId2,
        energyConversionRate: 1,
        isMain: false,
      });

      const electricMainMeter = await ServiceMeter.create(c, {
        name: "Facility Main Electric Meter",
        energyResource: "ELECTRIC",
        metricId: metricId7,
        departmentId: mainDepartmentId,
        energyConversionRate: 1,
        isMain: true,
      });

      const gasMainMeter = await ServiceMeter.create(c, {
        name: "Facility Main Gas Meter",
        energyResource: "GAS",
        metricId: metricId8,
        departmentId: mainDepartmentId,
        energyConversionRate: 1,
        isMain: true,
      });

      const waterMainMeter = await ServiceMeter.create(c, {
        name: "Facility Main Water Meter",
        energyResource: "WATER",
        metricId: metricId9,
        departmentId: mainDepartmentId,
        energyConversionRate: 1,
        isMain: true,
      });

      const { createdIds: createdSliceIds } = await ServiceMeterSlice.save(
        c,
        meterId,
        [
          { rate: 0.55, departmentId: mainDepartmentId, isMain: true },
          { rate: 0.25, departmentId: departmentId, isMain: false },
          { rate: 0.2, departmentId: departmentId3, isMain: false },
        ],
      );
      const meterSliceId1 = createdSliceIds[0];
      const meterSliceId2 = createdSliceIds[1];
      const meterSliceId3 = createdSliceIds[2];

      await ServiceMeterSlice.save(c, meterId2, [
        { rate: 1, departmentId: departmentId2, isMain: false },
      ]);

      const {
        createdIds: [meter3SliceId1],
      } = await ServiceMeterSlice.save(c, compressorMeter.id, [
        { rate: 1, departmentId: departmentId3, isMain: false },
      ]);

      await ServiceMeterSlice.save(c, electricMainMeter.id, [
        { rate: 1, departmentId: mainDepartmentId, isMain: true },
      ]);

      await ServiceMeterSlice.save(c, gasMainMeter.id, [
        { rate: 1, departmentId: mainDepartmentId, isMain: true },
      ]);

      await ServiceMeterSlice.save(c, waterMainMeter.id, [
        { rate: 1, departmentId: mainDepartmentId, isMain: true },
      ]);

      const seuId = await ServiceSeu.create(c, {
        name: "Stamping Hall - Variable Speed Drives",
        departmentIds: [departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      });

      const seuId2 = await ServiceSeu.create(c, {
        name: "Industrial Boiler System",
        departmentIds: [departmentId2],
        energyResource: "GAS",
        meterSliceIds: [],
      });

      const seuId3 = await ServiceSeu.create(c, {
        name: "Compressed Air System",
        departmentIds: [],
        energyResource: "ELECTRIC",
        meterSliceIds: [meterSliceId3],
      });

      await ServiceSeu.create(c, {
        name: "Assembly Hall Lighting & Climate Control",
        departmentIds: [],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter3SliceId1],
      });

      // Metric > Integration
      await ServiceOutboundIntegration.create(
        c,
        "Stamping Hall Energy Feed",
        {
          period: "HOURLY",
          type: "MOCK_SOURCE",
          param: { waves: [{ vMul: 120, hMul: 24 }] },
        },
        [
          {
            outputKey: "default",
            metricId: metricId1,
            unit: "ENERGY_KWH",
          },
        ],
      );

      await ServiceOutboundIntegration.create(
        c,
        "Boiler Temperature Telemetry",
        {
          period: "MINUTELY",
          type: "MOCK_SOURCE",
          param: { waves: [{ vMul: 12, hMul: 12 }] },
        },
        [
          {
            outputKey: "default",
            metricId: metricId2,
            unit: "TEMPERATURE_CELSIUS",
          },
        ],
      );

      await ServiceOutboundIntegration.create(
        c,
        "Main Electric Meter Daily Sync",
        {
          period: "DAILY",
          type: "MOCK_SOURCE",
          param: { waves: [{ vMul: 280, hMul: 24 }] },
        },
        [
          {
            outputKey: "default",
            metricId: metricId5,
            unit: "ENERGY_KWH",
          },
        ],
      );

      await ServiceInboundIntegration.create(
        c,
        "External SCADA Webhook",
        { type: "WEBHOOK" },
        [
          {
            outputKey: "default",
            metricId: metricId3,
            unit: "VOLUME_METRE_CUBE",
          },
        ],
      );

      await ServiceInboundIntegration.create(
        c,
        "Assembly Hall Agent Integration",
        { type: "AGENT", agentId },
        [
          {
            outputKey: "A",
            metricId: metricIdAgentIntegration,
            unit: "ENERGY_MWH",
          },
        ],
      );

      // Metric > View > Profile
      const dataViewId = await ServiceDataViewProfile.create(c, {
        description: "Overview of main production and utility energy metrics.",
        name: "Energy Metrics Overview",
        options: {
          type: "METRIC",
          metricIds: [metricId1, metricId2, metricId3],
        },
      });

      await ServiceDataViewProfile.create(c, {
        description: "Main infrastructure sub-meter slice performance.",
        name: "Main Infrastructure Meters",
        options: {
          type: "METER_SLICE",
          meterSliceIds: [meterSliceId1, meterSliceId2],
        },
      });

      await ServiceDataViewProfile.create(c, {
        description: "Significant Energy Use consumption trend view.",
        name: "Significant Energy Uses",
        options: {
          type: "SEU",
          seuIds: [seuId, seuId3],
        },
      });

      await MqConsumerAgentStat(
        c,
        Buffer.from(
          JSON.stringify({
            version: "0.1",
            agentId,
            message: {
              type: "STAT",
              stats: {
                arch: "arm",
                platform: "linux",
                host: "iiot-gateway-01.arismetal.local",
                memoryTotal: 4294967296,
                memoryFree: 1879048192,
                cpu: [
                  {
                    model: "ARMv7 Cortex-A53 @ 1.20GHz",
                    speed: 1200,
                    times: {
                      user: 28400,
                      nice: 0,
                      sys: 12500,
                      idle: 920000,
                      irq: 0,
                    },
                  },
                  {
                    model: "ARMv7 Cortex-A53 @ 1.20GHz",
                    speed: 1200,
                    times: {
                      user: 27100,
                      nice: 0,
                      sys: 11800,
                      idle: 910000,
                      irq: 0,
                    },
                  },
                ],
                net: [
                  {
                    name: "eth0",
                    ips: [
                      {
                        address: "10.10.5.84",
                        netmask: "255.255.255.0",
                        family: "IPv4",
                        mac: "b8:27:eb:3a:9c:12",
                        internal: false,
                        cidr: "10.10.5.84/24",
                        scopeid: 0,
                      },
                    ],
                  },
                  {
                    name: "lo",
                    ips: [
                      {
                        address: "127.0.0.1",
                        netmask: "255.0.0.0",
                        family: "IPv4",
                        mac: "00:00:00:00:00:00",
                        internal: true,
                        cidr: "127.0.0.1/8",
                        scopeid: 0,
                      },
                    ],
                  },
                ],
                diskUsage: [
                  {
                    filesystem: "/dev/mmcblk0p2",
                    size: "30G",
                    used: "8G",
                    available: "22G",
                    usePercentage: "27%",
                    mountPoint: "/",
                  },
                ],
              },
            },
          }),
        ),
      );

      // Access Token
      await ServiceAccessToken.create(c, {
        name: "SCADA System Integration Token",
        permissions: {
          canListMeters: true,
          canListMetrics: true,
          canListSeus: true,
          metricResourceValueMetricIds: [metricId1, metricId7],
        },
      });

      // Module Internal Audit ----------------------------------------------------------
      const nonId = await ServiceNonconformity.create(c, {
        definition:
          "Compressor No.2 missed PM for 14 months; 0.14 kWh/Nm³ vs 0.11 target.",
        no: 1,
        identifiedAt: "2024-04-10",
        requirement:
          "ISO 50001:2018 Cl. 8.1 – Operational control of significant energy uses.",
        source: "Internal energy audit - Q1 2024",
        potentialResult:
          "Efficiency loss, higher costs, risk of unplanned production downtime.",
        rootCause:
          "PM schedule not migrated to CMMS after 2023 database migration.",
        action:
          "No.2 serviced; all compressed air assets added to CMMS auto-scheduling.",
        targetIdentificationDate: "2024-07-31",
        actualIdentificationDate: "2024-06-15",
        isCorrectiveActionOpen: false,
        reviewerFeedback:
          "Effective; consumption back to 0.112 kWh/Nm³ after service.",
        reviewerUserId: reviewUser,
        responsibleUserId: anotherUser,
      });
      const nonId2 = await ServiceNonconformity.create(c, {
        definition:
          "Assembly Hall sub-meter coverage below 80%; 3 LV boards unmetered.",
        no: 2,
        identifiedAt: "2024-09-03",
        requirement:
          "ISO 50001:2018 Cl. 6.4 – EnPI and energy baseline monitoring.",
        source: "Management review - Sep 2024 data gap analysis.",
        potentialResult:
          "Assembly Hall consumption unattributed; EnPI and target tracking affected.",
        rootCause: "Sub-metering CAPEX excluded from 2024 investment plan.",
        action:
          "2025 CAPEX submitted; manual readings until meters are installed.",
        targetIdentificationDate: "2025-06-30",
        actualIdentificationDate: "2024-10-15",
        isCorrectiveActionOpen: true,
        reviewerFeedback:
          "Accepted. Confirm meter installation in H1 2025 CAPEX closeout.",
        reviewerUserId: anotherUser,
        responsibleUserId: reviewUser,
      });

      await ServicePlan.create(c, {
        seuId: seuId,
        name: "Variable Speed Drive Replacement - Stamping Hall Press Lines",
        responsibleUserId: anotherUser,
        scheduleDate: "2024-09-30",
      });
      await ServicePlan.create(c, {
        seuId: seuId2,
        name: "Boiler Burner Tune-Up and Combustion Efficiency Optimization",
        responsibleUserId: reviewUser,
        scheduleDate: "2025-04-15",
      });

      await ServiceWorkflow.create(c, {
        part: "Operational Control",
        highLevelSubject: "Compressed Air System",
        subject:
          "Quarterly leak detection and repair procedure for compressed air distribution network.",
        reviewerUserId: reviewUser,
        questions:
          "Is pressure differential within ±0.2 bar of baseline? Are all leak points tagged in CMMS?",
        necessaries:
          "Ultrasonic leak detector, CMMS access, network pressure log sheet.",
        necessaryProof:
          "Leak detection survey completed with findings documented in CMMS.",
        obtainedProof:
          "CMMS work order #WO-2024-0412 closed with 7 leak points repaired.",
        correctiveActionDecisions:
          "Re-survey in 90 days. Persistent flange joint leaks to be addressed in next shutdown.",
        comments: "Network losses reduced from 18% to 9% after repair.",
        nonconformityIds: [nonId],
      });
      await ServiceWorkflow.create(c, {
        part: "Energy Performance Monitoring",
        highLevelSubject: "Sub-Metering Coverage",
        subject:
          "Half-yearly review of energy monitoring plan coverage and meter calibration status.",
        reviewerUserId: anotherUser,
        questions:
          "Are metering points within calibration tolerance? Is coverage above 85% of total consumption?",
        necessaries:
          "Meter calibration certificates, sub-meter inventory list, consumption data from BEMS.",
        necessaryProof:
          "Calibration certificates and sub-meter coverage report for the review period.",
        obtainedProof:
          "Current coverage at 78%. Three distribution boards in Assembly Hall not yet metered.",
        correctiveActionDecisions:
          "CAPEX raised for meter installation. Manual readings maintained until installation complete.",
        comments: "Target coverage of 90% to be achieved by Q2 2025.",
        nonconformityIds: [nonId2],
      });
      await ServiceWorkflow.create(c, {
        part: "Design and Procurement",
        highLevelSubject: "Equipment Procurement",
        subject:
          "Annual review of energy efficiency criteria in the equipment procurement procedure.",
        reviewerUserId: reviewUser,
        questions:
          "Are IE3/IE4 criteria applied to motors ≥15 kW? Are VSD requirements documented?",
        necessaries:
          "Procurement policy, approved vendor list, latest IE motor class regulations.",
        necessaryProof:
          "Signed checklist with energy criteria verified by the energy manager.",
        obtainedProof:
          "Checklist completed for 3 procurement cases in 2024; all met IE3 minimum.",
        correctiveActionDecisions:
          "Add VSD mandate for variable loads >30%; update criteria list by Q2 2025.",
        comments: "Next review scheduled for Q1 2026.",
        nonconformityIds: [],
      });

      // Module Planning ----------------------------------------------------------
      await ServiceActionPlan.create(c, {
        name: "Install VSD on Cooling Tower Fans",
        reasonsForStatus:
          "Cooling tower fans operate at fixed speed; load varies seasonally but fans run at 100% capacity year-round.",
        actualSavingsVerifications:
          "Post-installation M&V completed against IPMVP Option B protocol over 3-month period.",
        actualSavings:
          "Verified annual saving of 87,400 kWh, corresponding to EUR 9,860 at current tariff.",
        startDate: "2023-11-01",
        targetIdentificationDate: "2024-05-31",
        actualIdentificationDate: "2024-04-18",
        approvementStatus: "APPROVED",
        responsibleUserId: anotherUser,
      });
      await ServiceActionPlan.create(c, {
        name: "Replace T8 Fluorescent Fixtures with LED in Stamping Hall",
        reasonsForStatus:
          "Lighting system installed in 2008; average luminaire efficacy of 55 lm/W against LED equivalent of 135 lm/W.",
        actualSavingsVerifications:
          "Pre/post measurement of circuit energy consumption using calibrated power analyser over 30-day periods.",
        actualSavings:
          "Estimated annual saving of 124,000 kWh pending post-installation measurement.",
        startDate: "2025-02-01",
        targetIdentificationDate: "2025-09-30",
        actualIdentificationDate: "2025-09-30",
        approvementStatus: "PENDING",
        responsibleUserId: reviewUser,
      });

      const designId = await ServiceDesign.create(c, {
        name: "Heat Recovery from Compressor Cooling Air",
        no: 1,
        purpose:
          "Recover waste heat from compressor discharge air to pre-heat boiler make-up water, reducing gas consumption.",
        impact:
          "Reduction in boiler gas consumption estimated at 8-12% annually based on compressor heat output profiling.",
        estimatedSavings: 42000,
        estimatedAdditionalCost: 18500,
        estimatedTurnaroundMonths: 26,
        leaderUserId: anotherUser,
        potentialNonEnergyBenefits:
          "Reduced make-up water heating load, lower boiler cycling frequency, extended burner component lifespan.",
      });
      const designId2 = await ServiceDesign.create(c, {
        name: "Photovoltaic Rooftop Installation - Warehouse Building",
        no: 2,
        purpose:
          "Install a 480 kWp rooftop PV system on the warehouse building to offset grid electricity consumption.",
        impact:
          "Estimated annual generation of 620,000 kWh, offsetting approximately 22% of facility electricity consumption.",
        estimatedSavings: 68200,
        estimatedAdditionalCost: 295000,
        estimatedTurnaroundMonths: 54,
        leaderUserId: reviewUser,
        potentialNonEnergyBenefits:
          "Reduced grid dependency, improved Scope 2 GHG position, marketing benefit for OEM sustainability requirements.",
      });
      await ServiceDesignIdea.create(c, designId, {
        name: "Air-to-Water Heat Exchanger",
        no: "D1-I1",
        reduction: "Estimated 11% reduction in boiler gas consumption.",
        risks:
          "Low - standard HVAC technology, multiple qualified contractors available.",
      });
      await ServiceDesignIdea.create(c, designId2, {
        name: "South-Facing Fixed-Tilt PV Array",
        no: "D2-I1",
        reduction:
          "620,000 kWh annual generation at 1,290 kWh/kWp specific yield.",
        risks:
          "Medium - grid connection upgrade required, subject to DSO approval timeline.",
      });

      await ServiceEnergySavingOpportunity.create(c, {
        name: "Compressed Air Pressure Reduction from 8 bar to 7 bar",
        notes:
          "Survey indicated minimum required operating pressure is 6.8 bar. Reducing system pressure by 1 bar reduces compressor energy consumption by approximately 7%.",
        investmentApplicationPeriodMonth: 1,
        approvementStatus: "APPROVED",
        investmentBudget: 2500,
        estimatedBudgetSaving: 11400,
        paybackMonth: 3,
        calculationMethodOfPayback:
          "Direct energy reduction calculated from compressor power curves and annual operating hours.",
        estimatedSavings: [
          {
            energyResource: "ELECTRIC",
            value: 94000,
          },
        ],
        responsibleUserId: anotherUser,
        seuIds: [seuId],
      });
      await ServiceEnergySavingOpportunity.create(c, {
        name: "Boiler Blowdown Heat Recovery via Blowdown Vessel",
        notes:
          "Current continuous blowdown rate estimated at 3% of steam output. Installation of blowdown vessel and heat exchanger to recover enthalpy to make-up water.",
        investmentApplicationPeriodMonth: 4,
        approvementStatus: "PENDING",
        investmentBudget: 12000,
        estimatedBudgetSaving: 8700,
        paybackMonth: 17,
        calculationMethodOfPayback:
          "Calculated from blowdown enthalpy recovery and equivalent gas cost reduction at current tariff.",
        estimatedSavings: [
          {
            energyResource: "GAS",
            value: 78000,
          },
        ],
        responsibleUserId: reviewUser,
        seuIds: [seuId2],
      });

      await ServiceRiskForceFieldAnalysis.create(c, {
        parameter: "Management commitment to energy management system",
        score: 88,
        responsibleUserId: anotherUser,
        solutions:
          "Establish quarterly energy steering committee meetings with executive sponsorship; include energy KPIs in management bonus criteria.",
        completedAt: "2024-06-30",
        estimatedCompletionDate: "2024-06-30",
        isSucceed: true,
        isFollowUpRequired: false,
        isActionRequired: false,
      });
      await ServiceRiskForceFieldAnalysis.create(c, {
        parameter:
          "Capital investment availability for energy efficiency projects",
        score: 62,
        responsibleUserId: reviewUser,
        solutions:
          "Prepare business case with payback analysis for each identified opportunity; explore green financing options and energy performance contract models.",
        completedAt: "2025-09-30",
        estimatedCompletionDate: "2025-09-30",
        isSucceed: false,
        isFollowUpRequired: true,
        isActionRequired: true,
      });
      await ServiceRiskForceFieldAnalysis.create(c, {
        parameter: "Employee energy awareness and behavior change",
        score: 71,
        responsibleUserId: anotherUser,
        solutions:
          "Annual awareness campaign; energy topics added to new employee onboarding.",
        completedAt: "2025-06-30",
        estimatedCompletionDate: "2025-06-30",
        isSucceed: false,
        isFollowUpRequired: true,
        isActionRequired: true,
      });

      await ServiceRiskGapAnalysis.create(c, {
        question:
          "Does the organization have a documented procedure for identifying and accessing legal energy obligations?",
        headings: "Legal Compliance Identification",
        score: 4,
        evidence:
          "Legal register maintained by EHS department and reviewed quarterly; last reviewed 2025-02-10.",
        consideration:
          "Register covers relevant national regulations and ISO 50001 certification scope.",
        isActionRequired: false,
      });
      await ServiceRiskGapAnalysis.create(c, {
        question:
          "Are energy performance indicators reviewed at defined intervals and communicated to relevant functions?",
        headings: "EnPI Monitoring and Communication",
        score: 3,
        evidence:
          "Monthly EnPI dashboard distributed to department heads; reviewed at monthly production meeting.",
        consideration:
          "Communication to shift supervisors is inconsistent; floor-level energy awareness boards not yet implemented.",
        isActionRequired: true,
      });
      await ServiceRiskGapAnalysis.create(c, {
        question:
          "Is energy performance of new equipment evaluated before procurement approval?",
        headings: "Energy Procurement Criteria",
        score: 2,
        evidence:
          "Procurement checklist exists; energy criteria not formally embedded in policy.",
        consideration:
          "Efficiency criteria to be added to procurement policy revision due Q3 2025.",
        isActionRequired: true,
      });

      await ServiceRiskSwotAnalysis.create(c, {
        type: "Strength",
        description:
          "Certified ISO 50001:2018 EnMS with internal audit programme and trained energy management team.",
        solutions:
          "Leverage certification for OEM pre-qualification and green procurement tenders.",
        responsibleUserId: anotherUser,
        analysisCreatedAt: "2024-01-15",
        estimatedCompletionDate: "2025-12-31",
        completedAt: "2025-12-31",
        isActionRequired: false,
      });
      await ServiceRiskSwotAnalysis.create(c, {
        type: "Weakness",
        description:
          "Sub-metering coverage is below target; 22% of energy consumption cannot be attributed at department level.",
        solutions:
          "Prioritize CAPEX for sub-meter installation in Assembly Hall and Warehouse during 2025 investment cycle.",
        responsibleUserId: reviewUser,
        analysisCreatedAt: "2024-01-15",
        estimatedCompletionDate: "2025-06-30",
        completedAt: "2025-06-30",
        isActionRequired: true,
      });
      await ServiceRiskSwotAnalysis.create(c, {
        type: "Opportunity",
        description:
          "Green energy tariff available for ISO 50001 certified industrial consumers.",
        solutions:
          "Apply for preferential tariff; estimated 5% reduction in electricity cost.",
        responsibleUserId: anotherUser,
        analysisCreatedAt: "2024-01-15",
        estimatedCompletionDate: "2025-03-31",
        completedAt: "2025-03-31",
        isActionRequired: true,
      });
      await ServiceRiskSwotAnalysis.create(c, {
        type: "Threat",
        description:
          "EU carbon border mechanism may raise supply chain costs for high-carbon inputs.",
        solutions:
          "Prepare CBAM compliance plan; share verified carbon data with OEM customers.",
        responsibleUserId: reviewUser,
        analysisCreatedAt: "2024-01-15",
        estimatedCompletionDate: "2026-06-30",
        completedAt: "2026-06-30",
        isActionRequired: true,
      });

      await ServiceTarget.create(c, {
        year: 2024,
        energyResource: "ELECTRIC",
        consumption: 2650000,
        percentage: 8,
      });
      await ServiceTarget.create(c, {
        year: 2025,
        energyResource: "GAS",
        consumption: 1850000,
        percentage: 12,
      });

      // Module Product Base -------------------------------------------------
      await ServiceProduct.create(c, {
        code: "ASP-3001",
        description: "Automotive door outer panel - hot-stamped boron steel",
        unit: "PIECE",
      });
      await ServiceProduct.create(c, {
        code: "ASP-3002",
        description:
          "Rear floor cross-member assembly - cold-formed high-strength steel",
        unit: "PIECE",
      });

      // Module Report -----------------------------------------------------------
      const attachmentId = await ServiceReportAttachment.save(
        c,
        "Sample PDF",
        AssetPdf.samplePdf,
        "application/pdf",
      );

      const report = await ServiceReport.create(
        c,
        {
          title: {
            type: "PLAIN",
            value: "Monthly Energy Management Report - February 2026",
          },
          dateStart: metricDataStartDate,
          dateEnd: todayDate,
          authorIds: [c.session.userId],
          sections: [
            {
              title: { type: "TRANSLATED", value: "facilityLocation" },
              content: {
                type: "TEXT",
                value: {
                  type: "PLAIN",
                  value: "Organized Industrial Zone, Kocaeli, Turkey",
                },
              },
            },
          ],
        },
        [attachmentId],
        "Europe/Istanbul",
        undefined,
        { skipProducingMessage: true },
      );

      await MqConsumerReport(
        c,
        Buffer.from(
          JSON.stringify({
            id: report,
            pdfContent: AssetPdf.samplePdf.toString("base64"),
          }),
        ),
      );

      // Module Analysis ---------------------------------------------------------
      const enpi1 = await ServiceEnpi.create(c, {
        seuId: seuId,
        equipment:
          "Stamping Hall Press Lines (4 × 630-ton eccentric presses with VSD retrofit)",
        targetedDate: "2025-12-31",
        targetedImprovement: 8,
      });
      const enpi2 = await ServiceEnpi.create(c, {
        seuId: seuId2,
        equipment:
          "Industrial Boiler No.1 and No.2 (2 × 4 MW natural gas fired)",
        targetedDate: "2025-12-31",
        targetedImprovement: 10,
      });

      await ServiceAdvancedRegression.createSuggestions(
        c,
        {
          datetimeMin: metricDataStartDatetime,
          datetimeMax: todayDatetime,
          skipProducingMessage: true,
        },
        seuId,
      );

      await MqConsumerDriverSuggestions(
        c,
        Buffer.from(
          JSON.stringify({
            selected_feature_ids: [metricId1, metricId2],
            target_id: seuId,
          }),
        ),
      );

      // Module Support ----------------------------------------------------------
      await ServiceCalibrationPlan.create(c, {
        deviceType: "Electromagnetic Flow Meter",
        deviceNo: "FM-BOI-001",
        brand: "Endress+Hauser Promag 50",
        location: "Boiler Station Gas Manifold",
        calibration: "In-situ ultrasonic cross-check against master meter",
        calibrationNo: "CAL-2024-0031",
        responsibleUserId: anotherUser,
        dueTo: "2024-11-01",
        nextDate: "2025-11-01",
        evaluationResult:
          "Within ±0.3% tolerance. Certificate valid for 12 months.",
      });
      await ServiceCalibrationPlan.create(c, {
        deviceType: "High-Accuracy Bidirectional Energy Meter",
        deviceNo: "EM-MAIN-001",
        brand: "Siemens SENTRON PAC4200",
        location: "LV Main Distribution Board - Utility Room",
        calibration: "Laboratory calibration traceable to national standards",
        calibrationNo: "CAL-2024-0058",
        responsibleUserId: reviewUser,
        dueTo: "2025-01-15",
        nextDate: "2026-01-15",
        evaluationResult:
          "Class 0.5S accuracy confirmed. Calibration certificate issued by accredited laboratory.",
      });
      await ServiceCalibrationPlan.create(c, {
        deviceType: "Portable Power Analyser",
        deviceNo: "PA-PRESS-001",
        brand: "Fluke 435-II",
        location: "Press Line A - Main Panel",
        calibration: "Factory calibration to IEC 61000-4-30 Class A",
        calibrationNo: "CAL-2025-0012",
        responsibleUserId: anotherUser,
        dueTo: "2025-06-01",
        nextDate: "2026-06-01",
        evaluationResult:
          "All channels within ±0.1% accuracy. Class A standard confirmed.",
      });

      await ServiceCommunicationAwarenessPlan.create(c, {
        action: "Annual Energy Awareness Week",
        type: "INTERNAL",
        information:
          "Energy performance vs targets and top 3 saving initiatives.",
        releasedAt: "2024-10-14",
        releaseLocations: [
          "Production Notice Boards",
          "Canteen Digital Screen",
          "Intranet Energy Page",
        ],
        feedback: "Survey: 74% identified the main SEU and associated target.",
        targetUserIds: [anotherUser],
      });
      await ServiceCommunicationAwarenessPlan.create(c, {
        action: "Monthly KPI Dashboard Distribution",
        type: "INTERNAL",
        information:
          "Monthly KPI dashboard to department heads covering SEU EnPIs.",
        releasedAt: "2025-01-31",
        releaseLocations: [
          "Email Distribution",
          "Management Meeting Presentation",
          "Intranet Energy Page",
        ],
        feedback: "Adopted as agenda item in monthly production review.",
        targetUserIds: [reviewUser],
      });

      await ServiceCopMeasurementPlan.create(c, {
        energyVariables:
          "Press line active power demand, cycle count, die weight",
        optimalMeasurementTools:
          "Class 0.5 power analyser at each feeder with synchronized cycle counter pulse input",
        availableMeasurementTools:
          "Existing SENTRON PAC4200 meters on main feeder; cycle counters on press PLCs",
        monitoringAbsenceGap:
          "Die weight and job type manually recorded; not linked to energy data for normalization accuracy.",
        measurementPlan:
          "Install Modbus link from press PLCs to BEMS; develop normalized EnPI per ton of pressed steel.",
      });
      await ServiceCopMeasurementPlan.create(c, {
        energyVariables:
          "Gas flow rate, thermal output, return water temperature, boiler load factor",
        optimalMeasurementTools:
          "Ultrasonic gas meter, PT100 sensors; continuous stack gas analyser for O₂/CO₂ measurement.",
        availableMeasurementTools:
          "Gas meter (FM-BOI-001) and temperature sensors; no continuous stack analyser installed.",
        monitoringAbsenceGap:
          "Real-time boiler efficiency unavailable without flue gas analysis; monthly manual check only.",
        measurementPlan:
          "Install continuous flue gas analyser on both boilers; integrate daily efficiency report in BEMS.",
      });

      await ServiceCriticalOperationalParameter.create(c, {
        seuId: seuId,
        energyResource: "ELECTRIC",
        parameter: "VSD compressor",
        period: "MONTHLY",
        unit: "POWER_KW",
        normalSettingValue: 95,
        lowerLimit: 65,
        upperLimit: 115,
        accuracyCalibrationFrequency: 12,
        measurementTool:
          "VSD energy meter with Modbus output, connected to BEMS",
        valueResponsibleUserId: reviewUser,
        deviationResponsibleUserId: anotherUser,
        note: "Power above 115 kW triggers review.",
        controlDate: "2025-01-10",
      });
      await ServiceCriticalOperationalParameter.create(c, {
        seuId: seuId2,
        energyResource: "GAS",
        parameter: "Boiler No.1",
        period: "MONTHLY",
        unit: "RATE_PERCENTAGE",
        normalSettingValue: 15,
        lowerLimit: 10,
        upperLimit: 20,
        accuracyCalibrationFrequency: 6,
        measurementTool:
          "Portable flue gas analyser (Testo 340), O₂ and CO sensors.",
        valueResponsibleUserId: anotherUser,
        deviationResponsibleUserId: reviewUser,
        note: "Excess air above 20% schedule burner service.",
        controlDate: "2025-02-28",
      });

      await ServiceEnpiMeasurementPlan.create(c, {
        enpiId: enpi1,
        energyInput: 4,
        energyVariables: "Active power demand, cycle count, press tonnage",
        idealMeasurementTools:
          "Dedicated power analyser per press with PLC cycle count integration",
        availableMeasurementTools:
          "SENTRON PAC4200 on main feeder; cycle counters available but not integrated",
        monitoringAbsenceGap:
          "Job-type normalization not available; EnPI is total kWh/shift rather than kWh/ton.",
        measurementPlan:
          "Phase 1: 15-min feeder metering (done); Phase 2: PLC cycle count integration (Q3 2025).",
        requiredRange: 10,
        engineeringUnit: "kWh/ton",
        dataCollectionMethod:
          "BEMS Modbus polling; daily automated export to energy management platform.",
        dataCollectionPeriod:
          "15-minute intervals, aggregated to daily and monthly for reporting.",
      });
      await ServiceEnpiMeasurementPlan.create(c, {
        enpiId: enpi2,
        energyInput: 8,
        energyVariables:
          "Gas consumption, thermal output, return water temperature, boiler load factor",
        idealMeasurementTools:
          "Calibrated gas meter, flue gas analyser, supply/return PT100 sensors, thermal flow meter.",
        availableMeasurementTools:
          "Gas meter and PT100 temperature sensors installed; flue gas analyser not yet installed.",
        monitoringAbsenceGap:
          "Real-time boiler efficiency monitoring not possible without continuous flue gas analysis.",
        measurementPlan:
          "Install continuous analysers on both boilers by Q2 2025; automate daily efficiency reporting.",
        requiredRange: 15,
        engineeringUnit: "% efficiency (gross calorific value basis)",
        dataCollectionMethod:
          "Modbus integration from boiler plant controller to BEMS; hourly logged data with exception alerting.",
        dataCollectionPeriod:
          "Hourly intervals, with monthly averages used for management reporting.",
      });

      await ServiceMaintenanceActivity.create(c, {
        seuId: seuId,
        task: "Variable speed drive parameter check and filter cleaning",
        period: "MONTHLY",
        lastMaintainedAt: "2025-02-03",
        responsibleUserId: anotherUser,
        note: "Check VSD output current, frequency setpoint, and cooling fan condition.",
      });
      await ServiceMaintenanceActivity.create(c, {
        seuId: seuId2,
        task: "Boiler annual inspection and burner servicing",
        period: "YEARLY",
        lastMaintainedAt: "2024-08-20",
        responsibleUserId: reviewUser,
        note: "Full boiler inspection including heat exchanger tube cleaning, burner nozzle replacement, safety valve test, and combustion tuning.",
      });
      await ServiceMaintenanceActivity.create(c, {
        seuId: seuId3,
        task: "Compressed air dryer service and desiccant cartridge replacement",
        period: "YEARLY",
        lastMaintainedAt: "2024-10-15",
        responsibleUserId: anotherUser,
        note: "Check pressure dew point after replacement; target ≤−40°C pressure dew point.",
      });

      await ServiceProcurement.create(c, {
        product: "Rotary Screw Air Compressor, 110 kW, IE4 motor class",
        category: "Compressed Air Equipment",
        criteriaList:
          "IE4 motor efficiency class; specific power ≤5.5 kWh/Nm³/min at 7 bar; integrated heat recovery option; 5-year warranty on main components.",
        suggestedBrand: "Atlas Copco GA110VSD+",
        additionalSpecifications:
          "Variable speed drive integrated; remote monitoring via SMARTLINK; heat recovery efficiency ≥75%.",
        price: 38500,
        annualMaintenanceCost: 2200,
        lifetimeYears: 15,
      });
      await ServiceProcurement.create(c, {
        product: "Industrial LED High-Bay Luminaire, 200 W, IP65",
        category: "Lighting Equipment",
        criteriaList:
          "Minimum 140 lm/W luminous efficacy; CRI ≥80; IP65 for dusty production environment; L90 lifespan ≥50,000 hours.",
        suggestedBrand: "Philips CoreLine Highbay HL170X",
        additionalSpecifications:
          "DALI-2 dimming compatible for occupancy-linked control; includes mounting bracket for existing T8 fixture positions.",
        price: 185,
        annualMaintenanceCost: 8,
        lifetimeYears: 12,
      });

      await ServiceProcurementProcedure.create(c, {
        equipmentSpecifications:
          "All rotating machinery ≥15 kW must achieve IE3 efficiency class; VSD-compatible for variable loads.",
        serviceSpecifications:
          "Maintenance contracts must include 8-hour SLA for critical SEU and 24-hour for non-critical.",
        nextReviewAt: "2025-12-31",
        seuId: seuId,
      });
      await ServiceProcurementProcedure.create(c, {
        equipmentSpecifications:
          "Boiler burner parts must meet EN 746-2; gas valves certified to EN 161.",
        serviceSpecifications:
          "Boiler servicing by Gas Safe engineer with industrial thermal plant ≥500 kW experience.",
        nextReviewAt: "2026-06-30",
        seuId: seuId2,
      });

      // Module Training ---------------------------------------------------------
      await ServiceTraining.create(c, {
        title: "ISO 50001:2018 Internal Auditor Refresher Training",
        date: "2024-10-08",
        category: "COMPETENCE",
        trainerUserId: anotherUser,
      });
      await ServiceTraining.create(c, {
        title: "Energy Awareness for Production Operators - 2025",
        date: "2025-01-20",
        category: "AWARENESS",
        trainerUserId: reviewUser,
      });
      await ServiceTraining.create(c, {
        title: "Energy Awareness for Production Operators - 2026",
        date: "2025-01-20",
        category: "AWARENESS",
        trainerUserId: reviewUser,
      });

      // Module Supply Chain ----------------------------------------------------------
      const pipeline1 = await ServicePipeline.create(c, "Steel Procurement");
      await ServiceOperation.create(c, {
        name: "Supplier Quotation Request",
        pipelineId: pipeline1.id,
        index: 0,
      });
      await ServiceOperation.create(c, {
        name: "Technical Review & Approval",
        pipelineId: pipeline1.id,
        index: 1,
      });
      await ServiceOperation.create(c, {
        name: "Purchase Order Issue",
        pipelineId: pipeline1.id,
        index: 2,
      });
      await ServiceOperation.create(c, {
        name: "Delivery & Incoming Inspection",
        pipelineId: pipeline1.id,
        index: 3,
      });

      const pipeline2 = await ServicePipeline.create(
        c,
        "Equipment Maintenance Outsourcing",
      );
      await ServiceOperation.create(c, {
        name: "Maintenance Scope Definition",
        pipelineId: pipeline2.id,
        index: 0,
      });
      await ServiceOperation.create(c, {
        name: "Contractor Qualification Check",
        pipelineId: pipeline2.id,
        index: 1,
      });
      await ServiceOperation.create(c, {
        name: "Work Order Issue",
        pipelineId: pipeline2.id,
        index: 2,
      });
      await ServiceOperation.create(c, {
        name: "Completion & Handover",
        pipelineId: pipeline2.id,
        index: 3,
      });

      const pipeline3 = await ServicePipeline.create(
        c,
        "Energy Audit Services",
      );
      await ServiceOperation.create(c, {
        name: "Audit Scope Agreement",
        pipelineId: pipeline3.id,
        index: 0,
      });
      await ServiceOperation.create(c, {
        name: "Fieldwork & Data Collection",
        pipelineId: pipeline3.id,
        index: 1,
      });
      await ServiceOperation.create(c, {
        name: "Report Review & Sign-off",
        pipelineId: pipeline3.id,
        index: 2,
      });

      // Module DMS ----------------------------------------------------------
      await ServiceQdmsIntegration.create(c, {
        name: "Communication and Awareness Plans",
        bindingPage: "COMMUNICATION_AND_AWARENESS_PLANS",
        endpointUrl:
          "http://qdms.arismetal.internal/docs/enms/communication-plans.pdf",
      });
      await ServiceQdmsIntegration.create(c, {
        name: "Designs",
        bindingPage: "DESIGNS",
        endpointUrl:
          "http://qdms.arismetal.internal/docs/enms/design-register.pdf",
      });
      await ServiceQdmsIntegration.create(c, {
        name: "Energy Policies",
        bindingPage: "ENERGY_POLICIES",
        endpointUrl:
          "http://qdms.arismetal.internal/docs/enms/energy-policy.pdf",
      });
      await ServiceQdmsIntegration.create(c, {
        name: "Trainings",
        bindingPage: "TRAININGS",
        endpointUrl:
          "http://qdms.arismetal.internal/docs/enms/training-records.pdf",
      });

      // Module Dashboard -----------------------------------------------------
      await ServiceDashboardWidget.create(c, 0, 0, {
        type: "GRAPH_SEU_VALUE",
        seuIds: [seuId, seuId2, seuId3],
      });
      await ServiceDashboardWidget.create(c, 1, 0, {
        type: "GRAPH_DATA_VIEW_VALUE",
        dataViewId,
      });
      await ServiceDashboardWidget.create(c, 0, 1, {
        type: "GRAPH_METRIC",
        metricId: metricId1,
      });
      await ServiceDashboardWidget.create(c, 2, 0, {
        type: "ENERGY_POLICY",
      });
    });
  },
);

export const PatchDemoSeedStage2 = ServiceRuntimePatcher.create(
  "DEMO_SEED_STAGE_2",
  async (cCore) => {
    const [exampleUser] = await cCore.db
      .select({ orgId: TbUser.orgId, userId: TbUser.id })
      .from(TbUser)
      .where(eq(TbUser.email, EXAMPLE_USER_EMAIL));
    if (!exampleUser) {
      throw new Error("Example user is not found.");
    }

    // 30 days ago from now
    const datetimeMetricDataStart = UtilDate.objToUtcIsoDate(
      new Date(Date.now() - metricDataSeedRange),
    );
    const today = UtilDate.objToUtcIsoDate(new Date());

    const cUser: IContextUser = {
      ...cCore,
      orgId: exampleUser.orgId,
      session: {
        token: "DUMMY",
        ...exampleUser,
        permissions: ["/"],
        orgPlan: { features: [], maxUserCount: 4 },
      },
    };

    // We cannot use timescaledb related utils in tests,
    //   that's why there is a condition here
    if (cCore.env.ENV_NAME !== "development_test") {
      // Aggregate metric values
      await cCore.db.execute(
        "call refresh_continuous_aggregate('vw_metric_resource_values_gauge_minutely', null, null)",
      );
      await cCore.db.execute(
        "call refresh_continuous_aggregate('vw_metric_resource_values_gauge_hourly', null, null)",
      );
      await cCore.db.execute(
        "call refresh_continuous_aggregate('vw_metric_resource_values_gauge_daily', null, null)",
      );
      await cCore.db.execute(
        "call refresh_continuous_aggregate('vw_metric_resource_values_gauge_monthly', null, null)",
      );

      await cCore.db.execute(
        "call refresh_continuous_aggregate('vw_metric_resource_values_counter_cumulative_minutely', null, null)",
      );
      await cCore.db.execute(
        "call refresh_continuous_aggregate('vw_metric_resource_values_counter_cumulative_hourly', null, null)",
      );
      await cCore.db.execute(
        "call refresh_continuous_aggregate('vw_metric_resource_values_counter_cumulative_daily', null, null)",
      );
      await cCore.db.execute(
        "call refresh_continuous_aggregate('vw_metric_resource_values_counter_cumulative_monthly', null, null)",
      );
    }

    // After aggregation seeds
    await cCore.db.transaction(async (tx) => {
      const c = UtilContext.overwriteDb(cUser, tx);

      const [{ id: seuId }] = await c.db
        .select({ id: TbSeu.id })
        .from(TbSeu)
        .where(eq(TbSeu.name, "Stamping Hall - Variable Speed Drives"));
      const [{ id: seuId2 }] = await c.db
        .select({ id: TbSeu.id })
        .from(TbSeu)
        .where(eq(TbSeu.name, "Industrial Boiler System"));

      const [{ metricId: metricId1 }] = await c.db
        .select({ metricId: TbMetric.id })
        .from(TbMetric)
        .where(eq(TbMetric.name, "Stamping Hall - Main Feeder Energy"));
      const [{ metricId: metricId4 }] = await c.db
        .select({ metricId: TbMetric.id })
        .from(TbMetric)
        .where(eq(TbMetric.name, "Compressor Room - Energy Consumption"));

      // Module Analysis ---------------------------------------------------------
      const regresssionResult = await ServiceAdvancedRegression.calculate(c, {
        seuId,
        driverIds: [metricId4],
        dateTrainStart: datetimeMetricDataStart,
        dateTrainEnd: today,
        datePredictStart: datetimeMetricDataStart,
        datePredictEnd: today,
      });
      const regressionResultId = await ServiceAdvancedRegression.saveResults(
        c,
        {
          orgId: c.session.orgId,
          userId: c.session.userId,
          dateTrainStart: datetimeMetricDataStart,
          dateTrainEnd: today,
          datePredictStart: datetimeMetricDataStart,
          datePredictEnd: today,
          driverIds: [metricId4],
          seuId,
          result: regresssionResult,
        },
      );
      await ServiceAdvancedRegression.setPrimary(c, regressionResultId, true);

      // Second regression for driver list report without period
      const regresssionResult2 = await ServiceAdvancedRegression.calculate(c, {
        seuId: seuId2,
        driverIds: [metricId4],
        dateTrainStart: datetimeMetricDataStart,
        dateTrainEnd: today,
        datePredictStart: datetimeMetricDataStart,
        datePredictEnd: today,
      });
      const regressionResultId2 = await ServiceAdvancedRegression.saveResults(
        c,
        {
          orgId: c.session.orgId,
          userId: c.session.userId,
          dateTrainStart: datetimeMetricDataStart,
          dateTrainEnd: today,
          datePredictStart: datetimeMetricDataStart,
          datePredictEnd: today,
          driverIds: [metricId4],
          seuId: seuId2,
          result: regresssionResult2,
        },
      );

      const regresssionResult3 = await ServiceAdvancedRegression.calculate(c, {
        seuId,
        driverIds: [metricId1],
        dateTrainStart: datetimeMetricDataStart,
        dateTrainEnd: today,
        datePredictStart: datetimeMetricDataStart,
        datePredictEnd: today,
      });
      const regressionResultId3 = await ServiceAdvancedRegression.saveResults(
        c,
        {
          orgId: c.session.orgId,
          userId: c.session.userId,
          dateTrainStart: datetimeMetricDataStart,
          dateTrainEnd: today,
          datePredictStart: datetimeMetricDataStart,
          datePredictEnd: today,
          driverIds: [metricId1],
          seuId,
          result: regresssionResult3,
        },
      );

      await ServiceAdvancedRegression.setPrimary(c, regressionResultId2, true);
      await ServiceAdvancedRegression.setPrimary(c, regressionResultId3, true);

      // Module Dashboard -----------------------------------------------------
      await ServiceDashboardWidget.create(c, 0, 1, {
        regressionResultId,
        type: "GRAPH_ADVANCED_REGRESSION_RESULT",
      });
    });
  },
);
