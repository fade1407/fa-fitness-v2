import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tests/{unit,integration}/**/*.{test,spec}.ts?(x)"],
  },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
