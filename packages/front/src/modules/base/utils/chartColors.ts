export const chartColorInfos = {
  blue: {
    light: "oklch(70.7% 0.165 254.624)",
    dark: "oklch(62.3% 0.214 259.815)",
  },
  teal: {
    light: "oklch(77.7% 0.152 181.912)",
    dark: "oklch(70.4% 0.14 182.503)",
  },
  green: {
    light: "oklch(79.2% 0.209 151.711)",
    dark: "oklch(72.3% 0.219 149.579)",
  },
  yellow: {
    light: "oklch(85.2% 0.199 91.936)",
    dark: "oklch(79.5% 0.184 86.047)",
  },
  red: {
    light: "oklch(70.4% 0.191 22.216)",
    dark: "oklch(63.7% 0.237 25.331)",
  },
  purple: {
    light: "oklch(71.4% 0.203 305.504)",
    dark: "oklch(62.7% 0.265 303.9)",
  },
  cyan: {
    light: "oklch(78.9% 0.154 211.53)",
    dark: "oklch(71.5% 0.143 215.221)",
  },
};

export type IChartDataColor = keyof typeof chartColorInfos;

export const defaultChartColors: IChartDataColor[] = [
  "teal",
  "blue",
  "yellow",
  "red",
  "green",
  "purple",
  "cyan",
];
