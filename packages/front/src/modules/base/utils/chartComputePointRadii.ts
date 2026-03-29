/**
 * Returns a per-point radius array for line datasets.
 *
 * When `showAllPoints` is true every point gets `defaultRadius`.
 * When false (large dataset), only **isolated** points – those with no
 * visible line connection on either side – receive `defaultRadius`;
 * all other points get 0 so they remain invisible.
 *
 * A neighbour is considered "not connected" when:
 *   - its y value is null (gap filled by series alignment), OR
 *   - `maxSpanMins` is set and the time distance exceeds it.
 */
export function chartComputePointRadii(
  data: { x: string | number; y: number | null }[],
  defaultRadius: number,
  showAllPoints: boolean,
  maxSpanMins?: number,
): number[] {
  return data.map((point, i) => {
    if (point.y === null) {
      return 0;
    }
    if (showAllPoints) {
      return defaultRadius;
    }

    const prev = i > 0 ? data[i - 1] : null;
    const next = i < data.length - 1 ? data[i + 1] : null;

    let prevConnected = prev !== null && prev.y !== null;
    let nextConnected = next !== null && next.y !== null;

    if (maxSpanMins && typeof point.x === "string") {
      if (prevConnected && typeof prev!.x === "string") {
        const diffMin =
          Math.abs(new Date(point.x).getTime() - new Date(prev!.x).getTime()) /
          (1000 * 60);
        if (diffMin > maxSpanMins) {
          prevConnected = false;
        }
      }
      if (nextConnected && typeof next!.x === "string") {
        const diffMin =
          Math.abs(new Date(next!.x).getTime() - new Date(point.x).getTime()) /
          (1000 * 60);
        if (diffMin > maxSpanMins) {
          nextConnected = false;
        }
      }
    }

    // isolated point – no visible connection on either side → always show
    if (!prevConnected && !nextConnected) {
      return defaultRadius;
    }

    return 0;
  });
}
