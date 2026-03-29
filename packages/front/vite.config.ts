import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import UnpluginInjectPreload from "unplugin-inject-preload/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    UnpluginInjectPreload({
      files: [
        { entryMatch: /Roboto-[a-zA-Z-]*\.ttf$/ },
        { entryMatch: /Roboto-[a-zA-Z-]*\.ttf$/ },
        { entryMatch: /eoms-logo.*$/ },
        // { outputMatch: /lazy.[a-z-0-9]*.(css|js)$/ },
      ],
    }),
  ],

  assetsInclude: ["**/*.md"],

  resolve: {
    alias: {
      "@m": resolve(__dirname, "src/modules"),
      "@": resolve(__dirname, "src"),
    },
  },

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        rewrite: (path) => path.replace(/^\/api/, ""),
        ws: true,
      },
    },
  },
});
