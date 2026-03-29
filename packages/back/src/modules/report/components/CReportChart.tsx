import { EApiFailCode, UtilDate, UtilUnit } from "common";
import { FC } from "hono/jsx";
import { Data, Mark, Scale, Spec, View, parse } from "vega";

import { ApiException } from "@m/core/exceptions/ApiException";

import { IReportColor, colorValues } from "../interfaces/IColorValues";
import { IContextReport } from "../interfaces/IContextReport";
import { defaultColors } from "../interfaces/IDefaultValues";
import { IReportSection } from "../interfaces/IReportSection";

type IReportChartData = Extract<
  IReportSection["content"],
  { type: "CHART_CUSTOM" }
>["data"];

function getColorValue(color: IReportColor | undefined, index: number) {
  return colorValues[color || defaultColors[index % defaultColors.length]];
}

export const CReportChart: FC<{
  c: IContextReport;
  data: IReportChartData;
}> = async ({ c, data }) => {
  if (data.series.length === 0) {
    return <div class="placeholder-box">{c.i18n.t("noDataAvailable")}</div>;
  }

  const datas: Data[] = [];
  const marks: Mark[] = [];
  // This scale is for x-axis
  const firstSerie = data.series?.[0]?.data?.[0]?.x;
  const allDatetimes = data.series
    .flatMap((s) => s.data.map((d) => d.x))
    .filter((x): x is string => typeof x === "string");
  const dateRange = UtilDate.getDayCount(allDatetimes);

  // X axis config
  const xScale: Scale =
    typeof firstSerie === "string"
      ? {
          name: "xscale",
          type: "utc",
          domain: {
            fields: data.series.map((s) => ({
              data: s.name,
              field: "x",
            })),
          },
          nice: false,
          range: "width",
        }
      : {
          name: "xscale",
          type: "linear",
          domain: {
            fields: data.series.map((s) => ({
              data: s.name,
              field: "x",
            })),
          },
          range: "width",
          zero: false,
        };

  data.series.forEach((serie, iSerie) => {
    datas.push({
      name: serie.name,
      values: serie.data.map((item) => ({
        x:
          typeof item.x === "string"
            ? UtilDate.isoDatetimeToUtcAsTimezoneIsoDatetime(item.x, c.tzOffset)
            : item.x,
        y: item.y,
      })),
      format: {
        parse: {
          x: "date",
        },
      },
    });

    // Create Marks
    if (serie.type === "line" || data.type === "line") {
      marks.push({
        type: "line",
        from: { data: serie.name },
        encode: {
          enter: {
            x: { scale: "xscale", field: "x" },
            y: { scale: "yscale", field: "y" },
            stroke: { value: getColorValue(serie.color, iSerie) },
          },
          update: {
            x: { scale: "xscale", field: "x" },
            y: { scale: "yscale", field: "y" },
          },
        },
      });
    } else if (serie.type === "scatter" || data.type === "scatter") {
      marks.push({
        type: "symbol",
        from: { data: serie.name },
        encode: {
          enter: {
            x: { scale: "xscale", field: "x" },
            y: { scale: "yscale", field: "y" },
            fill: { value: getColorValue(serie.color, iSerie) },
            size: { value: 100 },
            shape: { value: "circle" },
          },
        },
      });
    } else {
      throw new ApiException(EApiFailCode.BAD_REQUEST, "Invalid series type");
    }
  });

  // Show zero point line
  // TODO line is not perfectly aligned with the grid
  marks.push({
    type: "rule",
    encode: {
      enter: {
        x: { signal: "0" },
        x2: { signal: "width" },
        y: { scale: "yscale", value: 0 },
        stroke: { value: "#888" },
      },
    },
  });

  const graph: Spec = {
    $schema: "https://vega.github.io/schema/vega/v6.json",
    description: "Multi-series chart",
    height: 180,
    width: 180 * 3.5,
    padding: { left: 60, top: 20, bottom: 100, right: 220 },
    autosize: { type: "none", contains: "content" },
    config: {
      axis: {
        grid: true,
        labelFontSize: 15,
      },
      locale: {
        // number: {
        //   decimal: ".",
        //   thousands: ",",
        //   grouping: [3],
        //   currency: ["$", ""],
        // },
        time: {
          dateTime: "%a %e %b %X %Y",
          date: "%d/%m/%Y",
          time: "%H:%M:%S",
          periods: ["AM", "PM"],
          days: [
            c.i18n.t("daySunday"),
            c.i18n.t("dayMonday"),
            c.i18n.t("dayTuesday"),
            c.i18n.t("dayWednesday"),
            c.i18n.t("dayThursday"),
            c.i18n.t("dayFriday"),
            c.i18n.t("daySaturday"),
          ],
          shortDays: [
            c.i18n.t("daySun"),
            c.i18n.t("dayMon"),
            c.i18n.t("dayTue"),
            c.i18n.t("dayWed"),
            c.i18n.t("dayThu"),
            c.i18n.t("dayFri"),
            c.i18n.t("daySat"),
          ],
          months: [
            c.i18n.t("monthJanuary"),
            c.i18n.t("monthFebruary"),
            c.i18n.t("monthMarch"),
            c.i18n.t("monthApril"),
            c.i18n.t("monthMay"),
            c.i18n.t("monthJune"),
            c.i18n.t("monthJuly"),
            c.i18n.t("monthAugust"),
            c.i18n.t("monthSeptember"),
            c.i18n.t("monthOctober"),
            c.i18n.t("monthNovember"),
            c.i18n.t("monthDecember"),
          ],
          shortMonths: [
            c.i18n.t("monthShortJan"),
            c.i18n.t("monthShortFeb"),
            c.i18n.t("monthShortMar"),
            c.i18n.t("monthShortApr"),
            c.i18n.t("monthShortMay"),
            c.i18n.t("monthShortJun"),
            c.i18n.t("monthShortJul"),
            c.i18n.t("monthShortAug"),
            c.i18n.t("monthShortSep"),
            c.i18n.t("monthShortOct"),
            c.i18n.t("monthShortNov"),
            c.i18n.t("monthShortDec"),
          ],
        },
      },
    },
    data: datas,
    scales: [
      xScale,
      {
        name: "yscale",
        type: "linear",
        domain: {
          fields: data.series.map((s) => ({
            data: s.name,
            field: "y",
          })),
        },
        range: "height",
        nice: true,
      },
      // This scale is for legends

      {
        name: "color",
        type: "ordinal",
        domain: data.series.map((s) => s.name),
        range: data.series.map((s, i) => getColorValue(s.color, i)),
      },
    ],
    axes: [
      {
        orient: "bottom",
        scale: "xscale",
        labelAngle: -45,
        labelAlign: "right",
        format:
          typeof firstSerie === "string" && dateRange < 2
            ? "%d %b %I:%M %p"
            : undefined,
        tickCount:
          typeof firstSerie === "string" && dateRange < 2 ? 6 : undefined,
      },
      {
        orient: "left",
        scale: "yscale",
        title: UtilUnit.getAbbreviation(data.series[0].unit, c.i18n.t),
        // We can use 'titleColor' to stylize
        tickCount: 6,
      },
    ],
    legends: [
      {
        fill: "color",
        title: "Species",
        orient: "right",
        labelFontSize: 15,
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
