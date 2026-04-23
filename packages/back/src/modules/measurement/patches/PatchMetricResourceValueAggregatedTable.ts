import { getTableName } from "drizzle-orm";

import { ServiceEnv } from "@m/core/services/ServiceEnv";
import { ServiceRuntimePatcher } from "@m/core/services/ServiceRuntimePatcher";

import { TbMetricResourceValueRaw } from "../orm/TbMetricResourceValueRaw";

export const PatchMetricResourceValueAggregatedTable =
  ServiceRuntimePatcher.create(
    "PATCH_METRIC_RESOURCE_VALUE_AGGREGATED_TABLES",
    async (c) => {
      const isTestEnv = ServiceEnv.isTest();

      const queries: string[] = [];

      const tableNameRaw = getTableName(TbMetricResourceValueRaw);

      // Hyper Table
      // ---------------------------------------------------------------
      if (!isTestEnv) {
        queries.push(`
          SELECT create_hypertable(
            '${tableNameRaw}',
            'datetime',
            chunk_time_interval => interval '1 day'
          )
        `);
      }

      const aggDefs: {
        tableSuffix: string;
        startOffset: string;
        endOffset: string;
        scheduleInterval: string;
        bucketTruncate: string;
        testTruncate: string;
      }[] = [
        {
          tableSuffix: "minutely",
          startOffset: "7 days",
          endOffset: "1 minute",
          scheduleInterval: "1 minute",
          bucketTruncate: "1 minute",
          testTruncate: "minute",
        },
        {
          tableSuffix: "hourly",
          startOffset: "7 days",
          endOffset: "1 hour",
          scheduleInterval: "1 hour",
          bucketTruncate: "1 hour",
          testTruncate: "hour",
        },
        {
          tableSuffix: "daily",
          startOffset: "90 days",
          endOffset: "1 day",
          scheduleInterval: "1 day",
          bucketTruncate: "1 day",
          testTruncate: "day",
        },
        {
          tableSuffix: "monthly",
          startOffset: "1 year",
          endOffset: "1 month",
          scheduleInterval: "1 day",
          bucketTruncate: "1 month",
          testTruncate: "month",
        },
      ];

      for (let iDef = 0; iDef < aggDefs.length; ++iDef) {
        const def = aggDefs[iDef];
        const defPrev = iDef === 0 ? null : aggDefs[iDef - 1];

        const tableNameGauge = `vw_metric_resource_values_gauge_${
          def.tableSuffix
        }`;
        const tableNameCounterCumulative = `vw_metric_resource_values_counter_cumulative_${
          def.tableSuffix
        }`;
        const tableNameGaugePrev = defPrev
          ? `vw_metric_resource_values_gauge_${defPrev.tableSuffix}`
          : "";
        const tableNameCounterCumulativePrev = defPrev
          ? `vw_metric_resource_values_counter_cumulative_${
              defPrev.tableSuffix
            }`
          : "";

        // Test Env Views
        // ---------------------------------------------------------------
        if (isTestEnv) {
          // Gauge CAGGs
          // ---------------------------------------------------------------
          queries.push(`
            CREATE VIEW ${tableNameGauge} AS
            SELECT
              "orgId",
              "resourceId",
              DATE_TRUNC('${def.testTruncate}', datetime) AS bucket,
              count(*) AS "valueCount",
              avg(value) AS "valueAvg"
            FROM ${tableNameRaw}
            WHERE type = 'GAUGE'
            GROUP BY "orgId", "resourceId", bucket
          `);

          // Counter CAGGs
          // ---------------------------------------------------------------
          queries.push(`
            CREATE VIEW ${tableNameCounterCumulative} AS
            SELECT
              "orgId",
              "resourceId",
              DATE_TRUNC('${def.testTruncate}', datetime) AS bucket,
              count(*) AS "valueCount",
              max(value) AS "valueMax"
            FROM ${tableNameRaw}
            WHERE type = 'COUNTER_CUMULATIVE'
            GROUP BY "orgId", "resourceId", bucket
          `);
        }

        // TimescaleDB Views
        // ---------------------------------------------------------------
        // Note: Timecaledb automatically creates indices depending on group by,
        //   but an index for each column with bucket like (orgId, bucket) +
        //   (resourceId, bucket). So it is disabled and manually created
        //   (orgId, resourceId, bucket).
        else {
          // Gauge CAGGs
          // ---------------------------------------------------------------
          if (!defPrev) {
            queries.push(`
              CREATE MATERIALIZED VIEW IF NOT EXISTS ${tableNameGauge}
              WITH (
                timescaledb.continuous,
                timescaledb.materialized_only = false,
                timescaledb.create_group_indexes=false
              ) AS
              SELECT
                "orgId",
                "resourceId",
                time_bucket('${def.bucketTruncate}', datetime) AS bucket,
                count(*) AS "valueCount",
                avg(value) AS "valueAvg"
              FROM ${tableNameRaw}
              WHERE type = 'GAUGE'
              GROUP BY "orgId", "resourceId", bucket
            `);
          } else {
            queries.push(`
              CREATE MATERIALIZED VIEW IF NOT EXISTS ${tableNameGauge}
              WITH (
                timescaledb.continuous,
                timescaledb.materialized_only = false,
                timescaledb.create_group_indexes=false
              ) AS
              SELECT
                "orgId",
                "resourceId",
                time_bucket('${def.bucketTruncate}', bucket) AS bucket,
                sum("valueCount") AS "valueCount",
                sum("valueCount" * "valueAvg") / sum("valueCount") AS "valueAvg"
              FROM ${tableNameGaugePrev}
              GROUP BY "orgId", "resourceId", time_bucket('${def.bucketTruncate}', bucket)
            `);
          }

          queries.push(`
            CREATE INDEX "idx_${tableNameGauge}_orgId_resourceId_bucket"
            ON ${tableNameGauge} ("orgId", "resourceId", bucket);
          `);
          queries.push(`
            CREATE INDEX "idx_${tableNameGauge}_resourceId_bucket"
            ON ${tableNameGauge} ("resourceId", bucket);
          `);

          // Counter CAGGs
          // ---------------------------------------------------------------
          if (!defPrev) {
            queries.push(`
              CREATE MATERIALIZED VIEW IF NOT EXISTS ${tableNameCounterCumulative}
              WITH (
                timescaledb.continuous,
                timescaledb.materialized_only = false,
                timescaledb.create_group_indexes=false
              ) AS
              SELECT
                "orgId",
                "resourceId",
                time_bucket('${def.bucketTruncate}', datetime) AS bucket,
                count(*) AS "valueCount",
                max(value) AS "valueMax"
              FROM ${tableNameRaw}
              WHERE type = 'COUNTER_CUMULATIVE'
              GROUP BY "orgId", "resourceId", bucket
            `);
          } else {
            queries.push(`
              CREATE MATERIALIZED VIEW IF NOT EXISTS ${tableNameCounterCumulative}
              WITH (
                timescaledb.continuous,
                timescaledb.materialized_only = false,
                timescaledb.create_group_indexes=false
              ) AS
              SELECT
                "orgId",
                "resourceId",
                time_bucket('${def.bucketTruncate}', bucket) AS bucket,
                sum("valueCount") AS "valueCount",
                max("valueMax") AS "valueMax"
              FROM ${tableNameCounterCumulativePrev}
              GROUP BY "orgId", "resourceId", time_bucket('${def.bucketTruncate}', bucket)
            `);
          }

          queries.push(`
            CREATE INDEX "idx_${tableNameCounterCumulative}_orgId_resourceId_bucket"
            ON ${tableNameCounterCumulative} ("orgId", "resourceId", bucket);
          `);

          queries.push(`
            CREATE INDEX "idx_${tableNameCounterCumulative}_resourceId_bucket"
            ON ${tableNameCounterCumulative} ("resourceId", bucket);
          `);

          // CAGG Policies
          // ---------------------------------------------------------------
          queries.push(`
            SELECT add_continuous_aggregate_policy('${tableNameGauge}',
              start_offset => INTERVAL '${def.startOffset}',
              end_offset => INTERVAL '${def.endOffset}',
              schedule_interval => INTERVAL '${def.scheduleInterval}');
          `);
          queries.push(`
            SELECT add_continuous_aggregate_policy('${tableNameCounterCumulative}',
              start_offset => INTERVAL '${def.startOffset}',
              end_offset => INTERVAL '${def.endOffset}',
              schedule_interval => INTERVAL '${def.scheduleInterval}');
          `);
        }
      }

      for (const query of queries) {
        // console.log(`${query};`);
        await c.db.execute(query);
      }
    },
  );
