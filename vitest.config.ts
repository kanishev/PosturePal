import { defineVitestProject } from "@nuxt/test-utils/config";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: [
            "app/**/*.unit.{test,spec}.ts",
          ],
          environment: "node",
        },
      },
      await defineVitestProject({
        test: {
          name: "nuxt",
          include: [
            "app/**/*.nuxt.{test,spec}.ts",
          ],
          environment: "nuxt",
          environmentOptions: {
            nuxt: {
              rootDir: fileURLToPath(new URL(".", import.meta.url)),
              domEnvironment: "happy-dom",
            },
          },
          env: {
            SUPABASE_URL: "https://test.supabase.co",
            SUPABASE_PUBLISHABLE_KEY: "test-key",
          },
        },
      }),
      {
        test: {
          name: "e2e",
          include: ["test/e2e/*.{test,spec}.ts"],
          environment: "node",
        },
      },
    ],
  },
});
