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
import { ServiceUserToken } from "@m/base/services/ServiceUserToken";
import { ServiceComplianceObligation } from "@m/commitment/services/ServiceComplianceObligation";
import { ServiceComplianceObligationeomscle } from "@m/commitment/services/ServiceComplianceObligationeomscle";
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
import { ServiceDataViewProfile } from "@m/analysis/services/ServiceDataViewProfile";
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

export const PatchDevSeedStage1 = ServiceRuntimePatcher.create(
  "DEV_SEED_STAGE_1",
  async (cCore) => {
    // TODO index email?
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
        email: "example2@mail.com",
        name: "example2",
        surname: "example2",
        phone: "000-000-00-00",
        position: "example user",
        password: "secret",
      });

      const reviewUser = await ServiceUser.create(c, {
        email: "reviewer@mail.com",
        name: "reviewer",
        surname: "reviewer",
        phone: "000-000-00-00",
        position: "reviewer user",
        password: "secret",
      });

      // Module Base --------------------------------------------------------------
      const departmentId = await ServiceDepartment.create(c, {
        name: "A Departmant",
        description: "Description",
      });

      const mainDepartmentId = await ServiceDepartment.create(c, {
        name: "Infrastructure / Main Meters",
        description: "Main meters location",
      });

      const departmentId2 = await ServiceDepartment.create(c, {
        name: "Departman Lorem Ipsum is simply dummy text of the printing",
        description:
          "Description Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      });

      const departmentId3 = await ServiceDepartment.create(c, {
        name: "Human Resources",
        description: "Human Resources Description",
      });

      await ServiceDepartment.create(c, {
        name: "Storage",
        description: "Storage",
      });

      await ServiceCalendar.create(c, {
        name: "Calendar Alpha",
        description:
          "Calendar Alpha is responsible for scheduling and managing events.",
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
        content: "Example Commitment/EnergyPolicy -> Content",
        period: "QUARTERLY",
        type: "Example Commitment/EnergyPolicy -> Type",
        target: "Example Commitment/EnergyPolicy -> Target",
      });
      await ServiceEnergyPolicy.create(c, {
        content:
          "Long content Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        period: "YEARLY",
        type: "Long Type Example",
        target:
          "Very long target that includes Lorem Ipsum is simply dummy text of the printing",
      });
      const complianceAbligationId = await ServiceComplianceObligation.create(
        c,
        {
          complianceObligation: "Compliance",
          officialNewspaperNo: "1",
          officialNewspaperPublicationDate: "2000-12-31",
          reviewPeriod: "MONTHLY",
          reviewDate: "2020-12-31",
          revisionNo: "11",
          revisionDate: "2023-08-31",
          isLegalActive: true,
        },
      );
      const complianceAbligationId2 = await ServiceComplianceObligation.create(
        c,
        {
          complianceObligation:
            "Compliance Lorem Ipsum is simply dummy text of the printing",
          officialNewspaperNo: "123",
          officialNewspaperPublicationDate: "2010-10-10",
          reviewPeriod: "YEARLY",
          reviewDate: "2022-10-10",
          revisionNo: "22",
          revisionDate: "2024-01-01",
          isLegalActive: false,
        },
      );
      await ServiceComplianceObligationeomscle.create(
        c,
        complianceAbligationId,
        {
          relatedeomscleNo: "RA-001",
          description: "Description of RA-001",
          currentApplication: "Active",
          conformityAssessment: "Passed",
          conformityAssessmentPeriod: "YEARLY",
          lastConformityAssessment: "2024-01-01",
        },
      );
      await ServiceComplianceObligationeomscle.create(
        c,
        complianceAbligationId2,
        {
          relatedeomscleNo: "RA-999",
          description:
            "Long eomscle description Lorem Ipsum is simply dummy text of the printing",
          currentApplication: "Inactive",
          conformityAssessment: "Failed",
          conformityAssessmentPeriod: "MONTHLY",
          lastConformityAssessment: "2025-01-01",
        },
      );
      const internalExternalConsideration =
        await ServiceInternalExternalConsideration.create(c, {
          specific: "Example Specific",
          impactPoint: "Example Impact Point",
          evaluationMethod: "Example Evaluation Method",
          revisionDate: "2023-12-31",
          departmentIds: [departmentId],
        });

      await ServiceInternalExternalConsideration.update(
        c,
        internalExternalConsideration,
        {
          specific: "Example Updated Specific",
          impactPoint: "Example Updated Impact Point",
          evaluationMethod: "Example Updated Evaluation Method",
          revisionDate: "2023-12-31",
          departmentIds: [departmentId],
        },
      );

      const internalExternalConsideration2 =
        await ServiceInternalExternalConsideration.create(c, {
          specific: "Specific Lorem Ipsum is simply dummy text of the printing",
          impactPoint: "Impact Lorem Ipsum dolor sit amet",
          evaluationMethod:
            "Long Evaluation Method Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          revisionDate: "2024-06-15",
          departmentIds: [departmentId2],
        });

      await ServiceInternalExternalConsideration.update(
        c,
        internalExternalConsideration2,
        {
          specific:
            "Updated Specific Lorem Ipsum is simply dummy text of the printing",
          impactPoint: "Updated Impact Lorem Ipsum dolor sit amet",
          evaluationMethod:
            "Updated Long Evaluation Method Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          revisionDate: "2024-06-15",
          departmentIds: [departmentId2],
        },
      );

      await ServiceNeedAndExpectation.create(c, {
        interestedParty: "Example Interested Party",
        interestedPartyNeedsAndExpectations: "Example Needs and Expectations",
        isIncludedInEnms: true,
        evaluationMethod: "Example Evaluation Method",
        revisionDate: "2023-12-31",
        departmentIds: [departmentId],
      });
      await ServiceNeedAndExpectation.create(c, {
        interestedParty:
          "Long Interested Party Name Lorem Ipsum is simply dummy text",
        interestedPartyNeedsAndExpectations:
          "Very detailed needs and expectations Lorem Ipsum is simply dummy text of the printing industry",
        isIncludedInEnms: false,
        evaluationMethod:
          "Extensive Evaluation Method including Lorem Ipsum details",
        revisionDate: "2025-01-01",
        departmentIds: [departmentId2],
      });
      await ServiceScopeAndLimit.create(c, {
        physicalLimits: "PhysicalLimits",
        excludedResources: ["GAS"],
        excludedResourceReason: "Reason",
        products: ["Example Product"],
        departmentIds: [departmentId],
      });
      await ServiceScopeAndLimit.create(c, {
        physicalLimits:
          "Very large physical limit area Lorem Ipsum is simply dummy text of the printing",
        excludedResources: ["ELECTRIC"],
        excludedResourceReason:
          "Detailed reason for exclusion Lorem Ipsum is simply dummy text",
        products: [
          "Extensive product description with long text: Lorem Ipsum is simply dummy text",
        ],
        departmentIds: [departmentId2],
      });

      // Module Agent ---------------------------------------------------------
      const agentIdTemp = await ServiceAgent.create(cSys, {
        name: "Agent Alpha",
        serialNo: "A12345",
        description: "Agent Alpha is responsible for monitoring and reporting.",
        assignedOrgId: exampleUser.orgId,
      });
      // Use a fixed id for agent for external tests to be convenient
      const agentId = "77777777-7777-7777-8777-777777777777";
      await cSys.db
        .update(TbAgent)
        .set({ id: agentId })
        .where(eq(TbAgent.id, agentIdTemp));

      await ServiceAgent.create(cSys, {
        name: "Monitoring Agent - Central Facility Alpha",
        serialNo: "CENTRAL-FAC-ALPHA-AGT-2025-0001",
        description: `This agent is deployed at the Central Energy Facility of the organization.
It monitors electrical load fluctuations, records peak usage times,
and transmits data to the centralized analytics system for optimization purposes.`,
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

        // const splitCount = 60 * 24 * 30; // 30 days
        // const pageCount = Math.round(data.length / splitCount);
        // console.log("xxxxxxxxxxxxx", data.length, splitCount, pageCount);

        // for (let i = 0; i < pageCount; ++i) {
        return await ServiceMetric.addValues(
          c,
          c.session.orgId,
          metricId,
          unit,
          data,
          // data.slice(splitCount * i, splitCount * (i + 1)),
          options?.labels || [
            {
              type: "INTERNAL",
              key: "SOURCE",
              value: "DEV_SEED",
            },
          ],
        );
        // }
      }

      const metricId1 = await ServiceMetric.create(c, {
        name: "Metric 1",
        description: "Metric Description",
        type: "COUNTER",
        unitGroup: "ENERGY",
      });

      await seedMetricResourceValue(
        metricId1,
        "ENERGY_KWH",
        [
          { vMul: 10, hMul: 5 },
          { vMul: 10, hMul: 2 },
        ],
        {
          cumulative: true,
        },
      );

      const metricId2 = await ServiceMetric.create(c, {
        name: "Metric 2 - Temperature Metric in Boiler Room",
        description:
          "Metric Description Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        type: "GAUGE",
        unitGroup: "TEMPERATURE",
      });

      await seedMetricResourceValue(metricId2, "TEMPERATURE_CELSIUS", [
        { vMul: 20, hMul: 8 },
        { vMul: 10, hMul: 1 },
      ]);

      const metricId3 = await ServiceMetric.create(c, {
        name: "Metric 3 - Real-Time Diesel Engine Output Pressure Monitoring Metric",
        description:
          "Metric Description Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        type: "COUNTER",
        unitGroup: "VOLUME",
      });

      await seedMetricResourceValue(
        metricId3,
        "VOLUME_METRE_CUBE",
        [{ vMul: 30, hMul: 12 }],
        {
          cumulative: true,
        },
      );

      const metricId4 = await ServiceMetric.create(c, {
        name: "Different Metric for Meter Slice Only",
        description: "This metric is only for meter slices",
        type: "COUNTER",
        unitGroup: "ENERGY",
      });

      await seedMetricResourceValue(
        metricId4,
        "ENERGY_KWH",
        [{ vMul: 30, hMul: 9 }],
        {
          cumulative: true,
        },
      );

      const metricId5 = await ServiceMetric.create(c, {
        name: "Metric 5 - Minutely data",
        description:
          "Metric Description Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        type: "COUNTER",
        unitGroup: "ENERGY",
      });
      await seedMetricResourceValue(
        metricId5,
        "ENERGY_KWH",
        [
          { vMul: 20, hMul: 8 },
          { vMul: 10, hMul: 1 },
        ],
        {
          dateRange: 2 * 24 * 60 * 60 * 1000, // 2 days
          intervalSecs: 60, // Minutely
          cumulative: true,
        },
      );

      const metricId6 = await ServiceMetric.create(c, {
        name: "Metric 6 - Metric With Negative Value",
        description:
          "Metric Description Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        type: "GAUGE",
        unitGroup: "VOLUME",
      });

      await seedMetricResourceValue(
        metricId6,
        "VOLUME_METRE_CUBE",
        [
          { vMul: 20, hMul: 8 },
          { vMul: 10, hMul: 1 },
        ],
        {
          valueOffset: -30,
        },
      );

      const metricId7 = await ServiceMetric.create(c, {
        name: "Main Electric Metric",
        description: "Main electric meter metric",
        unitGroup: "ENERGY",
        type: "COUNTER",
      });

      await seedMetricResourceValue(
        metricId7,
        "ENERGY_KWH",
        [{ vMul: 30, hMul: 6 }],
        {
          valueOffset: 30,
          cumulative: true,
        },
      );

      const metricId8 = await ServiceMetric.create(c, {
        name: "Main Gas Metric",
        description: "Main gas meter metric",
        unitGroup: "ENERGY",
        type: "COUNTER",
      });

      await seedMetricResourceValue(
        metricId8,
        "ENERGY_KWH",
        [{ vMul: 60, hMul: 5 }],
        {
          valueOffset: 60,
          cumulative: true,
        },
      );

      const metricId9 = await ServiceMetric.create(c, {
        name: "Main Water Metric",
        description: "Main water meter metric",
        unitGroup: "VOLUME",
        type: "COUNTER",
      });

      await seedMetricResourceValue(
        metricId9,
        "VOLUME_METRE_CUBE",
        [{ vMul: 10, hMul: 6 }],
        {
          valueOffset: 10,
          cumulative: true,
        },
      );

      const metricIdAgentIntegration = await ServiceMetric.create(c, {
        name: "Empty Metric With Agent Integration",
        description: null,
        type: "COUNTER",
        unitGroup: "ENERGY",
      });

      const metricId10 = await ServiceMetric.create(c, {
        name: "Overlapped multi resource metric",
        description: null,
        unitGroup: "TEMPERATURE",
        type: "GAUGE",
      });

      await seedMetricResourceValue(metricId10, "TEMPERATURE_CELSIUS", [
        { vMul: 15, hMul: 4 },
      ]);
      await seedMetricResourceValue(
        metricId10,
        "TEMPERATURE_CELSIUS",
        [{ vMul: 20, hMul: 2 }],
        {
          labels: [
            { type: "USER_DEFINED", key: "Source", value: "Second Resource" },
          ],
        },
      );

      const metricId11 = await ServiceMetric.create(c, {
        name: "Continuous multi resource metric",
        description: null,
        unitGroup: "ENERGY",
        type: "COUNTER",
      });

      await seedMetricResourceValue(
        metricId11,
        "ENERGY_KWH",
        [{ vMul: 15, hMul: 4 }],
        {
          dateRange: 2 * 24 * 60 * 60 * 1000, // 2 days
          intervalSecs: 60 * 15, // 15 min
          dateOffset: 2 * 24 * 60 * 60 * 1000, // 2 days
          cumulative: true,
        },
      );
      await seedMetricResourceValue(
        metricId11,
        "ENERGY_KWH",
        [{ vMul: 15, hMul: 4 }],
        {
          labels: [
            { type: "USER_DEFINED", key: "Source", value: "Second Resource" },
          ],
          dateRange: 2 * 24 * 60 * 60 * 1000, // 2 days
          intervalSecs: 60 * 15, // 15 min
          cumulative: true,
        },
      );

      // Metric > Meter
      const meter = await ServiceMeter.create(c, {
        name: "Meter 1",
        energyResource: "ELECTRIC",
        metricId: metricId1,
        departmentId,
        energyConversionRate: 1,
        isMain: false,
      });
      const meterId = meter.id;

      const meter2 = await ServiceMeter.create(c, {
        name: "Meter 2",
        energyResource: "GAS",
        metricId: metricId3,
        departmentId,
        energyConversionRate: 1,
        isMain: false,
      });
      const meterId2 = meter2.id;

      const meter3 = await ServiceMeter.create(c, {
        name: "Meter 3",
        energyResource: "ELECTRIC",
        metricId: metricId4,
        departmentId: departmentId2,
        energyConversionRate: 1,
        isMain: false,
      });

      const electricMainMeter = await ServiceMeter.create(c, {
        name: "Electric Main Meter",
        energyResource: "ELECTRIC",
        metricId: metricId7,
        departmentId: mainDepartmentId,
        energyConversionRate: 1,
        isMain: true,
      });

      const gasMainMeter = await ServiceMeter.create(c, {
        name: "Gas Main Meter",
        energyResource: "GAS",
        metricId: metricId8,
        departmentId: mainDepartmentId,
        energyConversionRate: 1,
        isMain: true,
      });

      const waterMainMeter = await ServiceMeter.create(c, {
        name: "Water Main Meter",
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
          { rate: 0.6, departmentId: mainDepartmentId, isMain: true },
          { rate: 0.2, departmentId: departmentId, isMain: false },
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
      } = await ServiceMeterSlice.save(c, meter3.id, [
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
        name: "Seu",
        departmentIds: [departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      });

      const seuId2 = await ServiceSeu.create(c, {
        name: "Seu Lorem Ipsum is simply dummy text",
        departmentIds: [departmentId2],
        energyResource: "GAS",
        meterSliceIds: [],
      });

      const seuId3 = await ServiceSeu.create(c, {
        name: "Seu With Manually Selected Slice",
        departmentIds: [],
        energyResource: "ELECTRIC",
        meterSliceIds: [meterSliceId3],
      });

      await ServiceSeu.create(c, {
        name: "Seu 4 for reporting",
        departmentIds: [],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter3SliceId1],
      });

      // Metric > Integration
      await ServiceOutboundIntegration.create(
        c,
        "Outbound Integration",
        {
          period: "HOURLY",
          type: "MOCK_SOURCE",
          param: { waves: [{ vMul: 15, hMul: 10 }] },
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
        "Outbound Integration 2",
        {
          period: "MINUTELY",
          type: "MOCK_SOURCE",
          param: { waves: [{ vMul: 10, hMul: 5 }] },
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
        "Metric 5 Daily Integration",
        {
          period: "DAILY",
          type: "MOCK_SOURCE",
          param: { waves: [{ vMul: 8, hMul: 10 }] },
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
        "Inbound Integration",
        { type: "WEBHOOK" },
        [
          {
            outputKey: "default",
            metricId: metricId3,
            unit: "ENERGY_KWH",
          },
        ],
      );

      await ServiceInboundIntegration.create(
        c,
        "Agent Integration",
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
        description: "Example Description",
        name: "Metrics",
        options: {
          type: "METRIC",
          metricIds: [metricId1, metricId2, metricId3],
        },
      });

      await ServiceDataViewProfile.create(c, {
        description:
          "Long Example Description Lorem Ipsum is simply dummy text",
        name: "Meters",
        options: {
          type: "METER_SLICE",
          meterSliceIds: [meterSliceId1, meterSliceId2],
        },
      });

      await ServiceDataViewProfile.create(c, {
        description: "Seu View",
        name: "Seus",
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
                arch: "x64",
                platform: "linux",
                host: "dev-seed-host",
                memoryTotal: 16000000000,
                memoryFree: 8000000000,
                cpu: [
                  {
                    model: "Intel(R) Xeon(R) CPU @ 2.30GHz",
                    speed: 2300,
                    times: {
                      user: 12400,
                      nice: 0,
                      sys: 8500,
                      idle: 450000,
                      irq: 0,
                    },
                  },
                  {
                    model: "Intel(R) Xeon(R) CPU @ 2.30GHz",
                    speed: 2300,
                    times: {
                      user: 11000,
                      nice: 0,
                      sys: 9200,
                      idle: 440000,
                      irq: 0,
                    },
                  },
                ],
                net: [
                  {
                    name: "eth0",
                    ips: [
                      {
                        address: "192.168.1.42",
                        netmask: "255.255.255.0",
                        family: "IPv4",
                        mac: "00:0a:95:9d:68:16",
                        internal: false,
                        cidr: "192.168.1.42/24",
                        scopeid: 0,
                      },
                      {
                        address: "fe80::20a:95ff:fe9d:6816",
                        netmask: "ffff:ffff:ffff:ffff::",
                        family: "IPv6",
                        mac: "00:0a:95:9d:68:16",
                        internal: false,
                        cidr: "fe80::20a:95ff:fe9d:6816/64",
                        scopeid: 2,
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
                    filesystem: "/dev/sda1",
                    size: "100G",
                    used: "45G",
                    available: "55G",
                    usePercentage: "45%",
                    mountPoint: "/",
                  },
                  {
                    filesystem: "/dev/sdb1",
                    size: "500G",
                    used: "10G",
                    available: "490G",
                    usePercentage: "2%",
                    mountPoint: "/mnt/data",
                  },
                ],
              },
            },
          }),
        ),
      );

      // Access Token
      await ServiceAccessToken.create(c, {
        name: "Example Access Token",
        permissions: {
          canListMeters: true,
          canListMetrics: true,
          canListSeus: true,
          metricResourceValueMetricIds: [metricId1, metricId2],
        },
      });

      // User Token
      await ServiceUserToken.create(c, {
        name: "Example User Token",
      });

      // Module Internal Audit ----------------------------------------------------------
      const nonId = await ServiceNonconformity.create(c, {
        definition: "Example Definition",
        no: 1,
        identifiedAt: "2023-01-01",
        requirement: "Example Requirement",
        source: "Example Source",
        potentialResult: "Example Potential Result",
        rootCause: "Example Root Cause",
        action: "Example Action",
        targetIdentificationDate: "2023-12-31",
        actualIdentificationDate: "2023-06-30",
        isCorrectiveActionOpen: true,
        reviewerFeedback: "Example Reviewer Feedback",
        reviewerUserId: reviewUser,
        responsibleUserId: anotherUser,
      });
      const nonId2 = await ServiceNonconformity.create(c, {
        definition:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry, used here as a lengthy example.",
        no: 2,
        identifiedAt: "2024-02-15",
        requirement:
          "Extended Requirement details with extra text Lorem Ipsum for testing.",
        source:
          "Extended Source with additional information for testing purposes.",
        potentialResult:
          "Potential results elaborated with Lorem Ipsum filler text for a second record.",
        rootCause:
          "Root cause analysis explanation expanded with Lorem Ipsum text to simulate real content.",
        action:
          "Corrective actions outlined with detailed Lorem Ipsum descriptive text to differ from first record.",
        targetIdentificationDate: "2024-12-31",
        actualIdentificationDate: "2024-08-31",
        isCorrectiveActionOpen: false,
        reviewerFeedback:
          "Reviewer feedback extended with Lorem Ipsum for comprehensive data.",
        reviewerUserId: anotherUser,
        responsibleUserId: reviewUser,
      });
      await ServicePlan.create(c, {
        seuId: seuId,
        name: "Plan",
        responsibleUserId: anotherUser,
        scheduleDate: "2023-06-30",
      });
      await ServicePlan.create(c, {
        seuId: seuId2,
        name: "Extended Plan Lorem Ipsum with a lot of additional detail for testing second record",
        responsibleUserId: reviewUser,
        scheduleDate: "2024-07-15",
      });
      await ServiceWorkflow.create(c, {
        part: "Example Part",
        highLevelSubject: "Example High Level Subject",
        subject: "Example Subject",
        reviewerUserId: reviewUser,
        questions: "Example Questions",
        necessaries: "Example Necessaries",
        necessaryProof: "Example Necessary Proof",
        obtainedProof: "Example Obtained Proof",
        correctiveActionDecisions: "Example Corrective Action Decisions",
        comments: "Example Comments",
        nonconformityIds: [nonId],
      });
      await ServiceWorkflow.create(c, {
        part: "Extended Part Lorem Ipsum to increase length and difference from first record",
        highLevelSubject:
          "Extended High Level Subject with Lorem Ipsum filler text",
        subject: "Extended Subject with detailed Lorem Ipsum description",
        reviewerUserId: anotherUser,
        questions: "Extended Questions filled with Lorem Ipsum content",
        necessaries: "Extended Necessaries described with Lorem Ipsum",
        necessaryProof: "Extended Necessary Proof content",
        obtainedProof: "Extended Obtained Proof Lorem Ipsum example",
        correctiveActionDecisions:
          "Extended Corrective Action Decisions Lorem Ipsum",
        comments: "Extended Comments to differentiate second record",
        nonconformityIds: [nonId2],
      });

      // Module Planning ----------------------------------------------------------
      await ServiceActionPlan.create(c, {
        name: "Action Plan",
        reasonsForStatus: "Reason",
        actualSavingsVerifications: "Actual Verification",
        actualSavings: "Saving",
        startDate: "2021-06-30",
        targetIdentificationDate: "2023-07-30",
        actualIdentificationDate: "2023-09-30",
        approvementStatus: "APPROVED",
        responsibleUserId: anotherUser,
      });
      await ServiceActionPlan.create(c, {
        name: "Extended Action Plan Lorem Ipsum with very detailed explanation",
        reasonsForStatus:
          "Extended reason with Lorem Ipsum dummy text for second record",
        actualSavingsVerifications:
          "Extended actual savings verification with dummy text",
        actualSavings: "Extended saving details with Lorem Ipsum",
        startDate: "2022-01-15",
        targetIdentificationDate: "2024-08-01",
        actualIdentificationDate: "2024-09-15",
        approvementStatus: "PENDING",
        responsibleUserId: reviewUser,
      });
      const designId = await ServiceDesign.create(c, {
        name: "Example Design",
        no: 1,
        purpose: "Example Purpose",
        impact: "Example Impact",
        estimatedSavings: 10000,
        estimatedAdditionalCost: 5000,
        estimatedTurnaroundMonths: 6,
        leaderUserId: anotherUser,
        potentialNonEnergyBenefits: "Example Non-Energy Benefits",
      });
      const designId2 = await ServiceDesign.create(c, {
        name: "Extended Design Lorem Ipsum with lots of detail and explanation",
        no: 2,
        purpose: "Extended Purpose with Lorem Ipsum filler text to differ",
        impact: "Extended Impact description with more text",
        estimatedSavings: 20000,
        estimatedAdditionalCost: 8000,
        estimatedTurnaroundMonths: 12,
        leaderUserId: reviewUser,
        potentialNonEnergyBenefits:
          "Extended Non-Energy Benefits described with dummy text",
      });
      await ServiceDesignIdea.create(c, designId, {
        name: "Example Design Idea",
        no: "Example no",
        reduction: "Example Reduction",
        risks: "Low",
      });
      await ServiceDesignIdea.create(c, designId2, {
        name: "Example Design Idea 2",
        no: "Example no",
        reduction: "Example Reduction",
        risks: "Low",
      });
      await ServiceEnergySavingOpportunity.create(c, {
        name: "Energy Opportunity",
        notes: "Notes",
        investmentApplicationPeriodMonth: 3,
        approvementStatus: "PENDING",
        investmentBudget: 1000,
        estimatedBudgetSaving: 500,
        paybackMonth: 6,
        calculationMethodOfPayback: "Example Calculation Method",
        estimatedSavings: [
          {
            energyResource: "DIESEL",
            value: 5000,
          },
        ],
        responsibleUserId: anotherUser,
        seuIds: [seuId],
      });
      await ServiceEnergySavingOpportunity.create(c, {
        name: "Extended Energy Opportunity Lorem Ipsum with extra info",
        notes: "Extended notes with Lorem Ipsum filler text for second record",
        investmentApplicationPeriodMonth: 6,
        approvementStatus: "APPROVED",
        investmentBudget: 2000,
        estimatedBudgetSaving: 1200,
        paybackMonth: 8,
        calculationMethodOfPayback:
          "Extended calculation method with Lorem Ipsum",
        estimatedSavings: [
          {
            energyResource: "GAS",
            value: 8000,
          },
        ],
        responsibleUserId: reviewUser,
        seuIds: [seuId],
      });
      await ServiceRiskForceFieldAnalysis.create(c, {
        parameter: "Example Parameter",
        score: 85,
        responsibleUserId: anotherUser,
        solutions: "Example Solutions",
        completedAt: "2023-12-31",
        estimatedCompletionDate: "2023-10-31",
        isSucceed: true,
        isFollowUpRequired: false,
        isActionRequired: true,
      });
      await ServiceRiskForceFieldAnalysis.create(c, {
        parameter:
          "Example Parameter Lorem Ipsum is simply dummy text of the printing",
        score: 90,
        responsibleUserId: reviewUser,
        solutions: "Extended Solutions with Lorem Ipsum filler text",
        completedAt: "2024-12-31",
        estimatedCompletionDate: "2024-11-30",
        isSucceed: false,
        isFollowUpRequired: true,
        isActionRequired: false,
      });
      await ServiceRiskGapAnalysis.create(c, {
        question: "Question",
        headings: "Headings",
        score: 2,
        evidence: "Evidence",
        consideration: "Consideration",
        isActionRequired: true,
      });
      await ServiceRiskGapAnalysis.create(c, {
        question: "Question Lorem Ipsum is simply dummy text of the printing",
        headings: "Extended Headings Lorem Ipsum filler text",
        score: 3,
        evidence: "Extended Evidence Lorem Ipsum",
        consideration: "Extended Consideration Lorem Ipsum text",
        isActionRequired: false,
      });
      await ServiceRiskSwotAnalysis.create(c, {
        type: "Type1",
        description: "Description",
        solutions: "Solutions",
        responsibleUserId: anotherUser,
        analysisCreatedAt: "2020-12-31",
        estimatedCompletionDate: "2023-03-31",
        completedAt: "2023-12-12",
        isActionRequired: true,
      });
      await ServiceRiskSwotAnalysis.create(c, {
        type: "Type2 Lorem Ipsum",
        description: "Extended Description Lorem Ipsum text for second record",
        solutions: "Extended Solutions Lorem Ipsum",
        responsibleUserId: reviewUser,
        analysisCreatedAt: "2021-01-15",
        estimatedCompletionDate: "2024-04-30",
        completedAt: "2024-05-01",
        isActionRequired: false,
      });
      await ServiceTarget.create(c, {
        year: 2020,
        energyResource: "DIESEL",
        consumption: 2,
        percentage: 12,
      });
      await ServiceTarget.create(c, {
        year: 2024,
        energyResource: "GAS",
        consumption: 10,
        percentage: 25,
      });

      // Module Product Base -------------------------------------------------
      await ServiceProduct.create(c, {
        code: "Test Code",
        description: "Description",
        unit: "ENERGY",
      });
      await ServiceProduct.create(c, {
        code: "Test Code Lorem Ipsum with extra details for second record",
        description: "Extended Description Lorem Ipsum text for second record",
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
          title: { type: "PLAIN", value: "Example Report" },
          dateStart: metricDataStartDate,
          dateEnd: todayDate,
          authorIds: [c.session.userId],
          sections: [
            {
              title: { type: "TRANSLATED", value: "facilityLocation" },
              content: {
                type: "TEXT",
                value: { type: "PLAIN", value: "Turkey" },
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
        equipment: "Equipment",
        targetedDate: "2020-01-04",
        targetedImprovement: 1,
      });
      const enpi2 = await ServiceEnpi.create(c, {
        seuId: seuId2,
        equipment:
          "Centralized Heating System with control modules Lorem Ipsum is simply dummy text of the printing",
        targetedDate: "2023-12-31",
        targetedImprovement: 15,
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
        deviceType: "Type1",
        deviceNo: "33",
        brand: "Brand",
        location: "Istanbul",
        calibration: "Calibraition",
        calibrationNo: "222",
        responsibleUserId: anotherUser,
        dueTo: "2023-04-05",
        nextDate: "2023-04-12",
        evaluationResult: "Result",
      });
      await ServiceCalibrationPlan.create(c, {
        deviceType: "Type2 Extended Version",
        deviceNo: "445566",
        brand:
          "Brand Extra Long Description with Lorem Ipsum is simply dummy text of the printing",
        location:
          "Ankara Headquarters with extended area Lorem Ipsum is simply dummy text of the printing",
        calibration:
          "Detailed Calibration Procedure with steps and guidelines Lorem Ipsum is simply dummy text of the printing",
        calibrationNo: "CAL-99887766",
        responsibleUserId: reviewUser,
        dueTo: "2024-11-15",
        nextDate: "2024-12-01",
        evaluationResult:
          "Evaluation Result showing extensive analysis and remarks Lorem Ipsum is simply dummy text of the printing",
      });
      await ServiceCommunicationAwarenessPlan.create(c, {
        action: "Action",
        type: "EXTERNAL",
        information: "Information",
        releasedAt: "2020-12-31",
        releaseLocations: ["a", "b"],
        feedback: "Feedback",
        targetUserIds: [anotherUser],
      });
      await ServiceCommunicationAwarenessPlan.create(c, {
        action:
          "Comprehensive Awareness Campaign with multiple phases and outreach Lorem Ipsum is simply dummy text of the printing",
        type: "INTERNAL",
        information:
          "Detailed internal communication plan and information sharing policy Lorem Ipsum is simply dummy text of the printing",
        releasedAt: "2021-06-15",
        releaseLocations: [
          "Head Office",
          "Remote Offices",
          "Manufacturing Plants",
        ],
        feedback:
          "In-depth feedback analysis collected over multiple cycles Lorem Ipsum is simply dummy text of the printing",
        targetUserIds: [reviewUser],
      });
      await ServiceCopMeasurementPlan.create(c, {
        energyVariables: "Variables",
        optimalMeasurementTools: "Tools",
        availableMeasurementTools: "Avaible Tools",
        monitoringAbsenceGap: "Gap",
        measurementPlan: "Measurement Plan",
      });
      await ServiceCopMeasurementPlan.create(c, {
        energyVariables:
          "Extensive list of energy variables measured quarterly Lorem Ipsum is simply dummy text of the printing",
        optimalMeasurementTools:
          "Highly optimized tools selected after rigorous testing Lorem Ipsum is simply dummy text of the printing",
        availableMeasurementTools:
          "Wide array of available tools with calibration certificates Lorem Ipsum is simply dummy text of the printing",
        monitoringAbsenceGap:
          "Monitoring gaps identified and mitigation strategies outlined Lorem Ipsum is simply dummy text of the printing",
        measurementPlan:
          "Comprehensive measurement plan incorporating predictive analytics and trend analysis Lorem Ipsum is simply dummy text of the printing",
      });
      await ServiceCriticalOperationalParameter.create(c, {
        seuId: seuId,
        energyResource: "DIESEL",
        parameter: "Paramater",
        period: "MONTHLY",
        unit: "VOLTAGE",
        normalSettingValue: 2,
        lowerLimit: 3,
        upperLimit: 5,
        accuracyCalibrationFrequency: 4,
        measurementTool: "Tool",
        valueResponsibleUserId: reviewUser,
        deviationResponsibleUserId: anotherUser,
        note: "Note",
        controlDate: "2020-01-01",
      });
      await ServiceCriticalOperationalParameter.create(c, {
        seuId: seuId2,
        energyResource: "ELECTRIC",
        parameter:
          "Extended Operational Parameter for energy efficiency measurement Lorem Ipsum is simply dummy text of the printing",
        period: "WEEKLY",
        unit: "POWER_KW",
        normalSettingValue: 15,
        lowerLimit: 10,
        upperLimit: 20,
        accuracyCalibrationFrequency: 2,
        measurementTool:
          "Advanced digital metric with IoT connectivity Lorem Ipsum is simply dummy text of the printing",
        valueResponsibleUserId: anotherUser,
        deviationResponsibleUserId: reviewUser,
        note: "This note provides detailed remarks on parameter deviations and expected outcomes Lorem Ipsum is simply dummy text of the printing",
        controlDate: "2021-08-15",
      });
      await ServiceEnpiMeasurementPlan.create(c, {
        enpiId: enpi1,
        energyInput: 3,
        energyVariables: "Variable",
        idealMeasurementTools: "Ideal Tools",
        availableMeasurementTools: "Avaible Tools",
        monitoringAbsenceGap: "Gap",
        measurementPlan: "Plan",
        requiredRange: 5,
        engineeringUnit: "Engineer",
        dataCollectionMethod: "Collection Method",
        dataCollectionPeriod: "Data Period",
      });
      await ServiceEnpiMeasurementPlan.create(c, {
        enpiId: enpi2,
        energyInput: 10,
        energyVariables:
          "Extended Variables set including temperature, pressure, and flow rates Lorem Ipsum is simply dummy text of the printing",
        idealMeasurementTools:
          "Ideal tools with advanced precision and multi-factor calibration Lorem Ipsum is simply dummy text of the printing",
        availableMeasurementTools:
          "Available tools with documented calibration history and accuracy rates Lorem Ipsum is simply dummy text of the printing",
        monitoringAbsenceGap:
          "Identified gaps in continuous monitoring and corrective actions planned Lorem Ipsum is simply dummy text of the printing",
        measurementPlan:
          "Detailed measurement plan covering all critical operational points and data intervals Lorem Ipsum is simply dummy text of the printing",
        requiredRange: 15,
        engineeringUnit: "kWh/m2",
        dataCollectionMethod:
          "Automated data collection through SCADA and manual verifications Lorem Ipsum is simply dummy text of the printing",
        dataCollectionPeriod:
          "Monthly with quarterly audits Lorem Ipsum is simply dummy text of the printing",
      });
      await ServiceMaintenanceActivity.create(c, {
        seuId: seuId,
        task: "Task",
        period: "MONTHLY",
        lastMaintainedAt: "2020-02-03",
        responsibleUserId: anotherUser,
        note: "Note",
      });
      await ServiceMaintenanceActivity.create(c, {
        seuId: seuId,
        task: "Comprehensive maintenance task for HVAC and electrical systems Lorem Ipsum is simply dummy text of the printing",
        period: "QUARTERLY",
        lastMaintainedAt: "2023-03-15",
        responsibleUserId: reviewUser,
        note: "Detailed note on maintenance outcomes, parts replaced, and recommendations Lorem Ipsum is simply dummy text of the printing",
      });
      await ServiceProcurement.create(c, {
        product: "Product",
        category: "Category",
        criteriaList: "List",
        suggestedBrand: "Brand",
        additionalSpecifications: "Specification",
        price: 4,
        annualMaintenanceCost: 6,
        lifetimeYears: 22,
      });
      await ServiceProcurement.create(c, {
        product:
          "High efficiency LED lighting system with smart controls Lorem Ipsum is simply dummy text of the printing",
        category: "Electrical Equipment",
        criteriaList:
          "Energy efficiency class A++, lifespan over 50000 hours, warranty 5 years Lorem Ipsum is simply dummy text of the printing",
        suggestedBrand: "PremiumBrand Advanced Lighting",
        additionalSpecifications:
          "Includes installation kit, compatibility with existing systems, and IoT integration Lorem Ipsum is simply dummy text of the printing",
        price: 1200,
        annualMaintenanceCost: 50,
        lifetimeYears: 15,
      });
      await ServiceProcurementProcedure.create(c, {
        equipmentSpecifications: "Specification",
        serviceSpecifications: "Service Specification",
        nextReviewAt: "2021-04-03",
        seuId: seuId,
      });
      await ServiceProcurementProcedure.create(c, {
        equipmentSpecifications:
          "Detailed equipment specifications including dimensions, power ratings, and environmental standards Lorem Ipsum is simply dummy text of the printing",
        serviceSpecifications:
          "Comprehensive service specifications with maintenance schedules and SLAs Lorem Ipsum is simply dummy text of the printing",
        nextReviewAt: "2025-08-20",
        seuId: seuId,
      });

      // Module Training ---------------------------------------------------------
      await ServiceTraining.create(c, {
        title: "Tittle",
        date: "2020-01-04",
        category: "AWARENESS",
        trainerUserId: anotherUser,
      });
      await ServiceTraining.create(c, {
        title: "Tittle Lorem Ipsum is simply dummy text of the printing",
        date: "2022-10-15",
        category: "COMPETENCE",
        trainerUserId: reviewUser,
      });

      // Module DMS ----------------------------------------------------------
      await ServiceQdmsIntegration.create(c, {
        name: "Communication and Awareness Plans",
        bindingPage: "COMMUNICATION_AND_AWARENESS_PLANS",
        endpointUrl: "http://services.int.eoms.ac:8010/esan/communication.pdf",
      });
      await ServiceQdmsIntegration.create(c, {
        name: "Designs",
        bindingPage: "DESIGNS",
        endpointUrl: "http://services.int.eoms.ac:8010/esan/design.pdf",
      });
      await ServiceQdmsIntegration.create(c, {
        name: "Energy Policies",
        bindingPage: "ENERGY_POLICIES",
        endpointUrl: "http://services.int.eoms.ac:8010/esan/policy.pdf",
      });
      await ServiceQdmsIntegration.create(c, {
        name: "Trainings",
        bindingPage: "TRAININGS",
        endpointUrl: "http://services.int.eoms.ac:8010/esan/training.pdf",
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

      // Module Supply Chain -------------------------------------
      const pipeline1 = await ServicePipeline.create(c, "Inbound Logistics");
      const pipeline2 = await ServicePipeline.create(c, "Outbound Logistics");

      await ServiceOperation.create(c, {
        index: 0,
        name: "Goods Receiving",
        pipelineId: pipeline1.id,
      });

      await ServiceOperation.create(c, {
        index: 1,
        name: "Quality Inspection",
        pipelineId: pipeline1.id,
      });

      await ServiceOperation.create(c, {
        index: 0,
        name: "Order Processing",
        pipelineId: pipeline2.id,
      });

      await ServiceOperation.create(c, {
        index: 1,
        name: "Packaging & Dispatch",
        pipelineId: pipeline2.id,
      });
    });
  },
);

export const PatchDevSeedStage2 = ServiceRuntimePatcher.create(
  "DEV_SEED_STAGE_2",
  async (cCore) => {
    // TODO index email?
    const [exampleUser] = await cCore.db
      .select({ orgId: TbUser.orgId, userId: TbUser.id })
      .from(TbUser)
      .where(eq(TbUser.email, EXAMPLE_USER_EMAIL));
    if (!exampleUser) {
      throw new Error("Example user is not found.");
    }

    // 100 days ago from now
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
        .where(eq(TbSeu.name, "Seu"));
      const [{ id: seuId2 }] = await c.db
        .select({ id: TbSeu.id })
        .from(TbSeu)
        .where(eq(TbSeu.name, "Seu Lorem Ipsum is simply dummy text"));

      const [{ metricId: metricId1 }] = await c.db
        .select({ metricId: TbMetric.id })
        .from(TbMetric)
        .where(eq(TbMetric.name, "Metric 1"));
      const [{ metricId: metricId4 }] = await c.db
        .select({ metricId: TbMetric.id })
        .from(TbMetric)
        .where(eq(TbMetric.name, "Different Metric for Meter Slice Only"));

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

      // Second regression is for dev report render driver list without period
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
