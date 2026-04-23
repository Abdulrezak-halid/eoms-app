import { UtilUnit } from "common";
import { FC } from "hono/jsx";
import { Data, Mark, Spec, View, parse } from "vega";

import { IReportColor, colorValues } from "../interfaces/IColorValues";
import { IContextReport } from "../interfaces/IContextReport";
import { defaultColors } from "../interfaces/IDefaultValues";
import { IReportSection } from "../interfaces/IReportSection";

type IReportPieChartData = Extract<
  IReportSection["content"],
  { type: "PIE_CHART_CUSTOM" }
>["data"];

function getColorValue(color: IReportColor | undefined, index: number) {
  return colorValues[color || defaultColors[index % defaultColors.length]];
}

export const CReportPieChart: FC<{
  c: IContextReport;
  data: IReportPieChartData;
}> = async ({ c, data }) => {
  const datas: Data[] = [];
  const marks: Mark[] = [];
  const positiveDatas = data.records.filter((d) => d.value > 0);
  const totalValue = positiveDatas.reduce((sum, d) => sum + d.value, 0);
  const unitStr = UtilUnit.getAbbreviation(data.unit, c.i18n.t);

  datas.push({
    name: "PIE_DATA",
    values: positiveDatas.map((d) => ({
      label: d.label,
      value: Math.round(d.value * 100) / 100,
      percentage: Math.round((d.value / totalValue) * 100),
    })),
    transform: [
      {
        type: "pie",
        field: "value",
        startAngle: 0,
        endAngle: 6.29,
        sort: false,
      },
    ],
  });

  marks.push({
    type: "arc",
    from: { data: "PIE_DATA" },
    encode: {
      enter: {
        fill: { scale: "color", field: "label" },
        stroke: { value: "white" },
        strokeWidth: { value: 2 },
        strokeJoin: { value: "round" },
        x: { signal: "width/2" },
        y: { signal: "height/2" },
      },
      update: {
        startAngle: { field: "startAngle" },
        endAngle: { field: "endAngle" },
        outerRadius: { signal: "width/4" },
      },
    },
  });

  // For data label and percentage
  marks.push({
    type: "text",
    from: { data: "PIE_DATA" },
    encode: {
      enter: {
        x: { signal: "width/2" },
        y: { signal: "height/2" },
        radius: { signal: "width/4 * 0.7" },
        theta: { signal: "(datum.startAngle + datum.endAngle)/2" },
        fill: { value: "black" },
        align: { value: "center" },
        baseline: { value: "middle" },
        text: {
          signal: `datum.percentage > 5 ? datum.value + ' ${unitStr}' + ' (' + datum.percentage + '%)' : ''`,
        },
        fontSize: { value: 15 },
      },
    },
  });

  const graph: Spec = {
    $schema: "https://vega.github.io/schema/vega/v6.json",
    description: "Multi-series chart",
    height: 180,
    width: 180 * 3,
    config: {
      axis: {
        grid: true,
        labelFontSize: 15,
      },
    },
    data: datas,
    legends: [
      {
        fill: "color",
        orient: "right",
        title: "Species",
        labelFontSize: 15,
      },
    ],
    scales: [
      {
        name: "color",
        type: "ordinal",
        domain: { data: "PIE_DATA", field: "label" },
        range: positiveDatas.map((s, i) => getColorValue(s.color, i)),
      },
    ],
    marks,
  };

  const chart = new View(parse(graph), {
    renderer: "svg",
  });

  const svg = await chart.toSVG();

  return (
    <div>
      {data.title && <h3>{data.title}</h3>}
      <div class="chart" dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
};
