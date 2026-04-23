import { FC } from "hono/jsx";
import { Data, Mark, Scale, Spec, View, parse } from "vega";

import { IReportSection } from "../interfaces/IReportSection";

type IReportHeatmapData = Extract<
  IReportSection["content"],
  { type: "HEATMAP_CUSTOM" }
>["data"];

export const CReportHeatmap: FC<{
  data: IReportHeatmapData;
}> = async ({ data }) => {
  const datas: Data[] = [];
  const marks: Mark[] = [];
  const scales: Scale[] = [];

  const values = data.serie.flatMap((i) => i.columns.map((d) => d.value));
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  datas.push({
    name: data.name,
    values: data.serie.flatMap((row) =>
      row.columns.map((val, i) => ({
        y: row.label,
        x: data.columnLabels[i],
        value: val.value,
        description: val.description,
      })),
    ),
  });

  scales.push(
    {
      name: "xscale",
      type: "band",
      domain: data.columnLabels.map((d) => d),
      range: "width",
    },
    {
      name: "yscale",
      type: "band",
      domain: data.serie.map((r) => r.label),
      range: "height",
    },
    {
      name: "colorscale",
      type: "linear",
      domain: [minValue, maxValue],

      // We can use color schemes
      // Like: scheme: "Viridis" or "Blues"
      range: {
        scheme: ["#099390", "#1d293d"],
      },
    },
  );

  // Create Marks
  marks.push(
    {
      type: "rect",
      from: { data: data.name },
      encode: {
        enter: {
          x: { scale: "xscale", field: "x" },
          y: { scale: "yscale", field: "y" },
          width: { scale: "xscale", band: 1 },
          height: { scale: "yscale", band: 1 },
          fill: { scale: "colorscale", field: "value" },
          stroke: { value: "white" },
          strokeWidth: { value: 1 },
          strokeJoin: { value: "round" },
        },
      },
    },
    {
      type: "text",
      from: { data: data.name },
      encode: {
        enter: {
          align: { value: "center" },
          baseline: { value: "top" },
          fontSize: { value: 15 },
          fill: { value: "white" },
          x: {
            scale: "xscale",
            field: "x",
            offset: { scale: "xscale", band: 0.5 },
          },
          y: { scale: "yscale", field: "y", offset: 5 },
          text: { field: "value" },
        },
      },
    },
    {
      type: "text",
      from: { data: data.name },
      encode: {
        enter: {
          align: { value: "center" },
          baseline: { value: "bottom" },
          fontSize: { value: 9 },
          fill: { value: "white" },
          x: {
            scale: "xscale",
            field: "x",
            offset: { scale: "xscale", band: 0.5 },
          },
          y: {
            scale: "yscale",
            field: "y",
            offset: { scale: "yscale", band: 1, offset: -5 },
          },
          text: { field: "description" },
        },
      },
    },
  );

  const graph: Spec = {
    $schema: "https://vega.github.io/schema/vega/v6.json",
    description: "Heatmap",
    height: 180,
    width: 180 * 3.5,
    data: datas,
    scales: scales,
    axes: [
      { orient: "bottom", scale: "xscale", labelFontSize: 12 },
      {
        orient: "right",
        scale: "yscale",
        labelFontSize: 15,
      },
    ],
    legends: [
      {
        fill: "colorscale",
        orient: "left",
        labelFontSize: 15,
        offset: 5,
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
      <div class="chart" dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
};
