import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css"],
  typescript: {
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        noUncheckedIndexedAccess: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
      },
    },
  },
  vite: {
    plugins: [
      // @ts-ignore — type conflict between rollup versions, works at runtime
      tailwindcss(),
    ],
  },
  modules: [
    "shadcn-nuxt",
    "@pinia/nuxt",
    "@nuxt/test-utils/module",
    "@nuxt/eslint",
  ],
  eslint: {
    checker: true,
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "@/components/ui",
  },
  imports: {
    autoImport: false,
  },
});
