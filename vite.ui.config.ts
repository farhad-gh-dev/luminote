// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    // tailwindcss() returns PluginOption[], so spread it
    tailwindcss(),
    viteStaticCopy({ targets: [{ src: "public/manifest.json", dest: "." }] }),
  ],
  resolve: { alias: { "@": resolve(__dirname, "src") } },
  build: {
    outDir: "build",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: "./index.html",
        background: resolve(__dirname, "src/background/background.ts"),
      },
      output: {
        entryFileNames: (chunk) =>
          chunk.name === "main" ? "assets/[name]-[hash].js" : "[name].js",
      },
    },
  },
});
