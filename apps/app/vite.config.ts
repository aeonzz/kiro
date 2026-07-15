import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig({
  server: {
    port: 3000,
    allowedHosts: true,
  },
  optimizeDeps: {
    // Keep wa-sqlite out of Vite's dep pre-bundling so its `.wasm` loads from
    // node_modules (next to the JS glue) instead of a `.vite/deps` path that
    // 404s. @powersync/web stays optimized so its CJS dep (js-logger) still works.
    exclude: ["@journeyapps/wa-sqlite"],
  },
  ssr: {
    noExternal: [/katex/, /lowlight/, /platejs/],
  },
  plugins: [
    nitro(),
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart(),
    viteReact({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
});
