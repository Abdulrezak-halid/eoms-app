import { ServiceAdvancedRegression } from "@m/analysis/services/ServiceAdvancedRegression";
import { IEnergyResource } from "@m/base/interfaces/IEnergyResource";
import { IContextOrg } from "@m/core/interfaces/IContext";
import { IMetricIntegrationPeriod } from "@m/measurement/interfaces/IMetricIntegrationPeriod";
import { ServiceMeterSlice } from "@m/measurement/services/ServiceMeterSlice";
import { ServiceMetric } from "@m/measurement/services/ServiceMetric";
import { ServiceOutboundIntegration } from "@m/measurement/services/ServiceOutboundIntegration";
import { ServiceSeu } from "@m/measurement/services/ServiceSeu";

export namespace ServiceReportSectionData {
  export async function getMetersGroupedByEnergyResource(
    c: IContextOrg,
    datetimeMin: string,
    datetimeMax: string,
  ) {
    const meters = await ServiceMeterSlice.getAll(c, {
      datetimeMin,
      datetimeMax,
      mainOnly: true,
      noPercentage: true,
    });

    return Object.groupBy(meters, (m) => m.energyResource);
  }

  export async function getPrimaryRegressionDriverList(
    c: IContextOrg,
    datetimeMin: string,
    datetimeMax: string,
  ) {
    const primaryRegressions = await ServiceAdvancedRegression.getAllResults(
      c,
      {
        primary: true,
        datetimeMin,
        datetimeMax,
      },
    );

    const driverIds = [
      ...new Set(primaryRegressions.flatMap((r) => r.drivers.map((d) => d.id))),
    ];
    const seuIds = [
      ...new Set(primaryRegressions.flatMap((d) => (d.seu ? d.seu.id : []))),
    ];

    const [drivers, seus, integrations] = await Promise.all([
      ServiceMetric.getAll(c, { ids: driverIds }),
      ServiceSeu.getAll(c, { seuIds, datetimeMin, datetimeMax }),
      ServiceOutboundIntegration.getAll(c),
    ]);

    const seuMap = new Map(seus.map((s) => [s.id, s]));

    const metricPeriodMap = new Map<string, IMetricIntegrationPeriod>();
    const driverIdSet = new Set(driverIds);

    for (const integration of integrations) {
      for (const output of integration.outputs) {
        if (driverIdSet.has(output.metricId)) {
          metricPeriodMap.set(output.metricId, integration.config.period);
        }
      }
    }

    const driverDeptMap = new Map<string, Set<string>>();

    for (const reg of primaryRegressions) {
      if (!reg.seu) {
        continue;
      }
      const seu = seuMap.get(reg.seu.id);
      if (!seu?.departments.length) {
        continue;
      }

      for (const d of reg.drivers) {
        if (!driverDeptMap.has(d.id)) {
          driverDeptMap.set(d.id, new Set());
        }

        const set = driverDeptMap.get(d.id)!;
        seu.departments.forEach((dep) => set.add(dep.name));
      }
    }

    return drivers.map((d) => ({
      id: d.id,
      name: d.name,
      unitGroup: d.unitGroup,
      integrationPeriod: metricPeriodMap.get(d.id) || null,
      departmentNames: Array.from(driverDeptMap.get(d.id) || []),
    }));
  }

  export async function getConsumptionCostValuesMonthly(
    c: IContextOrg,
    datetimeMin: string,
    datetimeMax: string,
  ) {
    const mainMeters = await ServiceMeterSlice.getAll(c, {
      datetimeMin,
      datetimeMax,
      mainOnly: true,
      noPercentage: true,
    });

    const metricIds = mainMeters.map((d) => d.metric.id);

    const allValues = [];

    for (const metricId of metricIds) {
      const { records } = await ServiceMetric.getValues(c, "METRIC", metricId, {
        datetimeMin,
        datetimeMax,
        period: "MONTHLY",
        count: 36,
        page: 1,
      });

      allValues.push(
        ...records.map((d) => ({
          metricId,
          ...d,
        })),
      );
    }

    // Record<datetime, monthlyValueObject[]>
    const groupedValuesByDatetime = Object.groupBy(
      allValues,
      ({ datetime }) => datetime,
    );

    const rowsByDatetime = [];

    // Iterate datetimes, for each datetime there may be more than one meter,
    //   so sum up meter consumption grouping by energy resources.
    for (const datetime in groupedValuesByDatetime) {
      const energyResources: Partial<
        Record<IEnergyResource, { consumption: number; cost: number }>
      > = {};

      const valuesList = groupedValuesByDatetime[datetime];

      if (!valuesList) {
        continue;
      }

      for (const valuesRecord of valuesList) {
        const meter = mainMeters.find(
          (d) => d.metric.id === valuesRecord.metricId,
        );

        if (!meter) {
          continue;
        }

        const energyResourceContent = energyResources[meter.energyResource];
        if (!energyResourceContent) {
          energyResources[meter.energyResource] = {
            consumption: valuesRecord.value || 0,
            cost: 0,
          };
        } else {
          if (meter.consumption) {
            energyResourceContent.consumption += meter.consumption;
          }
        }
      }

      rowsByDatetime.push({
        datetime,
        energyResources,
      });
    }

    return rowsByDatetime;
  }
}
