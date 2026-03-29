import { useCallback } from "react";

import { IAsyncData } from "@m/core/components/CAsyncLoader";
import { useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoAgentRegistrationStatItem } from "../interfaces/IDtoAgentRegistration";

export function useAgentMetrics(
  data: IAsyncData<IDtoAgentRegistrationStatItem>,
) {
  const { t } = useTranslation();

  const middleware = useCallback(
    (payload: IDtoAgentRegistrationStatItem) => {
      if (!payload.stats) {
        return {
          ...payload,
          stats: null,
        };
      }

      const stats = payload.stats;

      const cpuUsage =
        stats.cpu.length > 0
          ? stats.cpu.reduce((acc: number, cpu) => {
              const total =
                cpu.times.user +
                cpu.times.nice +
                cpu.times.sys +
                cpu.times.idle +
                cpu.times.irq;
              const used = total - cpu.times.idle;
              return acc + (used / total) * 100;
            }, 0) / stats.cpu.length
          : 0;

      const cpuModel = stats.cpu.length > 0 ? stats.cpu[0].model : t("unknown");

      const memoryUsed =
        (stats.memoryTotal - stats.memoryFree) / (1024 * 1024 * 1024);
      const memoryTotal = stats.memoryTotal / (1024 * 1024 * 1024);
      const memoryPercentage = (memoryUsed / memoryTotal) * 100;

      const diskStats = stats.diskUsage.reduce(
        (
          acc: { used: number; total: number },
          disk,
        ): { used: number; total: number } => {
          const sizeMatch = disk.size.match(/(\d+(\.\d+)?)/);
          const usedMatch = disk.used.match(/(\d+(\.\d+)?)/);
          const size = sizeMatch ? parseFloat(sizeMatch[1]) : 0;
          const used = usedMatch ? parseFloat(usedMatch[1]) : 0;

          return {
            used: acc.used + used,
            total: acc.total + size,
          };
        },
        { used: 0, total: 0 },
      );

      const diskPercentage =
        diskStats.total > 0 ? (diskStats.used / diskStats.total) * 100 : 0;

      return {
        ...payload,
        stats: {
          ...payload.stats,
          cpuUsage,
          cpuModel,
          memoryUsed,
          memoryTotal,
          memoryPercentage,
          diskUsed: diskStats.used,
          diskTotal: diskStats.total,
          diskPercentage,
          networkInterfaces: stats.net.length,
        },
      };
    },
    [t],
  );

  return useLoaderMiddleware(data, middleware);
}
