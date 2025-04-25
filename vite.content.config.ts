// vite.config.ts
import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
