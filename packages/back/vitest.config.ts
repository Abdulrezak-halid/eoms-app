import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()], // only if you are using custom tsconfig paths
  test: {
    setupFiles: "src/test/conf/setup",
    maxWorkers: "50%",
    hookTimeout: 20000,
    testTimeout: 10000,
    coverage: {
      reporter: ["text", "html" /*, "cobertura" */],
      provider: "istanbul",
      include: ["src/**"],
      exclude: ["**/orm/**", "src/index.ts"],
    },
  },
});
