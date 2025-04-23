// vite.config.ts
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  resolve: { alias: { "@": resolve(__dirname, "src") } },
  build: {
    outDir: "build",
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, "src/content/content-script.ts"),
      output: {
        format: "iife",
        entryFileNames: "content-script.js",
        inlineDynamicImports: true,
      },
    },
  },
});
