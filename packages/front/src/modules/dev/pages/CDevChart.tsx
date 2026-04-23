import { useMemo } from "react";

import { CBody } from "@m/base/components/CBody";
import { CChart, IChartSeries } from "@m/base/components/CChart";
import { CMiniChart, IMiniChartData } from "@m/base/components/CMiniChart";
import { CCard } from "@m/core/components/CCard";
import { CHeatmap, IHeatmapData } from "@m/core/components/CHeatmap";
import {
  CPieChart,
  IPieChartDataMulti,
  IPieChartDataSingle,
} from "@m/core/components/CPieChart";

export function CDevChart() {
  const lineSeries = useMemo<IChartSeries>(
    () => [
      {
        name: "Laptops",
        data: [
          { x: "2025-01-10", y: 21 },
          { x: "2025-01-11", y: 34 },
          { x: "2025-01-12", y: 34 },
          { x: "2025-01-13", y: 38 },
          { x: "2025-01-14", y: 33 },
          { x: "2025-01-16", y: 10 },
          { x: "2025-01-18", y: 3 },
          { x: "2025-01-20", y: 34 },
        ],
      },
      {
        name: "Desktops",
        data: [
          { x: "2025-01-10", y: 11 },
          { x: "2025-01-11", y: 14 },
          { x: "2025-01-12", y: 14 },
          { x: "2025-01-13", y: 18 },
          { x: "2025-01-14", y: 13 },
          { x: "2025-01-15", y: 12 },
          { x: "2025-01-16", y: 13 },
          { x: "2025-01-18", y: 14 },
        ],
      },
    ],
    [],
  );

  const scatterSeries = useMemo<IChartSeries>(
    () => [
      {
        name: "Laptops",
        data: [
          { x: 2, y: 33 },
          { x: 3, y: 10 },
          { x: 4, y: 38 },
          { x: 5, y: 34 },
          { x: 8, y: 3 },
          { x: 9, y: 21 },
          { x: 10, y: 34 },
          { x: 14, y: 34 },
        ],
      },
      {
        name: "Desktops",
        data: [
          { x: 2, y: 18 },
          { x: 4, y: 12 },
          { x: 5, y: 14 },
          { x: 8, y: 13 },
          { x: 12, y: 14 },
          { x: 16, y: 13 },
          { x: 18, y: 14 },
          { x: 20, y: 11 },
        ],
      },
    ],
    [],
  );

  const mixedSeries = useMemo<IChartSeries>(
    () => [
      {
        name: "Line",
        type: "line",
        data: [
          { x: "2025-01-04", y: 21 },
          { x: "2025-01-08", y: 34 },
          { x: "2025-01-12", y: 34 },
          { x: "2025-01-16", y: 3 },
          { x: "2025-01-20", y: 33 },
        ],
      },
      {
        name: "Scatter",
        type: "scatter",
        data: [
          { x: "2025-01-04", y: 24 },
          { x: "2025-01-08", y: 12 },
          { x: "2025-01-12", y: 13 },
          { x: "2025-01-16", y: 20 },
          { x: "2025-01-20", y: 18 },
        ],
      },
    ],
    [],
  );

  const coloredLineSeries = useMemo<IChartSeries>(
    () => [
      {
        name: "Laptops",
        color: "red",
        data: [
          { x: "2025-01-10", y: 21 },
          { x: "2025-01-11", y: 34 },
          { x: "2025-01-12", y: 34 },
          { x: "2025-01-13", y: 38 },
          { x: "2025-01-14", y: 33 },
          { x: "2025-01-16", y: 10 },
          { x: "2025-01-18", y: 3 },
          { x: "2025-01-20", y: 34 },
        ],
      },
      {
        name: "Desktops",
        color: "yellow",
        data: [
          { x: "2025-01-10", y: 11 },
          { x: "2025-01-11", y: 14 },
          { x: "2025-01-12", y: 14 },
          { x: "2025-01-13", y: 18 },
          { x: "2025-01-14", y: 13 },
          { x: "2025-01-15", y: 12 },
          { x: "2025-01-16", y: 13 },
          { x: "2025-01-18", y: 14 },
        ],
      },
    ],
    [],
  );

  const lineSeriesNotAligned = useMemo<IChartSeries>(
    () => [
      {
        name: "Laptops",
        data: [
          { x: "2025-01-10", y: 21 },
          { x: "2025-01-11", y: 34 },
          { x: "2025-01-12", y: 34 },
          { x: "2025-01-13", y: 38 },
          { x: "2025-01-14", y: 28 },
        ],
      },
      {
        name: "Desktops",
        data: [
          { x: "2025-01-14", y: 13 },
          { x: "2025-01-15", y: 12 },
          { x: "2025-01-16", y: 13 },
          { x: "2025-01-17", y: 14 },
        ],
      },
    ],
    [],
  );

  const isolatedPointSeries = useMemo<IChartSeries>(
    () => [
      {
        name: "Series A",
        data: [
          { x: "2025-01-10", y: 21 },
          { x: "2025-01-11", y: 34 },
          { x: "2025-01-12", y: 34 },
          { x: "2025-01-16", y: 10 },
          { x: "2025-01-19", y: 30 },
          { x: "2025-01-20", y: 34 },
          { x: "2025-01-21", y: 25 },
          { x: "2025-01-22", y: 38 },
          { x: "2025-01-23", y: 22 },
          { x: "2025-01-24", y: 15 },
        ],
      },
      {
        name: "Series B",
        data: [
          { x: "2025-01-10", y: 11 },
          { x: "2025-01-11", y: 14 },
          { x: "2025-01-12", y: 14 },
          { x: "2025-01-13", y: 18 },
          { x: "2025-01-14", y: 13 },
          { x: "2025-01-15", y: 12 },
          { x: "2025-01-16", y: 13 },
          { x: "2025-01-17", y: 14 },
          { x: "2025-01-18", y: 9 },
          { x: "2025-01-22", y: 7 },
          { x: "2025-01-24", y: 20 },
        ],
      },
    ],
    [],
  );

  const lineSeriesForMaxSpan = useMemo<IChartSeries>(
    () => [
      {
        name: "Laptops",
        data: [
          { x: "2025-01-10", y: 21 },
          { x: "2025-01-11", y: 34 },
          { x: "2025-01-12", y: 34 },
          { x: "2025-01-13", y: 38 },
          { x: "2025-01-14", y: 33 },
          { x: "2025-01-15", y: 10 },
          { x: "2025-01-18", y: 3 },
          { x: "2025-01-20", y: 34 },
        ],
      },
      {
        name: "Desktops",
        data: [
          { x: "2025-01-10", y: 11 },
          { x: "2025-01-11", y: 14 },
          { x: "2025-01-12", y: 14 },
          { x: "2025-01-13", y: 18 },
          { x: "2025-01-14", y: 13 },
          { x: "2025-01-15", y: 12 },
          { x: "2025-01-16", y: 13 },
          { x: "2025-01-18", y: 14 },
          { x: "2025-01-19", y: 13 },
          { x: "2025-01-20", y: 13 },
        ],
      },
    ],
    [],
  );

  const heatmapData = useMemo<IHeatmapData[]>(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        label: `Y${i}`,
        columns: Array.from({ length: 10 }, () => ({
          value: Math.random(),
        })),
      })),
    [],
  );

  const heatmapColumnLabels = useMemo(
    () => Array.from({ length: 10 }, (_, i) => `X${i}`),
    [],
  );

  const heatmapDataWithDescription = useMemo<IHeatmapData[]>(
    () => [
      {
        label: "Performance",
        columns: [
          {
            value: 0.85,
            description: "High correlation with efficiency metrics",
          },
          { value: 0.23, description: "Low correlation with cost metrics" },
        ],
      },
      {
        label: "Reliability",
        columns: [
          { value: 0.67, description: "Moderate correlation with performance" },
          { value: 0.91, description: "Strong correlation with uptime" },
        ],
      },
    ],
    [],
  );

  const heatmapDataCustomFormatters = useMemo<IHeatmapData[]>(
    () => [
      {
        label: "Y2",
        columns: [
          {
            value: 1.234,
            description: "1.23 (0,0)\nCustom cell formatting",
          },
          {
            value: 2.567,
            description: "2.57 (0,1)\nPosition-based display",
          },
        ],
      },
      {
        label: "Y1",
        columns: [
          {
            value: 2.891,
            description: "2.89 (1,0)\nRow 1, Column 0",
          },
          {
            value: 2.345,
            description: "2.35 (1,1)\nRow 1, Column 1",
          },
        ],
      },
    ],
    [],
  );

  const heatmapColumnLabelsSimple = useMemo(() => ["X1", "X2"], []);

  const heatmapColumnLabelsLong = useMemo(
    () => ["X1 - A long label", "X2 - A very very long label"],
    [],
  );

  const heatmapDataWithEmptyValues = useMemo<IHeatmapData[]>(
    () => [
      {
        label: "Y1",
        columns: [
          {
            value: null,
            description: "-",
          },
          {
            value: 0.42,
            description: "0.42 (0,1)\nValid value",
          },
        ],
      },
      {
        label: "Y2",
        columns: [
          {
            value: 0.88,
            description: "0.88 (1,0)\nNormal cell",
          },
          {
            value: null,
            description: "-",
          },
        ],
      },
    ],
    [],
  );

  const heatmapColumnLabelsEmpty = useMemo(() => ["X1", "X2"], []);

  const singleSeriesData = useMemo<IPieChartDataSingle>(
    () => [
      { label: "Laptops", value: 450, color: "blue" },
      { label: "Desktops", value: 280, color: "teal" },
      { label: "Tablets", value: 320, color: "yellow" },
      { label: "Monitors", value: 180, color: "red" },
      { label: "Accessories", value: 120 },
    ],
    [],
  );

  const smallSlicesData = useMemo<IPieChartDataSingle>(
    () => [
      { label: "Category A", value: 800, color: "blue" },
      { label: "Category B", value: 550, color: "teal" },
      { label: "Category C", value: 300, color: "yellow" },
      { label: "Tiny 1", value: 12, color: "red" },
      { label: "Tiny 2", value: 8 },
      { label: "Tiny 3", value: 5 },
    ],
    [],
  );

  const multiSeriesData = useMemo<IPieChartDataMulti>(
    () => ({
      labels: ["Laptops", "Desktops", "Tablets"],
      series: [
        { name: "2024 Sales", data: [350, 220, 280] },
        { name: "2025 Sales", data: [450, 280, 320] },
      ],
    }),
    [],
  );

  const basicData = useMemo<IMiniChartData>(
    () => [
      { value: 21, datetime: "2025-01-10T00:00:00Z" },
      { value: 34, datetime: "2025-01-11T00:00:00Z" },
      { value: 34, datetime: "2025-01-12T00:00:00Z" },
      { value: 38, datetime: "2025-01-13T00:00:00Z" },
      { value: 33, datetime: "2025-01-14T00:00:00Z" },
      { value: 10, datetime: "2025-01-16T00:00:00Z" },
      { value: 3, datetime: "2025-01-18T00:00:00Z" },
      { value: 34, datetime: "2025-01-20T00:00:00Z" },
    ],
    [],
  );

  const negativeData = useMemo<IMiniChartData>(
    () => [
      { value: -20 + 21, datetime: "2025-01-10T00:00:00Z" },
      { value: -20 + 34, datetime: "2025-01-11T00:00:00Z" },
      { value: -20 + 34, datetime: "2025-01-12T00:00:00Z" },
      { value: -20 + 38, datetime: "2025-01-13T00:00:00Z" },
      { value: -20 + 33, datetime: "2025-01-14T00:00:00Z" },
      { value: -20 + 10, datetime: "2025-01-16T00:00:00Z" },
      { value: -20 + 3, datetime: "2025-01-18T00:00:00Z" },
      { value: -20 + 34, datetime: "2025-01-20T00:00:00Z" },
    ],
    [],
  );

  const trendingUpData = useMemo<IMiniChartData>(
    () => [
      { value: 21, datetime: "2025-01-10T00:00:00Z" },
      { value: 28, datetime: "2025-01-11T00:00:00Z" },
      { value: 34, datetime: "2025-01-12T00:00:00Z" },
      { value: 38, datetime: "2025-01-13T00:00:00Z" },
      { value: 45, datetime: "2025-01-14T00:00:00Z" },
      { value: 52, datetime: "2025-01-15T00:00:00Z" },
      { value: 58, datetime: "2025-01-16T00:00:00Z" },
      { value: 65, datetime: "2025-01-17T00:00:00Z" },
    ],
    [],
  );

  const trendingDownData = useMemo<IMiniChartData>(
    () => [
      { value: 65, datetime: "2025-01-10T00:00:00Z" },
      { value: 58, datetime: "2025-01-11T00:00:00Z" },
      { value: 52, datetime: "2025-01-12T00:00:00Z" },
      { value: 45, datetime: "2025-01-13T00:00:00Z" },
      { value: 38, datetime: "2025-01-14T00:00:00Z" },
      { value: 34, datetime: "2025-01-15T00:00:00Z" },
      { value: 28, datetime: "2025-01-16T00:00:00Z" },
      { value: 21, datetime: "2025-01-17T00:00:00Z" },
    ],
    [],
  );

  const allZeroData = useMemo<IMiniChartData>(
    () => [
      { value: 0, datetime: "2025-01-10T00:00:00Z" },
      { value: 0, datetime: "2025-01-11T00:00:00Z" },
      { value: 0, datetime: "2025-01-12T00:00:00Z" },
      { value: 0, datetime: "2025-01-13T00:00:00Z" },
      { value: 0, datetime: "2025-01-14T00:00:00Z" },
      { value: 0, datetime: "2025-01-15T00:00:00Z" },
      { value: 0, datetime: "2025-01-16T00:00:00Z" },
      { value: 0, datetime: "2025-01-17T00:00:00Z" },
    ],
    [],
  );

  const allPositiveSameData = useMemo<IMiniChartData>(
    () => [
      { value: 5, datetime: "2025-01-10T00:00:00Z" },
      { value: 5, datetime: "2025-01-11T00:00:00Z" },
      { value: 5, datetime: "2025-01-12T00:00:00Z" },
      { value: 5, datetime: "2025-01-13T00:00:00Z" },
      { value: 5, datetime: "2025-01-14T00:00:00Z" },
      { value: 5, datetime: "2025-01-15T00:00:00Z" },
      { value: 5, datetime: "2025-01-16T00:00:00Z" },
      { value: 5, datetime: "2025-01-17T00:00:00Z" },
    ],
    [],
  );

  const allNegativeSameData = useMemo<IMiniChartData>(
    () => [
      { value: -10, datetime: "2025-01-10T00:00:00Z" },
      { value: -10, datetime: "2025-01-11T00:00:00Z" },
      { value: -10, datetime: "2025-01-12T00:00:00Z" },
      { value: -10, datetime: "2025-01-13T00:00:00Z" },
      { value: -10, datetime: "2025-01-14T00:00:00Z" },
      { value: -10, datetime: "2025-01-15T00:00:00Z" },
      { value: -10, datetime: "2025-01-16T00:00:00Z" },
      { value: -10, datetime: "2025-01-17T00:00:00Z" },
    ],
    [],
  );

  return (
    <CBody title="Dev - Charts">
      <div>Type: Line</div>
      <CCard>
        <CChart series={lineSeries} />
      </CCard>

      <div>Type: Scatter</div>
      <CCard>
        <CChart series={scatterSeries} type="scatter" individualTooltipMode />
      </CCard>

      <div>Type: Mixed</div>
      <CCard>
        <CChart series={mixedSeries} />
      </CCard>

      <div>Type: Mixed with Unit Abbreviation (kWh)</div>
      <CCard>
        <CChart series={lineSeries} unitStr="kWh" />
      </CCard>

      <div>Not aligned series</div>
      <CCard>
        <CChart series={lineSeriesNotAligned} />
      </CCard>

      <div>
        Isolated points (single points without connection shown as circles)
      </div>
      <CCard>
        <CChart series={isolatedPointSeries} />
      </CCard>

      <div>Max span feature</div>
      <CCard>
        <CChart
          maxSpanMins={
            24 * 60 // 1 day
          }
          series={lineSeriesForMaxSpan}
        />
      </CCard>

      <div>Change Colors</div>
      <CCard>
        <CChart series={coloredLineSeries} />
      </CCard>

      <div>CHeatmap - Basic Usage</div>
      <CHeatmap data={heatmapData} columnLabels={heatmapColumnLabels} />

      <div>CHeatmap - With Descriptions</div>
      <CHeatmap
        data={heatmapDataWithDescription}
        columnLabels={heatmapColumnLabelsLong}
      />

      <div>CHeatmap - Custom Formatters</div>
      <CHeatmap
        data={heatmapDataCustomFormatters}
        columnLabels={heatmapColumnLabelsSimple}
      />

      <div>CHeatmap - With Empty Values</div>
      <CHeatmap
        data={heatmapDataWithEmptyValues}
        columnLabels={heatmapColumnLabelsEmpty}
      />

      <div>
        <h2 className="text-2xl font-bold mb-6">CPieChart Showcases</h2>

        <div className="grid grid-cols-1 @md:grid-cols-2 gap-6">
          <div>
            <div className="mb-2 font-semibold">1. Classic Pie</div>
            <CCard>
              <CPieChart data={singleSeriesData} />
            </CCard>
          </div>

          <div>
            <div className="mb-2 font-semibold">2. Doughnut</div>
            <CCard>
              <CPieChart data={singleSeriesData} isDoughnut />
            </CCard>
          </div>

          <div>
            <div className="mb-2 font-semibold">
              3. Multi Series (Concentric rings)
            </div>
            <CCard>
              <CPieChart data={multiSeriesData} />
            </CCard>
          </div>

          <div>
            <div className="mb-2 font-semibold">4. Pie With Unit (kWh)</div>
            <CCard>
              <CPieChart data={singleSeriesData} unit="ENERGY_KWH" />
            </CCard>
          </div>

          <div>
            <div className="mb-2 font-semibold">
              5. Tiny Slices (Labels hidden &lt; 4%)
            </div>
            <CCard>
              <CPieChart data={smallSlicesData} />
            </CCard>
          </div>

          <div>
            <div className="mb-2 font-semibold">
              6. Doughnut + Tiny Slices + Unit (kg)
            </div>
            <CCard>
              <CPieChart
                data={smallSlicesData}
                isDoughnut
                unit="WEIGHT_KILOGRAM"
              />
            </CCard>
          </div>
        </div>
      </div>

      <div>CMiniChart Basic Usage</div>
      <CCard>
        <div className="p-4">
          <CMiniChart data={basicData} />
        </div>
      </CCard>

      <div>CMiniChart With Range</div>
      <CCard>
        <div className="p-4">
          <CMiniChart
            data={basicData}
            datetimeMin="2025-01-01T00:00:00Z"
            datetimeMax="2025-02-01T00:00:00Z"
          />
        </div>
      </CCard>

      <div>CMiniChart Negative Data</div>
      <CCard>
        <div className="p-4">
          <CMiniChart data={negativeData} />
        </div>
      </CCard>

      <div>CMiniChart Trending Up</div>
      <CCard>
        <div className="p-4">
          <CMiniChart data={trendingUpData} />
        </div>
      </CCard>

      <div>CMiniChart With Points</div>
      <CCard>
        <div className="p-4">
          <CMiniChart data={trendingUpData} showPoints />
        </div>
      </CCard>

      <div>CMiniChart Custom Size</div>
      <CCard>
        <div className="p-4">
          <CMiniChart data={trendingUpData} className="h-12" />
        </div>
      </CCard>

      <div>CMiniChart in Cards (Dashboard Example)</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CCard>
          <div className="p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Revenue
            </div>
            <div className="text-2xl font-bold mt-1 mb-3">$45,231</div>
            <CMiniChart data={trendingUpData} />
            <div className="text-xs text-green-600 dark:text-green-400 mt-2">
              +12.5%
            </div>
          </div>
        </CCard>

        <CCard>
          <div className="p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Users
            </div>
            <div className="text-2xl font-bold mt-1 mb-3">2,345</div>
            <CMiniChart data={trendingDownData} />
            <div className="text-xs text-red-600 dark:text-red-400 mt-2">
              -3.2%
            </div>
          </div>
        </CCard>
      </div>

      <div>CMiniChart in Table (Responsive)</div>
      <CCard>
        <div className="overflow-x-auto">
          <table className="min-w-[500px] w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium">
                  Product
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium">
                  Sales
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium w-32">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-700">
                <td className="py-3 px-4">Product A</td>
                <td className="py-3 px-4">$12,345</td>
                <td className="py-3 px-4">
                  <CMiniChart data={trendingUpData} />
                </td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-3 px-4">Product B</td>
                <td className="py-3 px-4">$8,921</td>
                <td className="py-3 px-4">
                  <CMiniChart data={trendingDownData} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CCard>

      <div>CMiniChart All Zero Values (Centered Line)</div>
      <CCard>
        <div className="p-4">
          <CMiniChart data={allZeroData} />
        </div>
      </CCard>

      <div>CMiniChart All Positive Same Values (Centered Line)</div>
      <CCard>
        <div className="p-4">
          <CMiniChart data={allPositiveSameData} />
        </div>
      </CCard>

      <div>CMiniChart All Negative Same Values (Centered Line)</div>
      <CCard>
        <div className="p-4">
          <CMiniChart data={allNegativeSameData} />
        </div>
      </CCard>
    </CBody>
  );
}
